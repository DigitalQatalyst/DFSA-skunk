/**
 * Course Service
 *
 * This module provides functions for interacting with the course API.
 * It abstracts all API calls related to courses, ensuring consistent
 * error handling and data transformation.
 */
import { graphqlClient } from "./graphql/client";
import {
  GET_COURSES,
  GET_COURSE_DETAILS,
  GET_RELATED_COURSES,
  GET_CATEGORIES,
  GET_DELIVERY_MODES,
  GET_BUSINESS_STAGES,
  GET_PROVIDERS,
} from "./graphql/queries";
import { CourseType, ProviderType, FilterOptions } from "../types/course";
/**
 * Fetches courses based on filter criteria and search query
 *
 * @param filters - Object containing filter criteria
 * @param searchQuery - Optional search term
 * @returns Promise resolving to an array of courses
 */
export const fetchCourses = async (
  filters: {
    category?: string;
    deliveryMode?: string;
    businessStage?: string;
    provider?: string;
  },
  searchQuery?: string
): Promise<CourseType[]> => {
  try {
    const variables = {
      category: filters.category || undefined,
      deliveryMode: filters.deliveryMode || undefined,
      businessStage: filters.businessStage || undefined,
      provider: filters.provider || undefined,
      search: searchQuery || undefined,
    };
    const data = await graphqlClient.request(GET_COURSES, variables);
    console.log(data);
    return data.courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to load courses. Please try again later.");
  }
};
/**
 * Fetches details for a specific course
 *
 * @param courseId - The ID of the course to fetch
 * @returns Promise resolving to a course object
 */
export const fetchCourseDetails = async (
  courseId: string
): Promise<CourseType> => {
  try {
    const { course } = await graphqlClient.request(GET_COURSE_DETAILS, {
      id: courseId,
    });
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw new Error("Failed to load course details. Please try again later.");
  }
};
/**
 * Fetches courses related to a specific course
 *
 * @param courseId - The ID of the reference course
 * @param category - The category of the reference course
 * @param provider - The provider of the reference course
 * @returns Promise resolving to an array of related courses
 */
export const fetchRelatedCourses = async (
  courseId: string,
  category: string,
  provider: string
): Promise<CourseType[]> => {
  try {
    const { relatedCourses } = await graphqlClient.request(
      GET_RELATED_COURSES,
      {
        id: courseId,
        category,
        provider,
      }
    );
    return relatedCourses || [];
  } catch (error) {
    console.error("Error fetching related courses:", error);
    throw new Error("Failed to load related courses. Please try again later.");
  }
};
/**
 * Fetches all filter options for the course marketplace
 *
 * @returns Promise resolving to an object containing all filter options
 */
export const fetchFilterOptions = async (): Promise<FilterOptions> => {
  try {
    // Fetch categories
    const categoriesData = await graphqlClient.request(GET_CATEGORIES);
    // Fetch delivery modes
    const deliveryModesData = await graphqlClient.request(GET_DELIVERY_MODES);
    // Fetch business stages
    const businessStagesData = await graphqlClient.request(GET_BUSINESS_STAGES);
    // Fetch providers
    const providersData = await graphqlClient.request(GET_PROVIDERS);
    return {
      categories: categoriesData.categories,
      deliveryModes: deliveryModesData.deliveryModes,
      businessStages: businessStagesData.businessStages,
      providers: providersData.providers,
    };
  } catch (error) {
    console.error("Error fetching filter options:", error);
    throw new Error("Failed to load filter options. Please try again later.");
  }
};
