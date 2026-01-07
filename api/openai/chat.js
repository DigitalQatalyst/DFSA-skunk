/**
 * Vercel API Handler - Azure OpenAI Chat
 * Endpoint: POST /api/openai/chat
 */

import { AzureOpenAI, OpenAI } from "openai";

// Initialize OpenAI client (Azure or standard)
let client;
let deploymentName;

function initializeClient() {
  if (client) return;

  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const azureKey = process.env.AZURE_OPENAI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (azureEndpoint && azureKey) {
    // Azure OpenAI
    deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4-32k";
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview";

    client = new AzureOpenAI({
      endpoint: azureEndpoint,
      apiKey: azureKey,
      apiVersion,
    });

    console.log(`[OpenAI] Using Azure OpenAI: ${deploymentName}`);
  } else if (openaiKey && openaiKey !== "sk-your-openai-api-key-here") {
    // Standard OpenAI
    client = new OpenAI({ apiKey: openaiKey });
    deploymentName = process.env.OPENAI_MODEL || "gpt-4o-mini";

    console.log(`[OpenAI] Using OpenAI: ${deploymentName}`);
  } else {
    console.warn("[OpenAI] WARNING: No API key configured.");
    console.warn("AZURE_OPENAI_ENDPOINT:", process.env.AZURE_OPENAI_ENDPOINT ? "set" : "not set");
    console.warn("AZURE_OPENAI_API_KEY:", process.env.AZURE_OPENAI_API_KEY ? "set" : "not set");
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  initializeClient();

  if (!client) {
    return res.status(503).json({
      error: "OpenAI client not configured. Set API keys in environment.",
    });
  }

  try {
    const { messages, creative = false } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const completion = await client.chat.completions.create({
      model: deploymentName,
      messages,
      temperature: creative ? 0.9 : 0.0,
      max_tokens: 2048,
    });

    const content = completion.choices[0]?.message?.content || "";

    res.status(200).json({
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
}
