import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/UnifiedAuthProvider";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { supabase } from "../../supabase/client";
import { toast } from "sonner";
import {
  Send,
  Maximize2,
  Image,
  BarChart3,
  Calendar,
  Clock,
  ChevronUp,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { RichTextEditor } from "../../components/post/RichTextEditor";
import { InlineMediaUpload } from "./InlineMediaUpload";
import { PollOptionsInput } from "./PollOptionsInput";
import { LinkPreview } from "./LinkPreview";
import { Button } from "../ui/button";
interface InlineComposerProps {
  communityId?: string;
  onPostCreated?: () => void;
}
type PostType = "text" | "media" | "poll" | "event";
interface Community {
  id: string;
  name: string;
}
interface UploadedFile {
  id: string;
  url: string;
  type: string;
  caption?: string;
}
export const InlineComposer: React.FC<InlineComposerProps> = ({
  communityId,
  onPostCreated,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [postType, setPostType] = useState<PostType>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState(
    communityId || ""
  );
  const [communities, setCommunities] = useState<Community[]>([]);

  // Media post state
  const [mediaFile, setMediaFile] = useState<UploadedFile | null>(null);

  // Poll post state
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);

  // Event post state
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  // Link preview state
  const [detectedLink, setDetectedLink] = useState<string | null>(null);
  const [showLinkPreview, setShowLinkPreview] = useState(true);
  useEffect(() => {
    if (!communityId && user) {
      fetchCommunities();
    }
  }, [communityId, user]);

  // Autosave draft
  useEffect(() => {
    const draftKey = `inline-draft-${communityId || "global"}-${postType}`;
    const timer = setTimeout(() => {
      if (title || content || pollQuestion) {
        const draft = {
          postType,
          title,
          content,
          contentHtml,
          pollQuestion,
          pollOptions,
          eventDate,
          eventTime,
          eventLocation,
          timestamp: Date.now(),
        };
        localStorage.setItem(draftKey, JSON.stringify(draft));
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [
    title,
    content,
    contentHtml,
    pollQuestion,
    pollOptions,
    eventDate,
    eventTime,
    eventLocation,
    postType,
    communityId,
  ]);

  // Load draft on mount
  useEffect(() => {
    const draftKey = `inline-draft-${communityId || "global"}-${postType}`;
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (Date.now() - draft.timestamp < 24 * 60 * 60 * 1000) {
          // 24h expiry
          setTitle(draft.title || "");
          setContent(draft.content || "");
          setContentHtml(draft.contentHtml || "");
          setPollQuestion(draft.pollQuestion || "");
          setPollOptions(draft.pollOptions || ["", ""]);
          setEventDate(draft.eventDate || "");
          setEventTime(draft.eventTime || "");
          setEventLocation(draft.eventLocation || "");
        }
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, [postType, communityId]);

  // Link detection
  useEffect(() => {
    if (postType === "text" && content) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const match = content.match(urlRegex);
      if (match && match[0]) {
        setDetectedLink(match[0]);
      } else {
        setDetectedLink(null);
      }
    }
  }, [content, postType]);
  const fetchCommunities = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("memberships")
      .select("community_id, communities(id, name)")
      .eq("user_id", user.id);
    if (!error && data) {
      const communityList = data.map((m: any) => m.communities).filter(Boolean);
      setCommunities(communityList);
    }
  };
  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to create a post");
      return;
    }
    const targetCommunityId = communityId || selectedCommunityId;
    if (!targetCommunityId) {
      toast.error("Please select a community");
      return;
    }

    // Type-specific validation
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (postType === "text" && !content.trim()) {
      toast.error("Content is required");
      return;
    }
    if (postType === "media" && !mediaFile) {
      toast.error("Please upload a file");
      return;
    }
    if (postType === "poll") {
      if (!pollQuestion.trim()) {
        toast.error("Poll question is required");
        return;
      }
      const validOptions = pollOptions.filter((opt) => opt.trim());
      if (validOptions.length < 2) {
        toast.error("Add at least two poll options");
        return;
      }
    }
    if (postType === "event") {
      if (!eventDate) {
        toast.error("Event date is required");
        return;
      }
      const eventDateTime = new Date(eventDate);
      if (eventDateTime < new Date()) {
        toast.error("Event date cannot be in the past");
        return;
      }
    }
    setSubmitting(true);
    try {
      // Parse hashtags and mentions
      const hashtagRegex = /#(\w+)/g;
      const tags = [...(content.match(hashtagRegex) || [])].map((tag) =>
        tag.slice(1)
      );

      // Prepare post data
      const postData: any = {
        title: title.trim(),
        community_id: targetCommunityId,
        created_by: user.id,
        post_type: postType,
        status: "active",
        tags: tags.length > 0 ? tags : null,
      };

      // Type-specific data
      if (postType === "text") {
        postData.content = content.trim();
        postData.content_html = contentHtml;
      } else if (postType === "poll") {
        postData.content = title.trim(); // Use title for poll question
      } else if (postType === "event") {
        const eventDateTime = eventTime
          ? `${eventDate}T${eventTime}`
          : eventDate;
        postData.event_date = eventDateTime;
        postData.event_location = eventLocation.trim() || null;
      }
      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert(postData)
        .select()
        .single();
      if (postError) throw postError;

      // Create related records
      if (postType === "media" && mediaFile) {
        await supabase.from("media_files").insert({
          post_id: post.id,
          user_id: user.id,
          file_url: mediaFile.url,
          file_type: mediaFile.type,
          caption: mediaFile.caption || null,
          display_order: 0,
        });
      }
      if (postType === "poll") {
        const validOptions = pollOptions.filter((opt) => opt.trim());
        const endsAt = new Date();
        endsAt.setDate(endsAt.getDate() + 7); // 7 days default

        const { error: pollError } = await supabase.from("poll_options").insert(
          validOptions.map((option) => ({
            post_id: post.id,
            option_text: option.trim(),
            vote_count: 0,
          }))
        );
        if (pollError) {
          console.error("Poll options error:", pollError);
          throw new Error("Failed to create poll options");
        }
      }

      // Clear form
      toast.success("Posted!");
      clearForm();
      console.log("post created successfully", post);
      navigate(`/post/${post.id}`);

      // Clear draft
      const draftKey = `inline-draft-${communityId || "global"}-${postType}`;
      localStorage.removeItem(draftKey);
      onPostCreated?.();
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };
  const clearForm = () => {
    setTitle("");
    setContent("");
    setContentHtml("");
    setPollQuestion("");
    setPollOptions(["", ""]);
    setEventDate("");
    setEventTime("");
    setEventLocation("");
    setMediaFile(null);
    setDetectedLink(null);
    if (!communityId) setSelectedCommunityId("");
  };
  const handleOpenFullEditor = () => {
    const targetCommunityId = communityId || selectedCommunityId;
    const draft = {
      title,
      content,
      contentHtml,
      postType,
      communityId: targetCommunityId,
      pollQuestion,
      pollOptions,
      eventDate,
      eventTime,
      eventLocation,
      timestamp: Date.now(),
    };
    localStorage.setItem("post-draft", JSON.stringify(draft));
    const params = new URLSearchParams();
    if (targetCommunityId) params.set("communityId", targetCommunityId);
    params.set("type", postType);
    navigate(`/create-post?${params.toString()}`);
  };
  const handleRichTextUpdate = (html: string, text: string) => {
    setContentHtml(html);
    setContent(text);
  };
  const handleTypeChange = (newType: PostType) => {
    setPostType(newType);
    setIsExpanded(true); // Expand when a type is selected
    // Reset type-specific fields
    if (newType !== "media") setMediaFile(null);
    if (newType !== "poll") {
      setPollQuestion("");
      setPollOptions(["", ""]);
    }
    if (newType !== "event") {
      setEventDate("");
      setEventTime("");
      setEventLocation("");
    }
  };
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleQuickSubmit(e as any);
      }
    },
    [handleQuickSubmit]
  );
  const isFormValid = () => {
    const targetCommunityId = communityId || selectedCommunityId;
    if (!targetCommunityId || !title.trim()) return false;
    switch (postType) {
      case "text":
        return content.trim().length > 0;
      case "media":
        return mediaFile !== null;
      case "poll":
        return (
          pollQuestion.trim().length > 0 &&
          pollOptions.filter((opt) => opt.trim()).length >= 2
        );
      case "event":
        return eventDate !== "";
      default:
        return false;
    }
  };
  const getPostButtonLabel = () => {
    switch (postType) {
      case "media":
        return "Post Media";
      case "poll":
        return "Post Poll";
      case "event":
        return "Post Event";
      default:
        return "Post";
    }
  };
  if (!user) {
    return null;
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white font-semibold">
            {user.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Create a Post</h3>
        </div>
        {isExpanded && (
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="text-blue-600 transition-colors font-medium"
          >
            collapse
          </button>
        )}
      </div>

      <form
        onSubmit={handleQuickSubmit}
        onKeyDown={handleKeyDown}
        className="space-y-4"
      >
        {/* Post Type Selector */}
        <Tabs
          value={postType}
          onValueChange={(value) => handleTypeChange(value as PostType)}
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="text" className="flex items-center gap-1.5">
              <span className="text-sm">Text</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-1.5">
              <Image className="h-3.5 w-3.5" />
              <span className="text-sm">Media</span>
            </TabsTrigger>
            <TabsTrigger value="poll" className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              <span className="text-sm">Poll</span>
            </TabsTrigger>
            <TabsTrigger value="event" className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-sm">Event</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Collapsible Form Content */}
        {isExpanded && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Community Selection (only if not provided) */}
            {!communityId && (
              <div>
                <Label
                  htmlFor="community"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Community <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedCommunityId}
                  onValueChange={setSelectedCommunityId}
                >
                  <SelectTrigger className="border border-gray-300 rounded-md">
                    <SelectValue placeholder="Select a community" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {communities.map((community) => (
                      <SelectItem key={community.id} value={community.id}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Title Input - All Types */}
            <div>
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                {postType === "poll"
                  ? "Poll Question"
                  : postType === "event"
                  ? "Event Title"
                  : "Title"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder={
                  postType === "poll"
                    ? "Ask a question..."
                    : postType === "event"
                    ? "Event name..."
                    : "Post title..."
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={150}
                className="text-base"
              />
            </div>

            {/* TYPE-SPECIFIC FIELDS */}

            {/* TEXT POST */}
            {postType === "text" && (
              <>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Content <span className="text-red-500">*</span>
                  </Label>
                  <RichTextEditor
                    content={contentHtml}
                    onUpdate={handleRichTextUpdate}
                    placeholder="Share your thoughts... Use #hashtags and @mentions"
                    maxLength={1500}
                    mode="short"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ⌘/Ctrl + Enter to post • Shift + Enter for new line
                  </p>
                </div>

                {/* Link Preview */}
                {detectedLink && showLinkPreview && (
                  <LinkPreview
                    url={detectedLink}
                    onRemove={() => setShowLinkPreview(false)}
                  />
                )}
              </>
            )}

            {/* MEDIA POST */}
            {postType === "media" && (
              <>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Upload File <span className="text-red-500">*</span>
                  </Label>
                  <InlineMediaUpload
                    file={mediaFile}
                    onFileChange={setMediaFile}
                    userId={user.id}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use full editor for multiple uploads
                  </p>
                </div>
              </>
            )}

            {/* POLL POST */}
            {postType === "poll" && (
              <>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Poll Options <span className="text-red-500">*</span>
                  </Label>
                  <PollOptionsInput
                    options={pollOptions}
                    onOptionsChange={setPollOptions}
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Duration: 7 days (default) • Use full editor for custom
                    duration
                  </p>
                </div>
              </>
            )}

            {/* EVENT POST */}
            {postType === "event" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="event-date"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="event-time"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Time
                    </Label>
                    <Input
                      id="event-time"
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="event-location"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Location
                  </Label>
                  <Input
                    id="event-location"
                    placeholder="Where will it happen?"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    maxLength={200}
                  />
                </div>

                <p className="text-xs text-gray-500">
                  Use full editor for description, banner image, and RSVP
                  options
                </p>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 flex-wrap">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleOpenFullEditor}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Maximize2 className="h-4 w-4 mr-1.5" />
                Advanced options
              </Button>

              <Button
                type="submit"
                disabled={submitting || !isFormValid()}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {submitting ? (
                  "Posting..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-1.5" />
                    {getPostButtonLabel()}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
