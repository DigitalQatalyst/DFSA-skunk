import React, { useState } from "react";
import { BaseCard } from "./BaseCard";
import { CardFooter } from "./CardFooter";
import { TagChip } from "./TagChip";
import { Users, TrendingUp, MessageCircle, Lock } from "lucide-react";
export interface CommunityItem {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  activeMembers?: number;
  category: string;
  tags: string[];
  imageUrl?: string;
  isPrivate?: boolean;
  activityLevel?: "low" | "medium" | "high";
  recentActivity?: string;
}
export interface CommunityCardProps {
  item: CommunityItem;
  onJoin: () => void;
  onViewDetails?: () => void;
  onQuickView?: () => void;
  "data-id"?: string;
}
const getActivityColor = (level?: "low" | "medium" | "high") => {
  switch (level) {
    case "high":
      return "text-green-600 bg-green-50";
    case "medium":
      return "text-yellow-600 bg-yellow-50";
    case "low":
      return "text-gray-600 bg-gray-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};
const getActivityLabel = (level?: "low" | "medium" | "high") => {
  switch (level) {
    case "high":
      return "Very Active";
    case "medium":
      return "Active";
    case "low":
      return "Quiet";
    default:
      return "New";
  }
};
export const CommunityCard: React.FC<CommunityCardProps> = ({
  item,
  onJoin,
  onViewDetails,
  onQuickView,
  "data-id": dataId,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onJoin();
  };
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.();
  };
  return (
    <BaseCard
      onClick={onQuickView}
      data-id={dataId}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Large Image Section */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden flex-shrink-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={`${item.name} community`}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? "scale-105" : "scale-100"
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Users size={48} className="text-white opacity-75" />
          </div>
        )}
        {/* Privacy Badge */}
        {item.isPrivate && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white bg-opacity-90 backdrop-blur-sm flex items-center gap-1.5 shadow-md">
            <Lock size={14} className="text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Private</span>
          </div>
        )}
        {/* Activity Level Badge */}
        {item.activityLevel && (
          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-md backdrop-blur-sm ${getActivityColor(
                item.activityLevel
              )} bg-opacity-90`}
            >
              <MessageCircle size={12} className="mr-1.5" />
              {getActivityLabel(item.activityLevel)}
            </span>
          </div>
        )}
      </div>
      {/* Content Section */}
      <div className="px-4 py-5 flex-grow flex flex-col">
        {/* Title and Category */}
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1 leading-snug">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500">{item.category}</p>
        </div>
        {/* Community Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {item.memberCount.toLocaleString()}{" "}
              {item.memberCount === 1 ? "member" : "members"}
            </span>
          </div>
          {item.activeMembers && (
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-sm text-gray-600">
                {item.activeMembers} active
              </span>
            </div>
          )}
        </div>
        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px] leading-relaxed">
            {item.description}
          </p>
        </div>
        {/* Recent Activity */}
        {item.recentActivity && (
          <div className="mb-4 p-2 bg-blue-50 rounded text-xs text-blue-700 whitespace-nowrap overflow-hidden text-ellipsis">
            <span className="font-medium">Recent: </span>
            {item.recentActivity}
          </div>
        )}
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-auto">
          {item.tags.slice(0, 3).map((tag, index) => (
            <TagChip
              key={index}
              text={tag}
              variant={index === 0 ? "primary" : "secondary"}
              size="sm"
            />
          ))}
        </div>
      </div>
      <CardFooter
        primaryCTA={{
          text: item.isPrivate ? "Request to Join" : "Join Community",
          onClick: handleJoin,
        }}
        secondaryCTA={
          onViewDetails
            ? {
                text: "View Details",
                onClick: handleViewDetails,
              }
            : undefined
        }
      />
    </BaseCard>
  );
};
