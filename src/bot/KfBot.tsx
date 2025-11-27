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
  }
}

// Voiceflow widget is loaded globally in index.html.
// This component only sends user context to the bot.
const KfBot = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isReady = useRef(false);

  // Hide the "Test your agent" text badge/prompt, keep the launcher icon.
  // Commented out to show the launcher prompt
  // useEffect(() => {
  //   const hideLauncherPrompt = () => {
  //     try {
  //       // Try a few likely selectors first
  //       const selectors = [
  //         '[class*="launcher"][class*="prompt"]',
  //         '[class*="prompt"][class*="launcher"]',
  //         '[data-testid*="prompt"]',
  //         '[class*="vf"][class*="prompt"]',
  //       ];
  //       for (const sel of selectors) {
  //         const el = document.querySelector(sel) as HTMLElement | null;
  //         if (el) {
  //           el.style.setProperty('display', 'none', 'important');
  //         }
  //       }
  //       // Fallback: find any node that contains the default label text and hide its container
  //       const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  //       const toHide: HTMLElement[] = [];
  //       while (walker.nextNode()) {
  //         const node = walker.currentNode as HTMLElement;
  //         const text = (node.textContent || '').trim().toLowerCase();
  //         if (!text) continue;
  //         if (text === 'test your agent' || text.includes('test your agent')) {
  //           const container = (node.closest('[class*="prompt"]') as HTMLElement) || (node.parentElement as HTMLElement);
  //           if (container) toHide.push(container);
  //         }
  //       }
  //       toHide.forEach((n) => n.style.setProperty('display', 'none', 'important'));
  //     } catch {}
  //   };

  //   // Run once and then observe for DOM changes, since the widget mounts asynchronously
  //   const observer = new MutationObserver(() => hideLauncherPrompt());
  //   observer.observe(document.body, { childList: true, subtree: true });
  //   hideLauncherPrompt();

  //   return () => observer.disconnect();
  // }, []);

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
