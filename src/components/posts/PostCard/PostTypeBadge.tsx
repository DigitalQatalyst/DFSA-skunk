import React from "react";
import {
  FileText,
  ImageIcon,
  BarChart3,
  Calendar,
  Megaphone,
  BookOpen,
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { PostType } from "../types";
interface PostTypeBadgeProps {
  postType?: PostType;
  className?: string;
}
export const PostTypeBadge: React.FC<PostTypeBadgeProps> = ({
  postType,
  className,
}) => {
  const getBadgeConfig = () => {
    switch (postType) {
      case "media":
        return {
          icon: ImageIcon,
          label: "Media",
          emoji: "🖼️",
          colorClass: "bg-teal-50 text-teal-700 border-teal-200",
        };
      case "poll":
        return {
          icon: BarChart3,
          label: "Poll",
          emoji: "📊",
          colorClass: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "event":
        return {
          icon: Calendar,
          label: "Event",
          emoji: "📅",
          colorClass: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "announcement":
        return {
          icon: Megaphone,
          label: "Announcement",
          emoji: "📢",
          colorClass: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "article":
        return {
          icon: BookOpen,
          label: "Article",
          emoji: "📝",
          colorClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
        };
      case "text":
      default:
        return {
          icon: FileText,
          label: "Discussion",
          emoji: "💬",
          colorClass: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };
  const { icon: Icon, label, emoji, colorClass } = getBadgeConfig();
  return (
    <Badge
      className={`text-xs px-2 py-0.5 font-medium border ${colorClass} ${
        className || ""
      }`}
    >
      <span className="mr-1">{emoji}</span>
      {label}
    </Badge>
  );
};
