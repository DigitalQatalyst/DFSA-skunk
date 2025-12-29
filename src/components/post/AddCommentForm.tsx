import React, { useState } from "react";
import { useAuth } from "../../context/UnifiedAuthProvider";
import { supabase } from "../../supabase/client";
import { safeFetch } from "../../utils/safeFetch";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { LoginForm } from "../../components/auth/LoginForm";
import { Dialog, DialogContent } from "../../components/ui/dialog";
interface AddCommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}
export function AddCommentForm({
  postId,
  onCommentAdded,
}: AddCommentFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;
    setSubmitting(true);
    const query = supabase.from("comments").insert({
      post_id: postId,
      content: content.trim(),
      created_by: user.id,
    });
    const [, error] = await safeFetch(query);
    if (error) {
      toast.error("Failed to add comment");
    } else {
      toast.success("Comment added!");
      setContent("");
      onCommentAdded();
      // Scroll to bottom after a short delay to allow new comment to render
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
    setSubmitting(false);
  };
  if (!user) {
    return (
      <>
        <div className="text-center">
          <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">
            Join the conversation
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to share your thoughts and connect with the community
          </p>
          <Button onClick={() => setShowLoginModal(true)}>Sign In</Button>
        </div>
        <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
          <DialogContent>
            <LoginForm />
          </DialogContent>
        </Dialog>
      </>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          id="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full min-h-[120px]"
          disabled={submitting}
          required
        />
      </div>
      <div className="flex justify-end">
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          type="submit"
          disabled={submitting || !content.trim()}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post Comment"
          )}
        </Button>
      </div>
    </form>
  );
}
