import React from "react";
import { cn } from "../../lib/utils";
interface GradientAvatarProps {
  className?: string;
  seed?: string;
}
export function GradientAvatar({ className, seed = "" }: GradientAvatarProps) {
  // Generate consistent gradient based on seed
  const getGradient = (s: string | null | undefined) => {
    const gradients = [
      "bg-gradient-to-br from-[hsl(224,100%,45%)] to-[hsl(266,93%,64%)]",
      // blue to purple
      "bg-gradient-to-br from-[hsl(175,100%,45%)] to-[hsl(224,100%,45%)]",
      // teal to blue
      "bg-gradient-to-br from-[hsl(266,93%,64%)] to-[hsl(175,100%,45%)]",
      // purple to teal
      "bg-gradient-to-br from-[hsl(224,100%,45%)] to-[hsl(175,100%,45%)]", // blue to teal
    ];

    // Handle null/undefined/empty seed
    const safeSeed = s || "default";

    const hash = safeSeed.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return gradients[Math.abs(hash) % gradients.length];
  };
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        getGradient(seed),
        className
      )}
    />
  );
}
