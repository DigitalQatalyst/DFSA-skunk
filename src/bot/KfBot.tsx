"use client";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/UnifiedAuthProvider";

/**
 * KfBot Component
 * Previously used for Voiceflow integration.
 * Now a no-op component as we've migrated to OpenAI-based chat.
 * Kept for backward compatibility and potential future use.
 */
const KfBot = () => {
  // Component is now a no-op since we're using OpenAI instead of Voiceflow
  return null;
};

export default KfBot;
