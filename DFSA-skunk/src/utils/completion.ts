import {
  getVisibleUserFillableFields,
  isAnsweredFieldValue,
  type DomainDataCheckOptions,
  type DomainSchemaLike,
} from './profileData';

type MandatoryField = {
  fieldName: string;
  label?: string;
  mandatory?: boolean;
  required?: boolean;
};

type DomainInput = {
  id: string;
  schema?: DomainSchemaLike | null;
  data?: Record<string, unknown> | null;
  completion?: number | null;
};

type MissingMandatorySummary = {
  total: number;
  missing: number;
  missingFields: Array<{ domainId: string; groupId: string; fieldName: string; label?: string }>;
};

const isMandatoryField = (field: MandatoryField): boolean =>
  field?.mandatory === true || field?.required === true;

export function getDomainMandatorySummary(
  domainId: string,
  schema: DomainSchemaLike | null | undefined,
  data: Record<string, unknown> | null | undefined,
  options?: DomainDataCheckOptions
): MissingMandatorySummary {
  const answers = (data ?? {}) as Record<string, unknown>;
  const visibleFields = getVisibleUserFillableFields(schema, answers, options);
  const mandatoryFields = visibleFields.filter(({ field }) => isMandatoryField(field as MandatoryField));
  const missingFields = mandatoryFields.filter(
    ({ field }) => !isAnsweredFieldValue(field, answers[field.fieldName])
  );

  return {
    total: mandatoryFields.length,
    missing: missingFields.length,
    missingFields: missingFields.map(({ groupId, field }) => ({
      domainId,
      groupId,
      fieldName: field.fieldName,
      label: (field as MandatoryField).label,
    })),
  };
}

export function getMissingMandatorySummary(
  domains: DomainInput[],
  options?: DomainDataCheckOptions
): MissingMandatorySummary {
  return domains.reduce<MissingMandatorySummary>(
    (acc, domain) => {
      if (!domain.schema) return acc;
      const summary = getDomainMandatorySummary(domain.id, domain.schema, domain.data, options);
      acc.total += summary.total;
      acc.missing += summary.missing;
      acc.missingFields.push(...summary.missingFields);
      return acc;
    },
    { total: 0, missing: 0, missingFields: [] }
  );
}

export function getAverageCompletion(domains: DomainInput[]): number {
  const values = domains
    .map((domain) => (typeof domain.completion === 'number' ? domain.completion : null))
    .filter((value): value is number => value !== null && Number.isFinite(value))
    .map((value) => Math.max(0, Math.min(100, value)));

  if (values.length === 0) return 0;
  const sum = values.reduce((acc, value) => acc + value, 0);
  return Math.round(sum / values.length);
}
