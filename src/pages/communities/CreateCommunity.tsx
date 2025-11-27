import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Loader2,
  PlusCircle,
  HomeIcon,
  ChevronRightIcon,
  Upload,
  X,
  Lightbulb,
} from "lucide-react";
import { useAuth } from "../../context/UnifiedAuthProvider";
import { useToast } from "../../hooks/use-toast";
import { supabase } from "../../supabase/client";
import { safeFetch } from "../../utils/safeFetch";
import { isValidTag } from "../../utils/validation";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { MainLayout } from "../../components/layouts/MainLayout";
import { PageLayout } from "../../components/PageLayout";

const CATEGORIES = [
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "creative", label: "Creative" },
  { value: "social", label: "Social" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health & Wellness" },
  { value: "sports", label: "Sports & Fitness" },
  { value: "arts", label: "Arts & Culture" },
  { value: "other", label: "Other" },
];

const COMMUNITY_LIMITS = {
  MAX_TAGS: 10,
};

const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};

export default function CreateCommunity() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: `Image size must be less than ${
            UPLOAD_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)
          }MB`,
          variant: "destructive",
        });
        e.target.value = ""; // Reset input
        return;
      }

      // Validate file type - only allow specific image formats
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Please select a valid image file (PNG, JPG, or WEBP)",
          variant: "destructive",
        });
        e.target.value = ""; // Reset input
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read image file",
          variant: "destructive",
        });
        e.target.value = ""; // Reset input
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();

    // Check if tag is empty
    if (!trimmedTag) {
      return;
    }

    // Check if tag already exists
    if (tags.includes(trimmedTag)) {
      toast({
        title: "Error",
        description: "This tag has already been added",
        variant: "destructive",
      });
      return;
    }

    // Check max tags limit
    if (tags.length >= COMMUNITY_LIMITS.MAX_TAGS) {
      toast({
        title: "Error",
        description: `Maximum ${COMMUNITY_LIMITS.MAX_TAGS} tags allowed`,
        variant: "destructive",
      });
      return;
    }

    // Validate tag format
    const tagValidation = isValidTag(trimmedTag);
    if (!tagValidation.valid) {
      toast({
        title: "Error",
        description: tagValidation.error || "Invalid tag format",
        variant: "destructive",
      });
      return;
    }

    setTags([...tags, trimmedTag]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile || !user) {
      console.log("Upload aborted - imageFile:", !!imageFile, "user:", !!user);
      return "";
    }

    setUploadingImage(true);
    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `community-covers/${user.id}-${Date.now()}.${fileExt}`;

      console.log("Uploading image:", fileName);
      console.log("File size:", imageFile.size, "bytes");
      console.log("File type:", imageFile.type);

      const { data, error: uploadError } = await supabase.storage
        .from("community-posts")
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      if (!data || !data.path) {
        throw new Error("No data returned from upload");
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("community-posts").getPublicUrl(data.path);

      console.log("Image uploaded successfully:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
      return "";
    } finally {
      setUploadingImage(false);
    }
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .substring(0, 100); // Limit length
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a community",
        variant: "destructive",
      });
      return;
    }

    // Validate all required fields
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Community name is required",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Description is required",
        variant: "destructive",
      });
      return;
    }

    if (!category || category.trim() === "") {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      console.log("Category validation failed:", category);
      return;
    }

    if (tags.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one tag",
        variant: "destructive",
      });
      console.log("Tags validation failed:", tags);
      return;
    }

    console.log("All validations passed - Category:", category, "Tags:", tags);

    setSubmitting(true);

    try {
      // Upload image if provided
      let imageUrl: string | null = null;
      console.log("Image file selected:", imageFile ? "Yes" : "No");
      console.log("Image file details:", imageFile);

      if (imageFile) {
        console.log("Starting image upload...");
        const uploadedUrl = await uploadImage();
        console.log("Upload completed, URL:", uploadedUrl);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          console.warn("Upload returned empty URL");
        }
      } else {
        console.log("No image file to upload");
      }

      // Generate slug from name
      const slug = generateSlug(name);

      const communityData = {
        name: name.trim(),
        slug: slug,
        description: description.trim(),
        created_by: user.id,
        imageurl: imageUrl,
        category: category || null,
        tags: tags.length > 0 ? tags : null,
        isprivate: isPrivate,
      };

      console.log("Creating community with data:", communityData);
      console.log("Tags array:", tags);
      console.log("Category:", category);
      console.log("Image URL:", imageUrl);
      console.log("Slug:", slug);

      const query = supabase.from("communities").insert([communityData]);

      const [data, error] = await safeFetch(query);

      if (error) {
        console.error("Error creating community:", error);

        // Provide user-friendly error messages
        let userMessage = "Failed to create community. Please try again.";

        if (error.message?.includes("duplicate") || error.code === "23505") {
          userMessage =
            "A community with this name already exists. Please choose a different name.";
        } else if (
          error.message?.includes("null value") ||
          error.code === "23502"
        ) {
          userMessage = "Please fill in all required fields.";
        } else if (
          error.message?.includes("permission") ||
          error.code === "42501"
        ) {
          userMessage = "You don't have permission to create a community.";
        } else if (
          error.message?.includes("network") ||
          error.message?.includes("fetch")
        ) {
          userMessage =
            "Network error. Please check your connection and try again.";
        }

        toast({
          title: "Unable to Create Community",
          description: userMessage,
          variant: "destructive",
        });
        return;
      }

      console.log("Community created successfully:", data);
      toast({
        title: "Success",
        description: "Community created successfully!",
        variant: "success",
      });

      // Redirect to the new community using slug
      if (data && data[0]?.slug) {
        navigate(`/community/${data[0].slug}`);
      } else {
        navigate("/communities");
      }
    } catch (error) {
      console.error("Error creating community:", error);
      toast({
        title: "Unable to Create Community",
        description:
          "Something went wrong. Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/communities");
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--gradient-subtle)]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    navigate("/communities");
    return null;
  }

  return (
    <MainLayout>
      <PageLayout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumbs */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link
                  to="/community"
                  className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                >
                  <HomeIcon size={16} className="mr-1" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <Link
                    to="/communities"
                    className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                  >
                    Communities
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">Create</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-gray-800">
              Create New Community
            </h1>
          </div>
          <p className="text-gray-600 mb-6">
            Start a new community and bring people together around shared
            interests
          </p>

          {/* Form Container */}
          <div className=" mx-auto">
            <div className="  ">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div>
                  {/* <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Basic Information
                </h2> */}
                  <div className="space-y-5">
                    {/* Community Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Community Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter community name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={submitting}
                        maxLength={100}
                      />
                      <p className="text-xs text-muted-foreground">
                        Choose a clear, descriptive name for your community
                      </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your community's purpose and values..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        disabled={submitting}
                        rows={5}
                        className="resize-none"
                        maxLength={500}
                        minLength={10}
                      />
                      <p className="text-xs text-muted-foreground">
                        {description.length}/500 characters (minimum 10)
                      </p>
                    </div>

                    {/* Category and Privacy Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Category */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="category"
                          className="text-sm font-medium"
                        >
                          Category *
                        </Label>
                        <Select
                          value={category}
                          onValueChange={setCategory}
                          disabled={submitting}
                          required
                        >
                          <SelectTrigger
                            id="category"
                            className={!category ? "text-muted-foreground" : ""}
                          >
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Select a category
                        </p>
                      </div>

                      {/* Privacy Setting */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Privacy</Label>
                        <label
                          htmlFor="privacy"
                          className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors h-10"
                        >
                          <span className="text-sm text-gray-700">
                            Private Community
                          </span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              id="privacy"
                              checked={isPrivate}
                              onChange={(e) => setIsPrivate(e.target.checked)}
                              disabled={submitting}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </div>
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Require approval to join
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label htmlFor="tags" className="text-sm font-medium">
                        Tags *
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="tags"
                          placeholder="Add tags (e.g., networking, startup, innovation)..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagInputKeyDown}
                          disabled={submitting || tags.length >= 10}
                          maxLength={30}
                        />
                        <Button
                          type="button"
                          onClick={handleAddTag}
                          disabled={
                            !tagInput.trim() || submitting || tags.length >= 10
                          }
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>
                      {tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                disabled={submitting}
                                className="hover:text-blue-900"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                          <p className="text-xs text-amber-800">
                            Please add at least one tag to help others discover
                            your community
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {tags.length}/10 tags • Press Enter or click Add
                        (minimum 1 required)
                      </p>
                    </div>

                    {/* Community Image */}
                    <div className="space-y-2">
                      <Label htmlFor="image" className="text-sm font-medium">
                        Community Image (Optional)
                      </Label>
                      {imagePreview ? (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={imagePreview}
                            alt="Community preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            disabled={submitting}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                          <input
                            id="image"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handleImageChange}
                            disabled={submitting}
                            className="hidden"
                          />
                          <label
                            htmlFor="image"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">
                              Click to upload an image
                            </span>
                            <span className="text-xs text-gray-500">
                              PNG, JPG, WEBP up to 5MB
                            </span>
                          </label>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Add a cover image to make your community more appealing
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Quick Tips */}
            <div
              className="mt-6 rounded-md p-4"
              style={{
                backgroundColor: "#E6FFFB",
                borderLeft: "3px solid #00E5D1",
              }}
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Quick Tips
              </h3>
              <ul className="space-y-1.5 text-xs text-gray-700">
                <li>
                  • Choose a name that clearly reflects your community's focus
                </li>
                <li>
                  • Write a detailed description to help members understand the
                  purpose
                </li>
                <li>
                  • Add relevant tags to help others discover your community
                </li>
                <li>
                  • Set clear guidelines and expectations for community members
                </li>
              </ul>
            </div>
          </div>

          {/* Sticky Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 shadow-md z-50">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to cancel? Any unsaved changes will be lost."
                  )
                ) {
                  handleCancel();
                }
              }}
              disabled={submitting || uploadingImage}
              className="w-full sm:w-auto border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md px-4 py-2 transition-all duration-200"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>

            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={
                submitting ||
                uploadingImage ||
                !name.trim() ||
                !description.trim() ||
                !category ||
                tags.length === 0
              }
              className="w-full sm:w-auto font-semibold rounded-md px-5 py-2.5 shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200"
              style={{
                backgroundColor:
                  submitting || uploadingImage ? "#9CA3AF" : "#0030E3",
                color: "white",
              }}
              onMouseEnter={(e) => {
                if (!submitting && !uploadingImage)
                  e.currentTarget.style.backgroundColor = "#002180";
              }}
              onMouseLeave={(e) => {
                if (!submitting && !uploadingImage)
                  e.currentTarget.style.backgroundColor = "#0030E3";
              }}
            >
              {submitting || uploadingImage ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {uploadingImage ? "Uploading..." : "Creating..."}
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Community
                </>
              )}
            </Button>
          </div>
        </div>
      </PageLayout>
    </MainLayout>
  );
}
