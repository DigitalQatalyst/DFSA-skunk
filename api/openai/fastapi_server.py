"""
FastAPI Server for Azure OpenAI Chat with Prompt Management
Loads prompts from .ai/notebooks and .ai/prompts directories

Run: python api/openai/fastapi_server.py
Endpoint: http://localhost:3003
"""

import os
import json
import glob
from pathlib import Path
from typing import List, Optional
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AzureOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

# Load environment variables
load_dotenv()
load_dotenv(".env.local")

# Initialize FastAPI app
app = FastAPI(title="FastAPI OpenAI Chat API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Azure OpenAI client
azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
azure_key = os.getenv("AZURE_OPENAI_API_KEY")
deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4-32k")
api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")

if not azure_endpoint or not azure_key:
    raise ValueError("Azure OpenAI credentials not configured")

client = AzureOpenAI(
    api_key=azure_key,
    api_version=api_version,
    azure_endpoint=azure_endpoint,
)

print(f"[FastAPI] Using Azure OpenAI: {deployment_name}")
print(f"[FastAPI] Endpoint: {azure_endpoint}")


# ============================================================================
# Prompt Management
# ============================================================================

class PromptManager:
    """Manages loading and caching prompts from notebooks and prompt files"""

    def __init__(self):
        self.prompts = {}
        self.load_prompts()

    def load_prompts(self):
        """Load all prompts from .ai/notebooks and .ai/prompts directories"""
        self.load_notebook_prompts()
        self.load_prompt_files()
        print(f"[PromptManager] Loaded {len(self.prompts)} prompts")

    def load_notebook_prompts(self):
        """Extract prompts from Jupyter notebooks"""
        notebook_dir = Path(".ai/notebooks")
        if not notebook_dir.exists():
            print(f"[PromptManager] Notebooks directory not found: {notebook_dir}")
            return

        for notebook_file in notebook_dir.glob("*.ipynb"):
            try:
                with open(notebook_file, "r", encoding="utf-8") as f:
                    notebook = json.load(f)

                # Extract code cells that contain prompt definitions
                for i, cell in enumerate(notebook.get("cells", [])):
                    if cell.get("cell_type") == "code":
                        source = "".join(cell.get("source", []))

                        # Look for prompt variable assignments
                        if "prompt" in source.lower() and '"""' in source:
                            prompt_name = f"{notebook_file.stem}_cell_{i}"
                            # Extract the prompt content
                            try:
                                # Simple extraction of triple-quoted strings
                                start = source.find('"""') + 3
                                end = source.rfind('"""')
                                if start > 2 and end > start:
                                    prompt_content = source[start:end].strip()
                                    self.prompts[prompt_name] = {
                                        "content": prompt_content,
                                        "source": str(notebook_file),
                                        "type": "notebook",
                                    }
                            except Exception as e:
                                print(f"[PromptManager] Error extracting prompt from {notebook_file}: {e}")
            except Exception as e:
                print(f"[PromptManager] Error loading notebook {notebook_file}: {e}")

    def load_prompt_files(self):
        """Load prompts from .ai/prompts directory"""
        prompts_dir = Path(".ai/prompts")
        if not prompts_dir.exists():
            print(f"[PromptManager] Prompts directory not found: {prompts_dir}")
            return

        for prompt_file in prompts_dir.glob("*.prompt.md"):
            try:
                with open(prompt_file, "r", encoding="utf-8") as f:
                    content = f.read()

                prompt_name = prompt_file.stem.replace(".prompt", "")
                self.prompts[prompt_name] = {
                    "content": content,
                    "source": str(prompt_file),
                    "type": "file",
                }
            except Exception as e:
                print(f"[PromptManager] Error loading prompt file {prompt_file}: {e}")

    def get_prompt(self, name: str) -> Optional[str]:
        """Get a prompt by name"""
        if name in self.prompts:
            return self.prompts[name]["content"]
        return None

    def list_prompts(self) -> List[dict]:
        """List all available prompts"""
        return [
            {
                "name": name,
                "source": info["source"],
                "type": info["type"],
            }
            for name, info in self.prompts.items()
        ]


# Initialize prompt manager
prompt_manager = PromptManager()


# ============================================================================
# Request/Response Models
# ============================================================================

class Message(BaseModel):
    role: str  # 'system', 'user', or 'assistant'
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    creative: Optional[bool] = False
    system_prompt: Optional[str] = None
    prompt_template: Optional[str] = None  # Name of prompt template to use


class ChatResponse(BaseModel):
    content: str
    model: str
    usage: Optional[dict] = None


class PromptInfo(BaseModel):
    name: str
    source: str
    type: str


# ============================================================================
# Chat Endpoints
# ============================================================================

@app.post("/api/openai/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a chat message and get an AI response.
    Supports custom system prompts and prompt templates.
    """
    try:
        messages = []

        # Add system prompt
        if request.system_prompt:
            messages.append({"role": "system", "content": request.system_prompt})
        elif request.prompt_template:
            # Load prompt template from manager
            template_content = prompt_manager.get_prompt(request.prompt_template)
            if template_content:
                messages.append({"role": "system", "content": template_content})
            else:
                raise ValueError(f"Prompt template '{request.prompt_template}' not found")

        # Add conversation history
        for msg in request.messages:
            messages.append({"role": msg.role, "content": msg.content})

        # Get response
        response = client.chat.completions.create(
            model=deployment_name,
            messages=messages,
            temperature=0.9 if request.creative else 0.0,
            max_tokens=2048,
        )

        return ChatResponse(
            content=response.choices[0].message.content,
            model=deployment_name,
            usage={
                "completion_tokens": response.usage.completion_tokens,
                "prompt_tokens": response.usage.prompt_tokens,
                "total_tokens": response.usage.total_tokens,
            },
        )

    except Exception as e:
        print(f"[FastAPI] Error in chat endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/openai/chat-with-template", response_model=ChatResponse)
async def chat_with_template(request: ChatRequest):
    """
    Chat endpoint that uses a prompt template with variable substitution.
    Useful for RAG and context-aware responses.
    """
    try:
        if not request.prompt_template:
            raise ValueError("prompt_template is required for this endpoint")

        # Get the template
        template_content = prompt_manager.get_prompt(request.prompt_template)
        if not template_content:
            raise ValueError(f"Prompt template '{request.prompt_template}' not found")

        # Create prompt template
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", template_content),
            ("user", "{query}"),
        ])

        # Get the user query from the last message
        user_query = request.messages[-1].content if request.messages else ""

        # Format the template with context if provided
        template_vars = {"query": user_query}

        # Add any additional context from system messages
        for msg in request.messages:
            if msg.role == "system":
                template_vars["context"] = msg.content

        # Format and invoke
        formatted_prompt = prompt_template.format_messages(**template_vars)

        # Convert to dict format for OpenAI API
        messages = [
            {"role": msg.type if hasattr(msg, 'type') else "user", "content": msg.content}
            for msg in formatted_prompt
        ]

        # Get response
        response = client.chat.completions.create(
            model=deployment_name,
            messages=messages,
            temperature=0.9 if request.creative else 0.0,
            max_tokens=2048,
        )

        return ChatResponse(
            content=response.choices[0].message.content,
            model=deployment_name,
            usage={
                "completion_tokens": response.usage.completion_tokens,
                "prompt_tokens": response.usage.prompt_tokens,
                "total_tokens": response.usage.total_tokens,
            },
        )

    except Exception as e:
        print(f"[FastAPI] Error in chat-with-template endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Prompt Management Endpoints
# ============================================================================

@app.get("/api/prompts", response_model=List[PromptInfo])
async def list_prompts():
    """List all available prompts"""
    return prompt_manager.list_prompts()


@app.get("/api/prompts/{prompt_name}")
async def get_prompt(prompt_name: str):
    """Get a specific prompt by name"""
    content = prompt_manager.get_prompt(prompt_name)
    if not content:
        raise HTTPException(status_code=404, detail=f"Prompt '{prompt_name}' not found")
    return {"name": prompt_name, "content": content}


# ============================================================================
# Health & Info Endpoints
# ============================================================================

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "ok",
        "llm_configured": True,
        "deployment": deployment_name,
        "prompts_loaded": len(prompt_manager.prompts),
    }


@app.get("/")
async def root():
    """API info"""
    return {
        "name": "FastAPI OpenAI Chat API",
        "version": "1.0.0",
        "endpoints": {
            "chat": "POST /api/openai/chat",
            "chat_with_template": "POST /api/openai/chat-with-template",
            "list_prompts": "GET /api/prompts",
            "get_prompt": "GET /api/prompts/{prompt_name}",
            "health": "GET /health",
        },
        "prompts_available": len(prompt_manager.prompts),
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("FASTAPI_PORT", "3003"))
    uvicorn.run(app, host="0.0.0.0", port=port)
