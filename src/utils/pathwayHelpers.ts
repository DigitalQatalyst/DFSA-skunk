import {
  AUTHORIZATION_PATHWAYS,
  REGISTRATION_CATEGORIES,
  RECOGNITION_CATEGORIES,
} from '../constants/dfsa-pathways';
import { PathwayCard } from '../types/dfsa-pathways';

type RegimeType = 'authorisation' | 'registration' | 'recognition';

/**
 * Get pathway details by regime and pathway ID
 * @param regime - The regime type (authorisation, registration, recognition)
 * @param pathwayId - The pathway ID (e.g., 'bii', 'ra', 'rb')
 * @returns PathwayCard object or null if not found
 */
export function getPathwayByRegimeAndId(
  regime: string,
  pathwayId: string
): PathwayCard | null {
  const regimeMap: Record<RegimeType, PathwayCard[]> = {
    authorisation: AUTHORIZATION_PATHWAYS,
    registration: REGISTRATION_CATEGORIES,
    recognition: RECOGNITION_CATEGORIES,
  };

  const pathways = regimeMap[regime as RegimeType];
  if (!pathways) return null;

  return pathways.find((p) => p.id === pathwayId) || null;
}

/**
 * Capitalize first letter of a string
 * @param str - String to capitalize
 * @returns String with first letter capitalized
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format page title for pathway services page
 * @param regime - The regime type
 * @param pathwayCode - The pathway code (e.g., 'BII', 'RA')
 * @returns Formatted page title
 */
export function formatPageTitle(regime: string, pathwayCode: string): string {
  return `${capitalizeFirstLetter(regime)} - ${pathwayCode} Pathway Services`;
}
