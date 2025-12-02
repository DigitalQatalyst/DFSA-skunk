import {
  API_FIELD_MAPPING as fallbackFieldMapping,
  type CompanyStageConfig,
  type FieldConfig,
  type ProfileConfig,
} from "../utils/config.ts";

type ProfileStrings = Record<string, string>;

const profileConfigJson = (await import("./profile/profile.config.json")).default;
const profileStringsJson = (await import("./profile/profile.strings.json")).default;
const profileMappingJson = (await import("./profile/profile.mapping.json")).default;

type ValidationResult<T> = {
  value: T;
  warnings: string[];
};

type MappingShape = {
  apiFieldMapping: Record<string, string>;
};

const allowedFieldTypes: FieldConfig["fieldType"][] = [
  "Text",
  "select",
  "multiselect",
  "Whole Number",
  "Decimal",
  "Decimal (0–100)" as any, // keep parity with legacy spelling
  "Decimal (0�?\"100)" as any,
  "Currency",
  "select-multi" as any,
  "URL",
  "Date",
  "Date Only",
  "DateTime",
  "Multiline Text",
  "File Upload",
  "Table",
  "Lookup",
];

function validateStages(stages: CompanyStageConfig[]): string[] {
  const warnings: string[] = [];
  const ids = new Set<string>();
  stages.forEach((stage) => {
    if (!stage.id) warnings.push("Stage missing id");
    if (ids.has(stage.id)) warnings.push(`Duplicate stage id ${stage.id}`);
    ids.add(stage.id);
    if (!stage.label) warnings.push(`Stage ${stage.id} missing label`);
  });
  return warnings;
}

function validateField(field: FieldConfig, stageIds: Set<string>): string[] {
  const warnings: string[] = [];
  if (!allowedFieldTypes.includes(field.fieldType as any)) {
    warnings.push(`Field ${field.fieldName} has unknown type ${field.fieldType}`);
  }
  if (Array.isArray(field.mandatory)) {
    const invalid = field.mandatory.filter((m) => !stageIds.has(m));
    if (invalid.length) {
      warnings.push(
        `Field ${field.fieldName} references unknown mandatory stages: ${invalid.join(
          ", "
        )}`
      );
    }
  }
  return warnings;
}

function validateConfig(raw: ProfileConfig): ValidationResult<ProfileConfig> {
  const warnings: string[] = [];
  const stageIds = new Set(raw.companyStages.map((s) => s.id));
  warnings.push(...validateStages(raw.companyStages));

  const fieldNames = new Set<string>();
  raw.tabs.forEach((tab) => {
    if (!tab.id) warnings.push("Tab missing id");
    tab.groups.forEach((group) => {
      group.fields.forEach((field) => {
        if (fieldNames.has(field.fieldName)) {
          warnings.push(`Duplicate fieldName detected: ${field.fieldName}`);
        }
        fieldNames.add(field.fieldName);
        warnings.push(...validateField(field, stageIds));
      });
    });
  });

  return { value: raw, warnings };
}

function validateStrings(raw: ProfileStrings): ValidationResult<ProfileStrings> {
  const warnings: string[] = [];
  Object.entries(raw).forEach(([key, value]) => {
    if (typeof value !== "string") {
      warnings.push(`String entry ${key} is not a string`);
    }
  });
  return { value: raw, warnings };
}

function validateMapping(raw: MappingShape): ValidationResult<MappingShape> {
  const warnings: string[] = [];
  if (!raw || typeof raw !== "object" || !raw.apiFieldMapping) {
    warnings.push("Mapping file missing apiFieldMapping");
    return { value: { apiFieldMapping: fallbackFieldMapping }, warnings };
  }
  return { value: raw, warnings };
}

const validatedConfig = validateConfig(profileConfigJson as ProfileConfig);
const validatedStrings = validateStrings(profileStringsJson as ProfileStrings);
const validatedMapping = validateMapping(profileMappingJson as MappingShape);

const reverseMapping: Record<string, string> = Object.entries(
  validatedMapping.value.apiFieldMapping
).reduce<Record<string, string>>((acc, [ui, api]) => {
  acc[api] = ui;
  return acc;
}, {});

export function getProfileConfig(): ProfileConfig {
  return validatedConfig.value;
}

export function getProfileStrings(): ProfileStrings {
  return validatedStrings.value;
}

export function getProfileMapping(): Record<string, string> {
  return validatedMapping.value.apiFieldMapping;
}

export function getReverseProfileMapping(): Record<string, string> {
  return reverseMapping;
}

export function getProfileConfigWarnings(): string[] {
  return [
    ...validatedConfig.warnings,
    ...validatedStrings.warnings,
    ...validatedMapping.warnings,
  ];
}

export function getProfileString(key: string, fallback?: string): string {
  return validatedStrings.value[key] ?? fallback ?? key;
}

export function formatProfileString(
  key: string,
  params?: Record<string, string | number>,
  fallback?: string
): string {
  const template = getProfileString(key, fallback ?? key);
  if (!params) return template;
  return Object.entries(params).reduce((acc, [k, v]) => {
    return acc.replace(new RegExp(`{${k}}`, "g"), String(v));
  }, template);
}
