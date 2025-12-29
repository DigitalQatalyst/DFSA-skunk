export const HELP_CENTER_SUBTYPES = ['guide', 'faq', 'walkthrough'] as const;
export type HelpCenterSubtype = typeof HELP_CENTER_SUBTYPES[number];

export const HELP_CENTER_TYPES = ['Guide', 'FAQ', 'Walkthrough', 'Video'] as const;
export type HelpCenterType = typeof HELP_CENTER_TYPES[number];

export type HelpCenterDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type HelpCenterStatus = 'Draft' | 'Published';
