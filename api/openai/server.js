/**
 * Standalone Node.js OpenAI Chat Server
 * Run: node api/openai/server.js
 * Endpoint: http://localhost:3003
 */

import { AzureOpenAI } from "openai";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Azure OpenAI client
let client;
let deploymentName;

const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureKey = process.env.AZURE_OPENAI_API_KEY;

if (azureEndpoint && azureKey) {
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview";

  client = new AzureOpenAI({
    endpoint: azureEndpoint,
    apiKey: azureKey,
    apiVersion,
  });

  deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4-32k";
  console.log(`[OpenAI] Using Azure OpenAI: ${deploymentName}`);
  console.log(`[OpenAI] Endpoint: ${azureEndpoint}`);
} else {
  console.error("[OpenAI] ERROR: Azure OpenAI credentials not configured");
  console.error("[OpenAI] Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY");
  process.exit(1);
}

/**
 * Chat endpoint
 * POST /api/openai/chat
 */
app.post("/api/openai/chat", async (req, res) => {
  try {
    const { messages, creative = false } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    console.log(`[OpenAI] Processing request with ${messages.length} messages`);

    const completion = await client.chat.completions.create({
      model: deploymentName,
      messages,
      temperature: creative ? 0.9 : 0.0,
      max_tokens: 2048,
    });

    const content = completion.choices[0]?.message?.content || "";

    res.json({
      content,
      model: deploymentName,
      usage: completion.usage,
    });
  } catch (error) {
    console.error("[OpenAI] Error:", error.message);
    res.status(500).json({
      error: error.message || "Failed to get response",
    });
  }
});

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    client_configured: !!client,
    deployment: deploymentName || null,
  });
});

/**
 * API info
 */
app.get("/", (req, res) => {
  res.json({
    name: "Node.js OpenAI Chat API",
    version: "1.0.0",
    endpoints: {
      chat: "POST /api/openai/chat",
      health: "GET /health",
    },
  });
});

const PORT = process.env.OPENAI_PORT || 3003;

app.listen(PORT, () => {
  console.log(`[OpenAI] Server running on http://localhost:${PORT}`);
});
