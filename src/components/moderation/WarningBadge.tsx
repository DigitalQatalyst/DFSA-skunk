import { AlertTriangle } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface WarningBadgeProps {
  reason?: string;
}

export function WarningBadge({ reason }: WarningBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 cursor-help flex items-center gap-1 py-0">
            <AlertTriangle className="h-3 w-3" />
            <span className="text-[8px] font-medium">Content Warning</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">
            {reason || "This content has been flagged by moderators"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
