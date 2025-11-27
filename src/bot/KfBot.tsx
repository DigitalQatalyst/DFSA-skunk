"use client";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/UnifiedAuthProvider";

declare global {
  interface Window {
    voiceflow?: {
      chat?: {
        load: (opts: any) => Promise<void>;
        close?: () => void;
        interact?: (payload: any) => void;
        destroy?: () => void;
        open?: () => void;
        show?: () => void;
      };
    };

    __KF_VOICEFLOW_WIDGET__?: {
      loadPromise?: Promise<void>;
      loaded?: boolean;
    };
  }
}

// Voiceflow widget is expected to be loaded globally (see index.html).
// This component only sends context to the bot and tweaks UI (e.g., hide prompt label).
const KfBot = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isReady = useRef(false);
  const isInitialized = useRef(false);
  const loadingInProgress = useRef(false);

  // Initialize Voiceflow chat
  useEffect(() => {
    if (isInitialized.current || loadingInProgress.current) return;
    loadingInProgress.current = true;

    const ensureLoaded = async () => {
      const loaderState = (window.__KF_VOICEFLOW_WIDGET__ ||= {});
      if (loaderState.loaded) {
        isInitialized.current = true;
        isReady.current = true;
        loadingInProgress.current = false;
        return;
      }

      if (loaderState.loadPromise) {
        await loaderState.loadPromise;
        isInitialized.current = true;
        isReady.current = true;
        loadingInProgress.current = false;
        return;
      }

      let script = document.getElementById("voiceflow-script") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = "voiceflow-script";
        script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
        script.type = "text/javascript";
        document.body.appendChild(script);
      }

      const waitForScript = () =>
        new Promise<void>((resolve, reject) => {
          if (!script) {
            resolve();
            return;
          }

          // Check if script is already loaded
          const scriptElement = script as HTMLScriptElement & { readyState?: string };
          if (scriptElement.readyState === undefined || scriptElement.readyState === "complete") {
            resolve();
            return;
          }

          script.addEventListener("load", () => resolve(), { once: true });
          script.addEventListener("error", () => reject(new Error("Voiceflow script failed to load")), {
            once: true,
          });
        });

      loaderState.loadPromise = (async () => {
        try {
          await waitForScript();
          await window.voiceflow?.chat?.load({
            verify: { projectID: "6849bea9894655c0d600d259" },
            url: "https://general-runtime.voiceflow.com",
            versionID: "production",
            voice: { url: "https://runtime-api.voiceflow.com" },
          });
          loaderState.loaded = true;
          isInitialized.current = true;
          isReady.current = true;
        } catch (error) {
          console.error("Failed to load Voiceflow:", error);
        } finally {
          loadingInProgress.current = false;
          loaderState.loadPromise = undefined;
        }
      })();

      await loaderState.loadPromise;
    };

    ensureLoaded();
  }, []);

  // Hide the "Test your agent" text badge/prompt, keep the launcher icon.
  useEffect(() => {
    const hideLauncherPrompt = () => {
      try {
        // Try a few likely selectors first
        const selectors = [
          '[class*="launcher"][class*="prompt"]',
          '[class*="prompt"][class*="launcher"]',
          '[data-testid*="prompt"]',
          '[class*="vf"][class*="prompt"]',
        ];
        for (const sel of selectors) {
          const el = document.querySelector(sel) as HTMLElement | null;
          if (el) {
            el.style.setProperty('display', 'none', 'important');
          }
        }
        // Fallback: find any node that contains the default label text and hide its container
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
        const toHide: HTMLElement[] = [];
        while (walker.nextNode()) {
          const node = walker.currentNode as HTMLElement;
          const text = (node.textContent || '').trim().toLowerCase();
          if (!text) continue;
          if (text === 'test your agent' || text.includes('test your agent')) {
            const container = (node.closest('[class*="prompt"]') as HTMLElement) || (node.parentElement as HTMLElement);
            if (container) toHide.push(container);
          }
        }
        toHide.forEach((n) => n.style.setProperty('display', 'none', 'important'));
      } catch {}
    };

    // Run once and then observe for DOM changes, since the widget mounts asynchronously
    const observer = new MutationObserver(() => hideLauncherPrompt());
    observer.observe(document.body, { childList: true, subtree: true });
    hideLauncherPrompt();

    return () => observer.disconnect();
  }, []);

  // When user is logged in and widget is ready, send launch payload
  useEffect(() => {
    if (!user) return;

    const sendPayload = () => {
      try {
        window.voiceflow?.chat?.interact?.({
          type: "launch",
          payload: {
            user_id: user?.id,
            user_name: user?.name,
            user_email: user?.email,
            route: location.pathname,
          },
        });
      } catch (e) {
        // ignore
      }
    };

    if (isReady.current && (window as any).voiceflow?.chat?.interact) {
      sendPayload();
      return;
    }

    // Wait briefly for widget to become ready
    let tries = 0;
    const maxTries = 40; // ~2s at 50ms interval
    const timer = setInterval(() => {
      tries++;
      if ((window as any).voiceflow?.chat?.interact) {
        clearInterval(timer);
        isReady.current = true;
        sendPayload();
      } else if (tries >= maxTries) {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [user?.id, user?.email, user?.name, location.pathname]);

  return null;
};

export default KfBot;
