import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { supabase } from "../../supabase/client";
import { useAuth } from "../../context/UnifiedAuthProvider";
import { useToast } from "../../hooks/use-toast";
import { AlertTriangle } from "lucide-react";

// Helper function to check if user has already reported content
export async function checkIfAlreadyReported(
  userId: string,
  targetType: "post" | "comment",
  targetId: string
): Promise<boolean> {
  console.log("🔍 Checking for duplicate report:", {
    userId,
    targetType,
    targetId,
  });

  try {
    // Use RPC function to bypass RLS policies
    const { data, error } = await supabase.rpc("check_duplicate_report", {
      p_user_id: userId,
      p_target_type: targetType,
      p_target_id: targetId,
    });

    console.log("🔍 Duplicate check result:", {
      data,
      error,
      alreadyReported: !!data,
    });

    if (error) {
      console.error("❌ Error checking existing report:", error);
      return false;
    }

    // RPC returns boolean directly
    return !!data;
  } catch (error) {
    console.error("❌ Exception checking existing report:", error);
    return false;
  }
}
interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: "post" | "comment" | "user";
  targetId: string;
  communityId: string;
}
export function ReportModal({
  open,
  onOpenChange,
  targetType,
  targetId,
  communityId,
}: ReportModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reportType, setReportType] = useState<string>("spam");
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setReportType("spam");
      setCustomReason("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to report content",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const reason = reportType === "other" ? customReason : reportType;

    console.log("📝 Submitting report:", {
      userId: user.id,
      userEmail: user.email,
      targetType,
      targetId,
      communityId,
      reason,
    });

    try {
      const { data, error } = await supabase.rpc("create_report_secure", {
        p_user_email: user.email,
        p_target_type: targetType,
        p_target_id: targetId,
        p_community_id: communityId,
        p_reason: reason,
        p_post_id: targetType === "post" ? targetId : undefined,
        p_comment_id: targetType === "comment" ? targetId : undefined,
      });

      console.log("📝 Report submission result:", { data, error });

      const result = data as {
        success: boolean;
        error?: string;
      } | null;

      if (error || (result && !result.success)) {
        toast({
          title: "Report Failed",
          description:
            result?.error ||
            error?.message ||
            "Failed to submit report. Please try again.",
          variant: "destructive",
        });
        console.error("Report error:", error || result?.error);
      } else {
        toast({
          title: "Report Submitted",
          description:
            "Thank you. Your report has been submitted for review by our moderation team.",
          variant: "success",
        });
        onOpenChange(false);
        setReportType("spam");
        setCustomReason("");
      }
    } catch (err) {
      toast({
        title: "Report Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Report submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Report {targetType}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">
            Please select a reason for reporting this {targetType}:
          </p>

          <RadioGroup value={reportType} onValueChange={setReportType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="spam" id="spam" />
              <Label
                htmlFor="spam"
                className="font-normal cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                Spam or misleading
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="offensive" id="offensive" />
              <Label
                htmlFor="offensive"
                className="font-normal cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                Offensive or abusive
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rules" id="rules" />
              <Label
                htmlFor="rules"
                className="font-normal cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                Violates community rules
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label
                htmlFor="other"
                className="font-normal cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                Other
              </Label>
            </div>
          </RadioGroup>

          {reportType === "other" && (
            <Textarea
              placeholder="Please describe the issue..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="min-h-[100px]"
            />
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              submitting || (reportType === "other" && !customReason.trim())
            }
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
