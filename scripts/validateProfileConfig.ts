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
type DomainConfig = {
  code: string;
  name: string;
  shortName: string;
  phaseId: string;
  sequence: number;
  questionCount: number;
  forms?: string[];
  description?: string;
};
type PhaseConfig = {
  id: string;
  name: string;
  description: string;
  sequence: number;
  domains: string[];
};
type TabDomainMapEntry = {
  tabId: string;
  domains: string[];
  finalStage?: string;
};
type ApplicationStageConfig = {
  id: string;
  name: string;
  description?: string;
  forms?: string[];
  questionCount?: number;
};

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

function validatePhases(phases: PhaseConfig[], warnings: string[]) {
  const ids = new Set<string>();
  const sequences = new Set<number>();
  phases.forEach((phase) => {
    if (!phase.id) warnings.push("Phase missing id");
    if (ids.has(phase.id)) warnings.push(`Duplicate phase id ${phase.id}`);
    ids.add(phase.id);
    if (!phase.name) warnings.push(`Phase ${phase.id || "unknown"} missing name`);
    if (phase.sequence === undefined || phase.sequence === null) {
      warnings.push(`Phase ${phase.id} missing sequence`);
    } else if (sequences.has(phase.sequence)) {
      warnings.push(`Duplicate phase sequence ${phase.sequence}`);
    }
    sequences.add(phase.sequence);
  });
  return ids;
}

function validateDomains(
  domains: DomainConfig[],
  phaseIds: Set<string>,
  warnings: string[]
) {
  const codes = new Set<string>();
  const sequences = new Set<number>();
  domains.forEach((domain) => {
    if (!domain.code) warnings.push("Domain missing code");
    if (codes.has(domain.code)) {
      warnings.push(`Duplicate domain code ${domain.code}`);
    }
    codes.add(domain.code);
    if (!domain.name) warnings.push(`Domain ${domain.code} missing name`);
    if (!domain.phaseId || !phaseIds.has(domain.phaseId)) {
      warnings.push(
        `Domain ${domain.code} references unknown phase ${domain.phaseId}`
      );
    }
    if (domain.sequence === undefined || domain.sequence === null) {
      warnings.push(`Domain ${domain.code} missing sequence`);
    } else if (sequences.has(domain.sequence)) {
      warnings.push(`Duplicate domain sequence ${domain.sequence}`);
    }
    sequences.add(domain.sequence);
    if (domain.questionCount === undefined || domain.questionCount < 0) {
      warnings.push(`Domain ${domain.code} has invalid questionCount`);
    }
  });
  const total = domains.reduce((sum, d) => sum + (d.questionCount || 0), 0);
  if (total !== 463) {
    warnings.push(`Domain question totals should sum to 463; found ${total}`);
  }
  return codes;
}

function validatePhaseDomainCoverage(
  domains: DomainConfig[],
  phases: PhaseConfig[],
  warnings: string[]
) {
  const domainCodes = new Set(domains.map((d) => d.code));
  const mapped = new Set<string>();
  phases.forEach((phase) => {
    phase.domains?.forEach((code) => {
      if (!domainCodes.has(code)) {
        warnings.push(`Phase ${phase.id} references unknown domain ${code}`);
      }
      mapped.add(code);
    });
  });
  domains.forEach((domain) => {
    if (!mapped.has(domain.code)) {
      warnings.push(`Domain ${domain.code} is not assigned to any phase`);
    }
  });
}

function validateApplicationStage(
  stage: ApplicationStageConfig,
  warnings: string[]
) {
  if (!stage || typeof stage !== "object") {
    warnings.push("Application stage config missing or invalid");
    return;
  }
  if (!stage.id) warnings.push("Application stage missing id");
  if (!stage.name) warnings.push("Application stage missing name");
}

function validateTabDomainMap(
  entries: TabDomainMapEntry[],
  domainCodes: Set<string>,
  tabIds: Set<string>,
  applicationStageId: string,
  warnings: string[]
) {
  const seen = new Set<string>();
  entries.forEach((entry) => {
    if (!entry.tabId) warnings.push("Tab-domain map entry missing tabId");
    if (entry.tabId && !tabIds.has(entry.tabId)) {
      warnings.push(`Tab-domain map references unknown tab ${entry.tabId}`);
    }
    if (entry.tabId && seen.has(entry.tabId)) {
      warnings.push(`Duplicate tab-domain mapping for tab ${entry.tabId}`);
    }
    seen.add(entry.tabId);
    entry.domains?.forEach((code) => {
      if (!domainCodes.has(code)) {
        warnings.push(`Tab ${entry.tabId} references unknown domain ${code}`);
      }
    });
    if (entry.finalStage && entry.finalStage !== applicationStageId) {
      warnings.push(
        `Tab ${entry.tabId} references unknown final stage ${entry.finalStage}`
      );
    }
  });
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
  const profileConfigV3 = loadJson<ProfileConfig>(
    "src/config/profile/profile.v3.config.json"
  );
  const profileStringsV3 = loadJson<ProfileStrings>(
    "src/config/profile/profile.v3.strings.json"
  );
  const profileMappingV3 = loadJson<MappingShape>(
    "src/config/profile/profile.v3.mapping.json"
  );
  const profileConfigStage1 = loadJson<ProfileConfig>(
    "src/config/profile/profile.stage1.apqc.config.json"
  );
  const profileStringsStage1 = loadJson<ProfileStrings>(
    "src/config/profile/profile.stage1.apqc.strings.json"
  );
  const profileMappingStage1 = loadJson<MappingShape>(
    "src/config/profile/profile.stage1.apqc.mapping.json"
  );
  const profileConfigV2 = loadJson<ProfileConfig>(
    "src/config/profile/profile.v2.config.json"
  );
  const profileStringsV2 = loadJson<ProfileStrings>(
    "src/config/profile/profile.v2.strings.json"
  );
  const profileMappingV2 = loadJson<MappingShape>(
    "src/config/profile/profile.v2.mapping.json"
  );
  const profilePhases = loadJson<PhaseConfig[]>(
    "src/config/profile/phases.config.json"
  );
  const profileDomains = loadJson<DomainConfig[]>(
    "src/config/profile/domains.config.json"
  );
  const tabDomainMap = loadJson<TabDomainMapEntry[]>(
    "src/config/profile/tabDomainMap.json"
  );
  const applicationStage = loadJson<ApplicationStageConfig>(
    "src/config/profile/applicationStage.config.json"
  );

  const warnings: string[] = [];
  const stageIds = validateStages(profileConfig.companyStages, warnings);
  const stageIdsStage1 = validateStages(
    profileConfigStage1.companyStages,
    warnings
  );
  const stageIdsV3 = validateStages(profileConfigV3.companyStages, warnings);
  const stageIdsV2 = validateStages(profileConfigV2.companyStages, warnings);
  const phaseIds = validatePhases(profilePhases, warnings);
  const domainCodes = validateDomains(profileDomains, phaseIds, warnings);
  validatePhaseDomainCoverage(profileDomains, profilePhases, warnings);
  validateApplicationStage(applicationStage, warnings);
  validateFields(profileConfig.tabs, stageIds, warnings);
  validateFields(profileConfigStage1.tabs, stageIdsStage1, warnings);
  validateFields(profileConfigV2.tabs, stageIdsV2, warnings);
  validateFields(profileConfigV3.tabs, stageIdsV3, warnings);
  validateStrings(profileStrings, warnings);
  validateStrings(profileStringsStage1, warnings);
  validateStrings(profileStringsV2, warnings);
  validateStrings(profileStringsV3, warnings);
  validateMapping(profileMapping, warnings);
  validateMapping(profileMappingStage1, warnings);
  validateMapping(profileMappingV2, warnings);
  validateMapping(profileMappingV3, warnings);
  validateTabDomainMap(
    tabDomainMap,
    domainCodes,
    new Set(profileConfigV3.tabs.map((t) => t.id)),
    applicationStage?.id,
    warnings
  );

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
