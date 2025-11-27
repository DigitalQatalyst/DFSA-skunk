/**
 * Course Types
 *
 * This module defines TypeScript interfaces for course-related data structures.
 */
/**
 * Represents a course provider
 */
export interface ProviderType {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
}
/**
 * Represents a course - updated to match GET_PRODUCTS query fields
 */
export interface CourseType {
  id: string;
  title: string;
  description: string;
  category: string;
  deliveryMode: string;
  duration: string;
  durationType: string;
  businessStage: string;
  provider: ProviderType;
  learningOutcomes: string[];
  startDate: string;
  price?: string;
  location?: string;
  tags?: string[];
  // New fields from GET_PRODUCTS customFields
  learningObjectives?: string[];
  skillsGained?: string[];
  audience?: string;
  courseTimeline?: string;
  resources?: string[];
  documentLink?: string;
  processingTime?: string;
  serviceApplication?: string;
  uponCompletion?: string;
  rating?: number;
  reviewCount?: number;
  languages?: string[];
  pricingModel?: string;
  serviceCategory?: string;
  resourceType?: string;
  notes?: string;
  isFeatured?: boolean;
  isOnline?: boolean;
}
/**
 * Filter options for the course marketplace
 */
export interface FilterOptions {
  categories: {
    id: string;
    name: string;
  }[];
  deliveryModes: {
    id: string;
    name: string;
  }[];
  businessStages: {
    id: string;
    name: string;
  }[];
  providers: ProviderType[];
}
/**
 * Course filters applied by the user
 */
export interface CourseFilters {
  category: string;
  deliveryMode: string;
  duration: string;
  businessStage: string;
  provider: string;
}
/**
 * Props for the CourseGrid component
 */
export interface CourseGridProps {
  courses: CourseType[];
  onCourseSelect: (course: CourseType) => void;
  bookmarkedCourses: string[];
  onToggleBookmark: (courseId: string) => void;
  onAddToComparison: (course: CourseType) => void;
}
/**
 * Props for the CourseCard component
 */
export interface CourseCardProps {
  course: CourseType;
  onClick: () => void;
  onQuickView: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onAddToComparison: () => void;
}
/**
 * Props for the FilterSidebar component
 */
export interface FilterSidebarProps {
  filters: CourseFilters;
  onFilterChange: (filterType: string, value: string) => void;
  onResetFilters: () => void;
  isResponsive?: boolean;
  categories: string[];
  deliveryModes: string[];
  businessStages: string[];
  providers: ProviderType[];
}