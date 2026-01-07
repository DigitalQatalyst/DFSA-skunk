/**
 * Parse agent responses and extract structured data for UI components
 */

export interface ParsedResponse {
  mainMessage: string;
  licenseCards?: LicenseCard[];
  feeInfo?: FeeInfo[];
  steps?: Step[];
}

export interface LicenseCard {
  id: string;
  title: string;
  description: string;
  minCapital?: string;
  eligibility: string[];
  nextSteps: string[];
}

export interface FeeInfo {
  id: string;
  type: string;
  amount: string;
  description: string;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  details?: string[];
}

/**
 * Parse license recommendation response
 */
export function parseLicenseRecommendation(response: string): ParsedResponse {
  const result: ParsedResponse = {
    mainMessage: response,
    licenseCards: [],
    feeInfo: [],
    steps: [],
  };

  // Extract license recommendations
  const licenseMatches = response.match(/(?:recommended|recommend|suggest|suitable).*?license[:\s]+([\w\s]+)/gi);
  if (licenseMatches) {
    licenseMatches.forEach((match, idx) => {
      const title = match.replace(/(?:recommended|recommend|suggest|suitable).*?license[:\s]+/i, '').trim();
      if (title) {
        result.licenseCards?.push({
          id: `license-${idx}`,
          title: title,
          description: `${title} is suitable for your business activities.`,
          eligibility: extractBulletPoints(response, 'eligib'),
          nextSteps: extractBulletPoints(response, 'step|next|proceed'),
        });
      }
    });
  }

  // Extract fee information
  const feeMatches = response.match(/(?:fee|cost|charge)[:\s]+([\w\s]+)[:\s]+([\w\s\d,]+)/gi);
  if (feeMatches) {
    feeMatches.forEach((match, idx) => {
      const parts = match.split(/[:\s]+/);
      if (parts.length >= 3) {
        result.feeInfo?.push({
          id: `fee-${idx}`,
          type: parts[1],
          amount: parts[2],
          description: `${parts[1]} for license application and processing`,
        });
      }
    });
  }

  // Extract steps
  const stepMatches = response.match(/(?:step|stage|phase)\s+\d+[:\s]+(.*?)(?=(?:step|stage|phase)\s+\d+|$)/gi);
  if (stepMatches) {
    stepMatches.forEach((match, idx) => {
      const title = match.replace(/(?:step|stage|phase)\s+\d+[:\s]+/i, '').trim();
      if (title) {
        result.steps?.push({
          id: `step-${idx}`,
          title: `Step ${idx + 1}`,
          description: title,
          details: extractBulletPoints(response, title),
        });
      }
    });
  }

  return result;
}

/**
 * Extract bullet points from text
 */
function extractBulletPoints(text: string, keyword: string): string[] {
  const points: string[] = [];
  const regex = new RegExp(`${keyword}[^•\n]*(?:•|[-*]|\\d+\\.)(.*?)(?=•|[-*]|\\d+\\.|$)`, 'gi');
  const matches = text.match(regex);

  if (matches) {
    matches.forEach((match) => {
      const point = match.replace(/[•\-*\d.]/g, '').trim();
      if (point && point.length > 5) {
        points.push(point);
      }
    });
  }

  return points.slice(0, 5); // Limit to 5 points
}

/**
 * Check if response contains license recommendations
 */
export function hasLicenseRecommendations(response: string): boolean {
  return /recommend|suggest|suitable|license/i.test(response);
}

/**
 * Check if response contains fee information
 */
export function hasFeeInformation(response: string): boolean {
  return /fee|cost|charge|aed|amount/i.test(response);
}

/**
 * Check if response contains steps
 */
export function hasSteps(response: string): boolean {
  return /step|stage|phase|proceed|next/i.test(response);
}
