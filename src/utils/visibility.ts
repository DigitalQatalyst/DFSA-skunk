export type VisibilityRule =
  | { type: 'always' }
  | { type: 'includes'; source: 'license_category'; value: string }
  | { type: 'equals'; field: string; value: string | number | boolean | null };

// Map license category labels to boolean field names
const LICENSE_CATEGORY_FIELDS: Record<string, string> = {
  'Banking & Investment': 'license_category_financial_services',
  'Insurance General': 'license_category_insurance_general',
  'Insurance Life': 'license_category_insurance_life',
  'Money Services': 'license_category_money_services',
};

export function isVisible(
  visibility: VisibilityRule | undefined,
  answers: Record<string, any>
): boolean {
  if (!visibility || visibility.type === 'always') return true;

  if (visibility.type === 'includes' && visibility.source === 'license_category') {
    const fieldName = LICENSE_CATEGORY_FIELDS[visibility.value];
    if (!fieldName) return false;
    return Boolean(answers?.[fieldName]);
  }

  if (visibility.type === 'equals') {
    return answers?.[visibility.field] === visibility.value;
  }

  return true;
}

export function filterVisible<T extends { visibility?: VisibilityRule }>(
  items: T[],
  answers: Record<string, any>
): T[] {
  return items.filter((item) => isVisible(item.visibility as VisibilityRule, answers));
}

