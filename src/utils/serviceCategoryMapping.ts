export const SERVICE_CATEGORY_MAP: { [key: number]: string } = {
  123950001: 'Project & Specialized Financing',
  123950002: 'Growth & Expansion Financing',
  123950003: 'Loan Management & Adjustments',
  123950000: 'Business Operations Financing',
  123950004: 'Business Asset Financing',
  123950005: 'Investment & Equity Financing'
};

export const getServiceCategoryLabel = (code: number | string): string => {
  const numCode = typeof code === 'string' ? parseInt(code) : code;
  return SERVICE_CATEGORY_MAP[numCode] || `Category ${code}`;
};

export const SUBSERVICE_TYPES_ENDPOINT = [
  { value: 123950000, label: 123950000 },
  { value: 123950002, label: 123950002 },
  { value: 123950003, label: 123950003 },
  { value: 123950005, label: 123950005 }
];

export const getSubServiceTypes = () => SUBSERVICE_TYPES_ENDPOINT;

export const SERVICE_TYPES_ENDPOINT = [
  { value: 123950000, label: 'Financial' },
  { value: 123950001, label: 'Non-Financial' }
];

export const getServiceTypes = () => SERVICE_TYPES_ENDPOINT;

export const getDateRanges = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 10; i++) {
    const year = currentYear - i;
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
};
