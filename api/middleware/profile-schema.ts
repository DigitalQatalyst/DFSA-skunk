/**
 * Profile Schema Loader
 * Loads profile schema from JSON configuration files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load JSON file using fs (works in serverless environment)
let profileApqcConfig: any = null;

function loadProfileConfig(): any {
  if (profileApqcConfig) {
    return profileApqcConfig; // Cache the config
  }

  try {
    // Try multiple possible paths
    const possiblePaths = [
      path.join(__dirname, '../../src/config/profile/profile.apqc.config.json'),
      path.join(process.cwd(), 'src/config/profile/profile.apqc.config.json'),
    ];

    console.log(`🔍 [profile-schema] Looking for config file. __dirname: ${__dirname}, cwd: ${process.cwd()}`);

    for (const configPath of possiblePaths) {
      try {
        if (fs.existsSync(configPath)) {
          const configContent = fs.readFileSync(configPath, 'utf-8');
          profileApqcConfig = JSON.parse(configContent);
          console.log(`✅ [profile-schema] Loaded config from: ${configPath}`);
          return profileApqcConfig;
        }
      } catch (pathError) {
        // Try next path
        continue;
      }
    }

    console.error('❌ [profile-schema] Could not find profile.apqc.config.json in any expected location');
    // Return empty structure if file can't be loaded
    profileApqcConfig = { tabs: [] };
    return profileApqcConfig;
  } catch (error) {
    console.error('❌ [profile-schema] Error loading profile config:', error);
    // Return empty structure if file can't be loaded
    profileApqcConfig = { tabs: [] };
    return profileApqcConfig;
  }
}

export interface FieldConfig {
  id: string;
  label: string;
  fieldName: string;
  fieldType: string;
  mandatory: boolean | string[];
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  addressFields?: Record<string, any>;
  validation?: {
    type?: string;
  };
  mandatoryWhen?: {
    field: string;
    equals: string;
  };
  visibleWhen?: {
    field: string;
    equals: string;
  };
}

export interface GroupConfig {
  id: string;
  groupName: string;
  fields: FieldConfig[];
}

export interface TabConfig {
  id: string;
  title: string;
  groups: GroupConfig[];
}

export interface ProfileSchema {
  tabs: TabConfig[];
}

/**
 * Get profile schema configuration
 * Loads from profile.apqc.config.json
 */
export function getProfileSchema(): ProfileSchema {
  const config = loadProfileConfig();
  return config as ProfileSchema;
}

/**
 * Get schema for a specific domain/tab
 */
export function getDomainSchema(domainKey: string): TabConfig | null {
  const schema = getProfileSchema();
  const tab = schema.tabs.find(t => t.id === domainKey);
  return tab || null;
}

/**
 * Get all domain keys
 */
export function getAllDomainKeys(): string[] {
  const schema = getProfileSchema();
  return schema.tabs.map(tab => tab.id);
}

