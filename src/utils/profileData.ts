import { filterVisible, type VisibilityRule } from './visibility';

export type DomainFieldConfig = {
  fieldName: string;
  fieldType?: string;
  readOnly?: boolean;
  uiBlockType?: string;
  visibility?: VisibilityRule;
};

export type DomainGroupConfig = {
  id: string;
  fields?: DomainFieldConfig[];
};

export type DomainSchemaLike = {
  groups?: DomainGroupConfig[];
};

export type DomainDataCheckOptions = {
  excludeReadOnly?: boolean;
  excludeFieldNames?: string[];
  excludeUiBlockTypes?: string[];
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function tryParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function isMeaningfulValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;

  if (typeof value === 'boolean') return true;

  if (typeof value === 'number') return Number.isFinite(value);

  if (typeof value === 'string') return value.trim().length > 0;

  if (Array.isArray(value)) {
    if (value.length === 0) return false;
    return value.some((item) => isMeaningfulValue(item));
  }

  if (isPlainObject(value)) {
    const values = Object.values(value);
    if (values.length === 0) return false;
    return values.some((v) => isMeaningfulValue(v));
  }

  return false;
}

export function isFieldUserFillable(field: DomainFieldConfig, options?: DomainDataCheckOptions): boolean {
  const excludeReadOnly = options?.excludeReadOnly ?? true;
  const excludedNames = options?.excludeFieldNames ?? [];
  const excludedUiBlockTypes = options?.excludeUiBlockTypes ?? ['matrixAccordion'];

  if (!field?.fieldName) return false;
  if (excludeReadOnly && field.readOnly === true) return false;
  if (excludedNames.includes(field.fieldName)) return false;
  if (field.uiBlockType && excludedUiBlockTypes.includes(field.uiBlockType)) return false;
  return true;
}

export function isAnsweredFieldValue(field: DomainFieldConfig, rawValue: unknown): boolean {
  if (rawValue === null || rawValue === undefined) return false;

  if (field.fieldType === 'Boolean') return typeof rawValue === 'boolean';

  if (field.fieldType === 'Address') {
    const parsed = typeof rawValue === 'string' ? tryParseJson(rawValue) : rawValue;
    return isMeaningfulValue(parsed);
  }

  return isMeaningfulValue(rawValue);
}

export function getVisibleUserFillableFields(
  schema: DomainSchemaLike | null | undefined,
  data: Record<string, unknown> | null | undefined,
  options?: DomainDataCheckOptions
): Array<{ groupId: string; field: DomainFieldConfig }> {
  const groups = schema?.groups ?? [];
  const answers = (data ?? {}) as Record<string, any>;

  const result: Array<{ groupId: string; field: DomainFieldConfig }> = [];

  for (const group of groups) {
    const fields = group.fields ?? [];
    const visibleFields = filterVisible(fields as any, answers) as DomainFieldConfig[];

    for (const field of visibleFields) {
      if (!isFieldUserFillable(field, options)) continue;
      result.push({ groupId: group.id, field });
    }
  }

  return result;
}

export function hasMeaningfulDomainData(
  schema: DomainSchemaLike | null | undefined,
  data: Record<string, unknown> | null | undefined,
  options?: DomainDataCheckOptions
): boolean {
  const answers = (data ?? {}) as Record<string, unknown>;
  const visibleUserFillable = getVisibleUserFillableFields(schema, answers, options);
  return visibleUserFillable.some(({ field }) => isAnsweredFieldValue(field, answers[field.fieldName]));
}

export type DomainCompletionStats = {
  answered: number;
  total: number;
  percentage: number;
  perGroup: Record<string, { answered: number; total: number; percentage: number }>;
};

export function calculateDomainCompletionStats(
  schema: DomainSchemaLike | null | undefined,
  data: Record<string, unknown> | null | undefined,
  options?: DomainDataCheckOptions
): DomainCompletionStats {
  const answers = (data ?? {}) as Record<string, unknown>;

  const perGroup: DomainCompletionStats['perGroup'] = {};
  let answered = 0;
  let total = 0;

  for (const group of schema?.groups ?? []) {
    const fields = group.fields ?? [];
    const visibleFields = filterVisible(fields as any, answers) as DomainFieldConfig[];
    const userFillable = visibleFields.filter((f) => isFieldUserFillable(f, options));

    const groupTotal = userFillable.length;
    const groupAnswered = userFillable.filter((f) => isAnsweredFieldValue(f, answers[f.fieldName])).length;
    const groupPercentage = groupTotal > 0 ? Math.round((groupAnswered / groupTotal) * 100) : 0;

    perGroup[group.id] = { answered: groupAnswered, total: groupTotal, percentage: groupPercentage };

    total += groupTotal;
    answered += groupAnswered;
  }

  const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
  return { answered, total, percentage, perGroup };
}

