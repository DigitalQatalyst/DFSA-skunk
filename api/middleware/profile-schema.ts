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
let productsConfig: any = null;
let productsConfigPath: string | null = null;
let productsConfigMtime: number | null = null;

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

function loadProductsConfig(): any {
  const possiblePaths = [
    path.join(__dirname, '../../src/config/profile/profile.products.config.json'),
    path.join(process.cwd(), 'src/config/profile/profile.products.config.json'),
  ];

  let configPath: string | null = null;
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      configPath = testPath;
      break;
    }
  }

  if (!configPath) {
    console.error('[profile-schema] Could not find profile.products.config.json in any expected location');
    productsConfig = { tabs: [] };
    return productsConfig;
  }

  // Check if file has been modified (cache busting)
  try {
    const stats = fs.statSync(configPath);
    const currentMtime = stats.mtimeMs;
    
    // If file path changed or file was modified, reload
    if (
      productsConfigPath !== configPath ||
      productsConfigMtime === null ||
      productsConfigMtime < currentMtime
    ) {
      console.log(`🔄 [profile-schema] Reloading products config from: ${configPath}`);
      const content = fs.readFileSync(configPath, 'utf-8');
      productsConfig = JSON.parse(content);
      productsConfigPath = configPath;
      productsConfigMtime = currentMtime;
      
      // Debug: Log matrix fields found in config
      const allFields = productsConfig.tabs?.[0]?.groups?.flatMap((g: any) => g.fields || []) || [];
      const matrixFields = allFields.filter((f: any) => 
        f.uiBlockType === 'matrixAccordion' || 
        (typeof f.fieldType === 'string' && f.fieldType.toLowerCase() === 'matrix')
      );
      console.log(`✅ [profile-schema] Products config reloaded (${productsConfig.tabs?.[0]?.groups?.length || 0} groups, ${matrixFields.length} matrix fields)`);
      console.log(`🔍 [profile-schema] Matrix fieldNames:`, matrixFields.map((f: any) => f.fieldName).filter(Boolean));
    } else {
      console.log(`📦 [profile-schema] Using cached products config (${productsConfig.tabs?.[0]?.groups?.length || 0} groups)`);
    }
  } catch (error) {
    console.error('[profile-schema] Error checking/loading products config:', error);
    // Fallback to cached config if available
    if (productsConfig) {
      return productsConfig;
    }
    productsConfig = { tabs: [] };
  }

  return productsConfig;
}

export interface FieldConfig {
  id: string;
  label: string;
  fieldName: string;
  fieldType: string;
  mandatory?: boolean | string[];
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
  uiBlockType?: string;
  visibility?: Record<string, any>;
  matrixDimensions?: { rows: number; columns: number };
  matrixConfig?: {
    rowLabels?: Array<{ key: string; label: string }>;
    columnLabels?: Array<{ key: string; label: string }>;
    applicableCells?: Record<string, string[]>;
  };
  hidden?: boolean;
  readOnly?: boolean;
}

export interface GroupConfig {
  id: string;
  groupName: string;
  fields: FieldConfig[];
  uiSection?: string;
  section?: string;
  uiBlockType?: string;
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
  if (domainKey === 'products') {
    const productsSchema = loadProductsConfig();
    return productsSchema.tabs?.find((t: any) => t.id === 'products') || null;
  }
  const schema = getProfileSchema();
  const tab = schema.tabs.find(t => t.id === domainKey);
  return tab || null;
}

/**
 * Get all domain keys
 */
export function getAllDomainKeys(): string[] {
  const baseKeys = getProfileSchema().tabs.map(tab => tab.id);
  const productKeys = loadProductsConfig().tabs?.map((tab: any) => tab.id) || [];
  const all = [...baseKeys, ...productKeys];
  return Array.from(new Set(all));
}

