import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

type FieldConfig = {
  fieldName: string;
  fieldType: string;
  mandatory?: string[] | boolean;
};

type CompanyStageConfig = { id: string; label: string; color: string };
type ProfileConfig = {
  companyStages: CompanyStageConfig[];
  tabs: Array<{
    id: string;
    title: string;
    groups: Array<{
      fields: FieldConfig[];
    }>;
  }>;
};

type MappingShape = { apiFieldMapping: Record<string, string> };
type ProfileStrings = Record<string, string>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

function loadJson<T>(rel: string): T {
  const full = path.resolve(root, rel);
  return JSON.parse(readFileSync(full, "utf-8")) as T;
}

const allowedFieldTypes = new Set([
  "Text",
  "select",
  "multiselect",
  "Whole Number",
  "Decimal",
  "Decimal (0–100)",
  "Decimal (0�?\"100)",
  "Currency",
  "select-multi",
  "URL",
  "Date",
  "Date Only",
  "DateTime",
  "Multiline Text",
  "File Upload",
  "Table",
  "Lookup",
]);

function validateStages(stages: CompanyStageConfig[], warnings: string[]) {
  const ids = new Set<string>();
  stages.forEach((s) => {
    if (!s.id) warnings.push("Stage missing id");
    if (ids.has(s.id)) warnings.push(`Duplicate stage id ${s.id}`);
    ids.add(s.id);
    if (!s.label) warnings.push(`Stage ${s.id || "unknown"} missing label`);
  });
  return ids;
}

function validateFields(
  tabs: ProfileConfig["tabs"],
  stageIds: Set<string>,
  warnings: string[]
) {
  const fieldNames = new Set<string>();
  tabs.forEach((tab) => {
    tab.groups.forEach((group) => {
      group.fields.forEach((field) => {
        if (fieldNames.has(field.fieldName)) {
          warnings.push(`Duplicate fieldName detected: ${field.fieldName}`);
        }
        fieldNames.add(field.fieldName);

        if (!allowedFieldTypes.has(field.fieldType as any)) {
          warnings.push(
            `Field ${field.fieldName} has unknown type ${field.fieldType}`
          );
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
      });
    });
  });
}

function validateStrings(strings: ProfileStrings, warnings: string[]) {
  Object.entries(strings).forEach(([key, value]) => {
    if (typeof value !== "string") {
      warnings.push(`String entry ${key} is not a string`);
    }
  });
}

function validateMapping(mapping: MappingShape, warnings: string[]) {
  if (!mapping || typeof mapping !== "object" || !mapping.apiFieldMapping) {
    warnings.push("Mapping file missing apiFieldMapping");
  }
}

try {
  const profileConfig = loadJson<ProfileConfig>(
    "src/config/profile/profile.config.json"
  );
  const profileStrings = loadJson<ProfileStrings>(
    "src/config/profile/profile.strings.json"
  );
  const profileMapping = loadJson<MappingShape>(
    "src/config/profile/profile.mapping.json"
  );

  const warnings: string[] = [];
  const stageIds = validateStages(profileConfig.companyStages, warnings);
  validateFields(profileConfig.tabs, stageIds, warnings);
  validateStrings(profileStrings, warnings);
  validateMapping(profileMapping, warnings);

  if (warnings.length) {
    console.warn("Profile config validation completed with warnings:");
    warnings.forEach((w) => console.warn(`- ${w}`));
    process.exitCode = 0;
  } else {
    console.log("Profile config validation passed with no warnings.");
  }
} catch (error) {
  console.error("Profile config validation failed:", error);
  process.exit(1);
}
