import { useState, useEffect } from "react";
import { useAuth } from "../../context/UnifiedAuthProvider";
import { supabase } from "../../supabase/client";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Textarea } from "../ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  EyeOff,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { ModerationAPI } from "../../services/ModerationAPI";
import { safeFetch } from "../../utils/safeFetch";
interface ReportDetail {
  id: string;
  report_type: "post" | "comment";
  status: "pending" | "resolved" | "dismissed";
  reason: string | null;
  created_at: string;
  reporter_username: string;
  community_id: string;
  community_name: string;
  content_title?: string;
  content_text: string;
  content_author: string;
  content_id: string;
}
interface ReportDetailDrawerProps {
  reportId: string;
  onClose: () => void;
  onUpdate: () => void;
}
export function ReportDetailDrawer({
  reportId,
  onClose,
  onUpdate,
}: ReportDetailDrawerProps) {
  const { user } = useAuth();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showWarnDialog, setShowWarnDialog] = useState(false);
  const [showHideDialog, setShowHideDialog] = useState(false);
  const [actionReason, setActionReason] = useState("");

  // Moderation reason templates
  const reasonTemplates = {
    spam: "This content appears to be spam or promotional material",
    harassment: "This content contains harassment or bullying",
    offensive: "This content is offensive or inappropriate",
    misinformation: "This content contains false or misleading information",
    offtopic: "This content is off-topic or irrelevant to the community",
    rules: "This content violates community guidelines",
  };
  useEffect(() => {
    fetchReportDetail();
  }, [reportId]);
  const fetchReportDetail = async () => {
    setLoading(true);

    // Fetch report metadata from reports_with_details view (bypasses RLS)
    const reportQuery = supabase
      .from("reports_with_details")
      .select("*")
      .eq("id", reportId)
      .maybeSingle();
    const [reportData] = await safeFetch(reportQuery);
    if (!reportData) {
      setLoading(false);
      return;
    }

    // Determine target type and ID
    const targetType =
      reportData.target_type === "comment" ? "comment" : "post";
    const targetId =
      reportData.target_type === "comment"
        ? reportData.comment_id
        : reportData.post_id;
    if (!targetId) {
      setLoading(false);
      return;
    }

    // Fetch content preview using ModerationAPI
    const contentPreview = await ModerationAPI.getTargetPreview(
      targetType,
      targetId
    );
    if (contentPreview) {
      setReport({
        id: reportData.id,
        report_type: targetType,
        status: reportData.status,
        reason: reportData.reason,
        created_at: reportData.created_at,
        reporter_username: reportData.reporter_username || "Unknown",
        community_id: reportData.community_id,
        community_name: reportData.community_name || "Unknown",
        content_title: contentPreview.title,
        content_text: contentPreview.content,
        content_author: contentPreview.authorUsername,
        content_id: targetId,
      });
    }
    setLoading(false);
  };
  const handleAction = async (
    action: "approve" | "hide" | "warn" | "dismiss" | "delete"
  ) => {
    if (!report || !user) return;
    console.log("Taking action:", action, "on report:", report.id);
    setProcessing(true);
    const result = await ModerationAPI.takeAction(
      {
        reportId: report.id,
        action,
        reason: actionReason || undefined,
      },
      user.email
    );
    console.log("Action result:", result);
    if (result.success) {
      toast.success(`Report ${action}d successfully`);
      setActionReason("");
      setShowWarnDialog(false);
      setShowHideDialog(false);
      setShowDeleteDialog(false);
      console.log("Refreshing report details...");

      // Small delay to ensure DB changes propagate
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Refresh report to show updated status
      await fetchReportDetail();
      console.log("Report details refreshed, new status:", report?.status);
      console.log("Calling onUpdate to refresh parent...");
      onUpdate();
    } else {
      toast.error(result.error || "Failed to process action");
    }
    setProcessing(false);
  };
  if (loading) {
    return (
      <Sheet open={true} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-white">
          <SheetHeader>
            <Skeleton className="h-6 w-32" />
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  if (!report) {
    return null;
  }
  return (
    <>
      <Sheet open={true} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-white">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl">Report Details</SheetTitle>
              <Badge
                className={
                  report.status === "pending"
                    ? "bg-amber-100 text-amber-800 border-amber-200"
                    : report.status === "resolved"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-gray-100 text-gray-800 border-gray-200"
                }
              >
                {report.status}
              </Badge>
            </div>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Report Info */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge className="capitalize">{report.report_type}</Badge>
                <Badge
                  className={
                    report.status === "pending"
                      ? "bg-amber-100 text-amber-800 border-amber-200"
                      : report.status === "resolved"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }
                >
                  {report.status}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Reported by:</span>{" "}
                  <span className="font-medium">
                    {report.reporter_username}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Community:</span>{" "}
                  <span className="font-medium">{report.community_name}</span>
                </p>
                <p>
                  <span className="text-gray-500">Date:</span>{" "}
                  {format(new Date(report.created_at), "MMM d, yyyy h:mm a")}
                </p>
                {report.reason && (
                  <p>
                    <span className="text-gray-500">Reason:</span>{" "}
                    {report.reason}
                  </p>
                )}
              </div>
            </div>

            {/* Content Preview */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Reported Content
              </h3>
              {report.content_title && (
                <p className="text-base font-semibold text-gray-900 mb-2">
                  {report.content_title}
                </p>
              )}
              <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                {report.content_text}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Author: {report.content_author}
              </p>
              {report.report_type === "post" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    window.open(`/post/${report.content_id}`, "_blank")
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Post
                </Button>
              )}
            </div>

            {/* Actions - Only show if report is pending */}
            {report.status === "pending" && (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => handleAction("approve")}
                  disabled={processing}
                  className="w-full px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Content
                </Button>

                <Button
                  onClick={() => setShowHideDialog(true)}
                  disabled={processing}
                  variant="secondary"
                  className="w-full px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 border-orange-200"
                >
                  <EyeOff className="mr-2 h-4 w-4" />
                  Hide Content
                </Button>

                <Button
                  onClick={() => setShowWarnDialog(true)}
                  disabled={processing}
                  variant="secondary"
                  className="w-full px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 border-amber-200"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Warn User
                </Button>

                <Button
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={processing}
                  variant="secondary"
                  className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Content
                </Button>

                <Button
                  onClick={() => handleAction("dismiss")}
                  disabled={processing}
                  variant="secondary"
                  className="w-full px-4 py-2 text-sm font-medium"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Dismiss Report
                </Button>
              </div>
            )}

            {/* Show status message if already actioned */}
            {report.status !== "pending" && (
              <div className="pt-4 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-800">
                    This report has been{" "}
                    <span className="font-semibold">{report.status}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {report.report_type}? This
              action cannot be undone and will permanently remove the content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">
                Quick Reasons
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(reasonTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActionReason(template)}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">
                Reason (optional)
              </label>
              <Textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Explain why this content is being deleted..."
                className="min-h-[80px]"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleAction("delete")}
              disabled={processing}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {processing ? "Deleting..." : "Delete Content"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Warn Dialog */}
      <AlertDialog open={showWarnDialog} onOpenChange={setShowWarnDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Warn User</AlertDialogTitle>
            <AlertDialogDescription>
              Send a warning to the content author. The content will remain
              visible but the author will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">
                Quick Reasons
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(reasonTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActionReason(template)}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">
                Warning Message (optional)
              </label>
              <Textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Explain the issue to the user..."
                className="min-h-[80px]"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleAction("warn")}
              disabled={processing}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {processing ? "Sending..." : "Send Warning"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hide Dialog */}
      <AlertDialog open={showHideDialog} onOpenChange={setShowHideDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Hide Content</AlertDialogTitle>
            <AlertDialogDescription>
              Hide this {report.report_type} from public view. It will only be
              visible to moderators and the author.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">
                Quick Reasons
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(reasonTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActionReason(template)}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">
                Reason (optional)
              </label>
              <Textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Explain why this content is being hidden..."
                className="min-h-[80px]"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleAction("hide")}
              disabled={processing}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {processing ? "Hiding..." : "Hide Content"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
