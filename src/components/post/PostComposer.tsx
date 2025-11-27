import { useState, useEffect } from 'react';
import { useAuth } from '../../context/UnifiedAuthProvider';
import { supabase } from '../../supabase/client';
import { safeFetch } from '../../utils/safeFetch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { RichTextEditor } from './RichTextEditor';
import { TagAutocomplete } from './TagAutocomplete';
import { Loader2, X, Plus, FileText, Image as ImageIcon, BarChart3, Calendar, MapPin, Link as LinkIcon, Tag as TagIcon } from 'lucide-react';
import { toast } from 'sonner';
interface Community {
  id: string;
  name: string;
}
interface PostComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: () => void;
  communityId?: string;
}
type PostType = 'text' | 'media' | 'poll' | 'event';
export function PostComposer({
  open,
  onOpenChange,
  onPostCreated,
  communityId: initialCommunityId
}: PostComposerProps) {
  const {
    user
  } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [postType, setPostType] = useState<PostType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Media post fields
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');

  // Poll post fields
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [pollDuration, setPollDuration] = useState('7');

  // Event post fields
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [rsvpLimit, setRsvpLimit] = useState('');

  // Character counts
  const titleCharCount = title.length;
  const contentCharCount = content.length;
  useEffect(() => {
    if (open && user) {
      fetchUserCommunities();
      if (initialCommunityId) {
        setCommunityId(initialCommunityId);
      }
    }
  }, [open, user, initialCommunityId]);

  // Reset form when closed
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);
  const resetForm = () => {
    setPostType('text');
    setTitle('');
    setContent('');
    setContentHtml('');
    setTags([]);
    setTagInput('');
    setMediaUrl('');
    setCaption('');
    setPollOptions(['', '']);
    setPollDuration('7');
    setEventStart('');
    setEventEnd('');
    setEventLocation('');
    setEventImage('');
    setRsvpLimit('');
    if (!initialCommunityId) {
      setCommunityId('');
    }
  };
  const fetchUserCommunities = async () => {
    if (!user) return;
    setLoading(true);
    const {
      data: memberships,
      error: membershipsError
    } = await supabase.from('memberships').select('community_id').eq('user_id', user.id);
    if (membershipsError) {
      toast.error('Failed to load your communities');
      setLoading(false);
      return;
    }
    const communityIds = memberships?.map(m => m.community_id) || [];
    if (communityIds.length === 0) {
      setCommunities([]);
      setLoading(false);
      return;
    }
    const query = supabase.from('communities').select('id, name').in('id', communityIds);
    const [data, error] = await safeFetch(query);
    if (error) {
      toast.error('Failed to load your communities');
    } else if (data) {
      setCommunities(data as Community[]);
    }
    setLoading(false);
  };
  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };
  const handleAddPollOption = () => {
    if (pollOptions.length >= 5) {
      toast.error('Maximum 5 poll options allowed');
      return;
    }
    setPollOptions([...pollOptions, '']);
  };
  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length <= 2) {
      toast.error('Minimum 2 poll options required');
      return;
    }
    setPollOptions(pollOptions.filter((_, i) => i !== index));
  };
  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };
  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (title.length > 100) {
      toast.error('Title must be 100 characters or less');
      return false;
    }
    if (!content.trim()) {
      toast.error('Content is required');
      return false;
    }
    if (content.length > 1000) {
      toast.error('Content must be 1000 characters or less');
      return false;
    }
    if (!communityId) {
      toast.error('Please select a community');
      return false;
    }

    // Type-specific validation
    if (postType === 'media' && !mediaUrl.trim()) {
      toast.error('Media URL is required for media posts');
      return false;
    }
    if (postType === 'poll') {
      const validOptions = pollOptions.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        toast.error('At least 2 poll options are required');
        return false;
      }
    }
    if (postType === 'event') {
      if (!eventStart) {
        toast.error('Event start date/time is required');
        return false;
      }
      if (!eventLocation.trim()) {
        toast.error('Event location is required');
        return false;
      }
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validateForm()) return;
    setSubmitting(true);
    try {
      // Prepare metadata based on post type
      const metadata: any = {};
      if (postType === 'media') {
        metadata.media_url = mediaUrl;
        metadata.caption = caption;
      }
      if (postType === 'poll') {
        metadata.poll_duration_days = parseInt(pollDuration);
      }
      if (postType === 'event') {
        metadata.start_datetime = eventStart;
        if (eventEnd) metadata.end_datetime = eventEnd;
        metadata.location = eventLocation;
        if (eventImage) metadata.image = eventImage;
        if (rsvpLimit) metadata.rsvp_limit = parseInt(rsvpLimit);
      }

      // Insert the post
      const query = supabase.from('posts').insert({
        title,
        content,
        content_html: contentHtml,
        post_type: postType,
        metadata,
        tags,
        community_id: communityId,
        created_by: user.id,
        status: 'active'
      }).select().single();
      const [postData, postError] = await safeFetch(query);
      if (postError || !postData) {
        console.error('Post creation failed:', postError);

        // Extract specific error details
        const errorMessage = postError?.message || 'Failed to create post';
        const errorDetails = postError?.details || '';
        const errorHint = postError?.hint || 'Please check all required fields and try again';
        toast.error(errorMessage, {
          description: errorDetails || errorHint,
          duration: 5000
        });
        setSubmitting(false);
        return;
      }

      // If poll, insert poll options
      if (postType === 'poll' && postData) {
        const validOptions = pollOptions.filter(opt => opt.trim());
        const optionsToInsert = validOptions.map(option => ({
          post_id: postData.id,
          option_text: option.trim(),
          vote_count: 0
        }));
        const optionsQuery = supabase.from('poll_options').insert(optionsToInsert);
        const [, optionsError] = await safeFetch(optionsQuery);
        if (optionsError) {
          console.error('Failed to insert poll options:', optionsError);
          toast.error('Post created but poll options failed', {
            description: optionsError?.message || 'Your post was created but poll options could not be added',
            duration: 5000
          });
        }
      }
      toast.success('Post created successfully!');
      resetForm();
      onPostCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Post creation error:', error);
      toast.error('Failed to create post');
    }
    setSubmitting(false);
  };
  const isFormValid = title.trim() && content.trim() && communityId && !submitting;
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Post</DialogTitle>
          <DialogDescription>
            Share your thoughts, media, polls, or events with your community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type Tabs */}
          <Tabs value={postType} onValueChange={value => setPostType(value as PostType)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted h-auto p-1">
              <TabsTrigger value="text" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <FileText className="h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="media" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <ImageIcon className="h-4 w-4" />
                Media
              </TabsTrigger>
              <TabsTrigger value="poll" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <BarChart3 className="h-4 w-4" />
                Poll
              </TabsTrigger>
              <TabsTrigger value="event" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Calendar className="h-4 w-4" />
                Event
              </TabsTrigger>
            </TabsList>

            {/* Common Fields */}
            <div className="space-y-4 mt-4">
              {/* Community Selection */}
              {!initialCommunityId && <div className="space-y-2">
                  <Label htmlFor="community">Community</Label>
                  <Select value={communityId} onValueChange={setCommunityId} disabled={loading || submitting}>
                    <SelectTrigger id="community">
                      <SelectValue placeholder="Select a community" />
                    </SelectTrigger>
                    <SelectContent>
                      {communities.map(community => <SelectItem key={community.id} value={community.id}>
                          {community.name}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                  {communities.length === 0 && !loading && <p className="text-sm text-muted-foreground">
                      Join a community first to create posts
                    </p>}
                </div>}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-muted-foreground text-xs">({titleCharCount}/100)</span>
                </Label>
                <Input id="title" placeholder="Enter post title..." value={title} onChange={e => setTitle(e.target.value)} required disabled={submitting} maxLength={100} />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">
                  Content <span className="text-muted-foreground text-xs">({contentCharCount}/1000)</span>
                </Label>
                <RichTextEditor content={contentHtml} onUpdate={(html, text) => {
                setContentHtml(html);
                setContent(text);
              }} placeholder="What's on your mind?" />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  Tags (Optional)
                </Label>
                <TagAutocomplete selectedTags={tags} onTagsChange={handleTagsChange} maxTags={5} />
              </div>
            </div>

            {/* Type-Specific Fields */}
            <TabsContent value="media" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mediaUrl" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Media URL *
                </Label>
                <Input id="mediaUrl" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="https://example.com/image.jpg" disabled={submitting} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption">Caption (Optional)</Label>
                <Input id="caption" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add a caption..." disabled={submitting} />
              </div>
            </TabsContent>

            <TabsContent value="poll" className="space-y-4">
              <div className="space-y-2">
                <Label>Poll Options</Label>
                {pollOptions.map((option, index) => <div key={index} className="flex gap-2">
                    <Input value={option} onChange={e => handlePollOptionChange(index, e.target.value)} placeholder={`Option ${index + 1}`} disabled={submitting} maxLength={200} />
                    {pollOptions.length > 2 && <Button type="button" variant="outline" size="icon" onClick={() => handleRemovePollOption(index)} disabled={submitting}>
                        <X className="h-4 w-4" />
                      </Button>}
                  </div>)}
                {pollOptions.length < 5 && <Button type="button" variant="outline" onClick={handleAddPollOption} disabled={submitting} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pollDuration">Poll Duration (Days)</Label>
                <Select value={pollDuration} onValueChange={setPollDuration} disabled={submitting}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="event" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventStart">Start Date/Time *</Label>
                  <Input id="eventStart" type="datetime-local" value={eventStart} onChange={e => setEventStart(e.target.value)} disabled={submitting} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventEnd">End Date/Time</Label>
                  <Input id="eventEnd" type="datetime-local" value={eventEnd} onChange={e => setEventEnd(e.target.value)} disabled={submitting} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventLocation" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location *
                </Label>
                <Input id="eventLocation" value={eventLocation} onChange={e => setEventLocation(e.target.value)} placeholder="Event location..." disabled={submitting} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventImage">Cover Image URL</Label>
                <Input id="eventImage" value={eventImage} onChange={e => setEventImage(e.target.value)} placeholder="https://example.com/event-cover.jpg" disabled={submitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rsvpLimit">RSVP Limit (Optional)</Label>
                <Input id="rsvpLimit" type="number" value={rsvpLimit} onChange={e => setRsvpLimit(e.target.value)} placeholder="Max attendees..." disabled={submitting} min="1" />
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || submitting}>
              {submitting ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </> : 'Create Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
}