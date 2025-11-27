import React, { Component } from 'react';
/**
 * Course Marketplace Page
 *
 * This is the main entry point for the Course Marketplace feature.
 * It renders the CourseMarketplace component with any necessary wrappers or providers.
 *
 * Route: /courses
 *
 * Features:
 * - Browsing and searching courses
 * - Filtering by various criteria
 * - Course bookmarking
 * - Course comparison
 * - Course enrollment
 */

import CourseMarketplace from '../components/CourseMarketplace';
/**
 * CourseMarketplacePage Component
 *
 * @returns The complete Course Marketplace page
 */
const CourseMarketplacePage: React.FC = () => {
  return <CourseMarketplace />;
};
export default CourseMarketplacePage;