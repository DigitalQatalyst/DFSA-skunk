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
const profileV2ConfigJson = (await import("./profile/profile.v2.config.json")).default;
const profileV2StringsJson = (await import("./profile/profile.v2.strings.json")).default;
const profileV2MappingJson = (await import("./profile/profile.v2.mapping.json")).default;
const profileV3ConfigJson = (await import("./profile/profile.v3.config.json")).default;
const profileV3StringsJson = (await import("./profile/profile.v3.strings.json")).default;
const profileV3MappingJson = (await import("./profile/profile.v3.mapping.json")).default;
const profileStage1ConfigJson = (
  await import("./profile/profile.stage1.apqc.config.json")
).default;
const profileStage1StringsJson = (
  await import("./profile/profile.stage1.apqc.strings.json")
).default;
const profileStage1MappingJson = (
  await import("./profile/profile.stage1.apqc.mapping.json")
).default;
const profileApqcConfigJson = (
  await import("./profile/profile.apqc.config.json")
).default;
const profileApqcMappingJson = (
  await import("./profile/profile.apqc.mapping.json")
).default;
const profileDomainsJson = (await import("./profile/domains.config.json")).default;
const profilePhasesJson = (await import("./profile/phases.config.json")).default;
const tabDomainMapJson = (await import("./profile/tabDomainMap.json")).default;
const applicationStageJson = (await import("./profile/applicationStage.config.json")).default;

type ValidationResult<T> = {
  value: T;
  warnings: string[];
};

type MappingShape = {
  apiFieldMapping: Record<string, string>;
};
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

type ProfileVersion = "v1" | "v2" | "v3" | "stage1-apqc" | "apqc";

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
  "Boolean" as any,
  "Enum" as any,
  "Integer" as any,
  "MultiSelect" as any,
  "Address" as any,
  "Country" as any,
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
      // Handle groups with direct fields array
      const fieldsToValidate = group.fields || 
        // Handle groups with sections array (each section has fields)
        (group.sections ? group.sections.flatMap((section: any) => section.fields || []) : []);
      
      fieldsToValidate.forEach((field: any) => {
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

function validatePhases(raw: PhaseConfig[]): ValidationResult<PhaseConfig[]> {
  const warnings: string[] = [];
  const seen = new Set<string>();
  const seenSeq = new Set<number>();
  raw.forEach((phase) => {
    if (!phase.id) warnings.push("Phase missing id");
    if (seen.has(phase.id)) warnings.push(`Duplicate phase id ${phase.id}`);
    seen.add(phase.id);
    if (!phase.name) warnings.push(`Phase ${phase.id || "unknown"} missing name`);
    if (phase.sequence === undefined || phase.sequence === null) {
      warnings.push(`Phase ${phase.id} missing sequence`);
    } else if (seenSeq.has(phase.sequence)) {
      warnings.push(`Duplicate phase sequence ${phase.sequence}`);
    }
    seenSeq.add(phase.sequence);
  });
  return { value: raw, warnings };
}

function validateDomains(
  raw: DomainConfig[],
  phases: PhaseConfig[]
): ValidationResult<DomainConfig[]> {
  const warnings: string[] = [];
  const phaseIds = new Set(phases.map((p) => p.id));
  const seenCodes = new Set<string>();
  const seenSeq = new Set<number>();
  raw.forEach((domain) => {
    if (!domain.code) warnings.push("Domain missing code");
    if (seenCodes.has(domain.code)) {
      warnings.push(`Duplicate domain code ${domain.code}`);
    }
    seenCodes.add(domain.code);
    if (!domain.name) warnings.push(`Domain ${domain.code} missing name`);
    if (!domain.phaseId || !phaseIds.has(domain.phaseId)) {
      warnings.push(
        `Domain ${domain.code} references unknown phase ${domain.phaseId}`
      );
    }
    if (domain.sequence === undefined || domain.sequence === null) {
      warnings.push(`Domain ${domain.code} missing sequence`);
    } else if (seenSeq.has(domain.sequence)) {
      warnings.push(`Duplicate domain sequence ${domain.sequence}`);
    }
    seenSeq.add(domain.sequence);
    if (domain.questionCount === undefined || domain.questionCount < 0) {
      warnings.push(`Domain ${domain.code} has invalid questionCount`);
    }
  });
  const totalQuestions = raw.reduce((sum, d) => sum + (d.questionCount || 0), 0);
  if (totalQuestions !== 463) {
    warnings.push(`Domain question totals should sum to 463; found ${totalQuestions}`);
  }
  return { value: raw, warnings };
}

function validatePhaseDomainCoverage(
  domains: DomainConfig[],
  phases: PhaseConfig[]
): string[] {
  const warnings: string[] = [];
  const domainCodes = new Set(domains.map((d) => d.code));
  const mappedDomains = new Set<string>();
  phases.forEach((phase) => {
    phase.domains?.forEach((code) => {
      if (!domainCodes.has(code)) {
        warnings.push(`Phase ${phase.id} references unknown domain ${code}`);
      }
      mappedDomains.add(code);
    });
  });
  domains.forEach((domain) => {
    if (!mappedDomains.has(domain.code)) {
      warnings.push(`Domain ${domain.code} is not assigned to any phase`);
    }
  });
  return warnings;
}

function validateApplicationStage(
  raw: ApplicationStageConfig
): ValidationResult<ApplicationStageConfig> {
  const warnings: string[] = [];
  if (!raw || typeof raw !== "object") {
    warnings.push("Application stage config missing or invalid");
    return {
      value: { id: "applicationTransaction", name: "Application Transaction" },
      warnings,
    };
  }
  if (!raw.id) warnings.push("Application stage missing id");
  if (!raw.name) warnings.push("Application stage missing name");
  return { value: raw, warnings };
}

function validateTabDomainMap(
  raw: TabDomainMapEntry[],
  domains: DomainConfig[],
  tabs: ProfileConfig["tabs"],
  applicationStage: ApplicationStageConfig
): ValidationResult<TabDomainMapEntry[]> {
  const warnings: string[] = [];
  const domainCodes = new Set(domains.map((d) => d.code));
  const tabIds = new Set(tabs.map((t) => t.id));
  const seenTabs = new Set<string>();
  raw.forEach((entry) => {
    if (!entry.tabId) warnings.push("Tab-domain map entry missing tabId");
    if (entry.tabId && !tabIds.has(entry.tabId)) {
      warnings.push(`Tab-domain map references unknown tab ${entry.tabId}`);
    }
    if (entry.tabId && seenTabs.has(entry.tabId)) {
      warnings.push(`Duplicate tab-domain mapping for tab ${entry.tabId}`);
    }
    seenTabs.add(entry.tabId);
    entry.domains?.forEach((code) => {
      if (!domainCodes.has(code)) {
        warnings.push(`Tab ${entry.tabId} references unknown domain ${code}`);
      }
    });
    if (entry.finalStage && entry.finalStage !== applicationStage.id) {
      warnings.push(
        `Tab ${entry.tabId} references unknown final stage ${entry.finalStage}`
      );
    }
  });
  return { value: raw, warnings };
}

const validatedConfigs: Record<ProfileVersion, ValidationResult<ProfileConfig>> = {
  v1: validateConfig(profileConfigJson as ProfileConfig),
  v2: validateConfig(profileV2ConfigJson as ProfileConfig),
  v3: validateConfig(profileV3ConfigJson as ProfileConfig),
  "stage1-apqc": validateConfig(profileStage1ConfigJson as ProfileConfig),
  apqc: validateConfig(profileApqcConfigJson as ProfileConfig),
};
const validatedStrings: Record<ProfileVersion, ValidationResult<ProfileStrings>> = {
  v1: validateStrings(profileStringsJson as ProfileStrings),
  v2: validateStrings(profileV2StringsJson as ProfileStrings),
  v3: validateStrings(profileV3StringsJson as ProfileStrings),
  "stage1-apqc": validateStrings(profileStage1StringsJson as ProfileStrings),
  apqc: validateStrings({} as ProfileStrings), // APQC version doesn't use separate strings file
};
const validatedMappings: Record<ProfileVersion, ValidationResult<MappingShape>> = {
  v1: validateMapping(profileMappingJson as MappingShape),
  v2: validateMapping(profileV2MappingJson as MappingShape),
  v3: validateMapping(profileV3MappingJson as MappingShape),
  "stage1-apqc": validateMapping(profileStage1MappingJson as MappingShape),
  apqc: validateMapping(profileApqcMappingJson as MappingShape),
};
const validatedPhases = validatePhases(profilePhasesJson as PhaseConfig[]);
const validatedDomains = validateDomains(
  profileDomainsJson as DomainConfig[],
  validatedPhases.value
);
const validatedApplicationStage = validateApplicationStage(
  applicationStageJson as ApplicationStageConfig
);
const validatedTabDomainMap = validateTabDomainMap(
  tabDomainMapJson as TabDomainMapEntry[],
  validatedDomains.value,
  validatedConfigs.v3.value.tabs,
  validatedApplicationStage.value
);
const phaseDomainWarnings = validatePhaseDomainCoverage(
  validatedDomains.value,
  validatedPhases.value
);

const reverseMappings: Record<ProfileVersion, Record<string, string>> = {
  v1: Object.entries(validatedMappings.v1.value.apiFieldMapping).reduce<
    Record<string, string>
  >((acc, [ui, api]) => {
    acc[api] = ui;
    return acc;
  }, {}),
  v2: Object.entries(validatedMappings.v2.value.apiFieldMapping).reduce<
    Record<string, string>
  >((acc, [ui, api]) => {
    acc[api] = ui;
    return acc;
  }, {}),
  "stage1-apqc": Object.entries(
    validatedMappings["stage1-apqc"].value.apiFieldMapping
  ).reduce<Record<string, string>>((acc, [ui, api]) => {
    acc[api] = ui;
    return acc;
  }, {}),
  v3: Object.entries(validatedMappings.v3.value.apiFieldMapping).reduce<
    Record<string, string>
  >((acc, [ui, api]) => {
    acc[api] = ui;
    return acc;
  }, {}),
  apqc: Object.entries(validatedMappings.apqc.value.apiFieldMapping).reduce<
    Record<string, string>
  >((acc, [ui, api]) => {
    acc[api] = ui;
    return acc;
  }, {}),
};

export function getProfileConfig(version: ProfileVersion = "apqc"): ProfileConfig {
  return validatedConfigs[version].value;
}

export function getProfileMapping(
  version: ProfileVersion = "apqc"
): Record<string, string> {
  return validatedMappings[version].value.apiFieldMapping;
}

export function getReverseProfileMapping(
  version: ProfileVersion = "apqc"
): Record<string, string> {
  return reverseMappings[version];
}

export function getProfileDomains(): DomainConfig[] {
  return validatedDomains.value;
}

export function getProfilePhases(): PhaseConfig[] {
  return validatedPhases.value;
}

export function getTabDomainMapping(): TabDomainMapEntry[] {
  return validatedTabDomainMap.value;
}

export function getApplicationStageMeta(): ApplicationStageConfig {
  return validatedApplicationStage.value;
}

export function getProfileConfigWarnings(): string[] {
  const versionWarnings = [
    ...validatedConfigs.v1.warnings,
    ...validatedConfigs.v2.warnings,
    ...validatedConfigs.v3.warnings,
    ...validatedConfigs["stage1-apqc"].warnings,
    ...validatedConfigs.apqc.warnings,
    ...validatedStrings.v1.warnings,
    ...validatedStrings.v2.warnings,
    ...validatedStrings.v3.warnings,
    ...validatedStrings["stage1-apqc"].warnings,
    ...validatedMappings.v1.warnings,
    ...validatedMappings.v2.warnings,
    ...validatedMappings.v3.warnings,
    ...validatedMappings["stage1-apqc"].warnings,
  ];
  return [
    ...versionWarnings,
    ...validatedPhases.warnings,
    ...validatedDomains.warnings,
    ...phaseDomainWarnings,
    ...validatedTabDomainMap.warnings,
    ...validatedApplicationStage.warnings,
  ];
}

export function getProfileString(key: string, fallback?: string): string {
  return getProfileStringByVersion(key, "v2", fallback);
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

function getProfileStringByVersion(
  key: string,
  version: ProfileVersion,
  fallback?: string
): string {
  const fallbacks: ProfileVersion[] = [
    version,
    ...(["v1", "v2", "v3", "stage1-apqc"] as ProfileVersion[]).filter(
      (v) => v !== version
    ),
  ];
  for (const candidate of fallbacks) {
    const value = validatedStrings[candidate]?.value?.[key];
    if (value !== undefined) return value;
  }
  return fallback ?? key;
}
