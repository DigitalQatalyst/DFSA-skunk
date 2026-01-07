import os
from pathlib import Path
from pypdf import PdfReader

KB_DIR = Path(__file__).parent / "knowledge_base"

def load_pdf_kb() -> list[dict]:
    """Load all PDFs from knowledge_base folder"""
    kb = []
    
    if not KB_DIR.exists():
        KB_DIR.mkdir(exist_ok=True)
        return kb
    
    for pdf_file in KB_DIR.glob("*.pdf"):
        try:
            # Try to read as PDF first
            try:
                reader = PdfReader(pdf_file)
                pages_loaded = 0
                for page_num, page in enumerate(reader.pages):
                    try:
                        text = page.extract_text()
                        if text.strip():
                            kb.append({
                                "topic": pdf_file.stem,
                                "content": text,
                                "page": page_num + 1,
                                "source": pdf_file.name
                            })
                            pages_loaded += 1
                    except Exception as page_error:
                        continue
                if pages_loaded > 0:
                    print(f"Successfully loaded {pages_loaded} pages from {pdf_file.name}")
                else:
                    raise ValueError("No pages could be extracted")
            except Exception as pdf_error:
                # If PDF reading fails, try reading as text (for markdown files saved as .pdf)
                print(f"PDF parsing failed for {pdf_file.name}, trying as text file: {pdf_error}")
                try:
                    with open(pdf_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if content.strip():
                            kb.append({
                                "topic": pdf_file.stem,
                                "content": content,
                                "page": 1,
                                "source": pdf_file.name
                            })
                            print(f"Successfully loaded {pdf_file.name} as text content")
                except Exception as text_error:
                    print(f"Error loading {pdf_file} as text: {text_error}")
        except Exception as e:
            print(f"Error processing {pdf_file}: {e}")
    
    return kb

def get_kb() -> list[dict]:
    """Get knowledge base (PDFs + defaults)"""
    pdf_kb = load_pdf_kb()
    
    # Fallback defaults if no PDFs
    defaults = [
        {"topic": "Company Overview", "content": "AI solutions provider specializing in enterprise AI integration, machine learning, and NLP.", "page": 0, "source": "default"},
        {"topic": "Products", "content": "AI-powered search, chatbots, document analysis, and custom LLM solutions.", "page": 0, "source": "default"},
        {"topic": "Services", "content": "Consulting, implementation, training, and 24/7 support for AI systems.", "page": 0, "source": "default"},
        {"topic": "Pricing", "content": "Starter ($999/mo), Professional ($4,999/mo), Enterprise (custom).", "page": 0, "source": "default"},
    ]
    
    return pdf_kb if pdf_kb else defaults
