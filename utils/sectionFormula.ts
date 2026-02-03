const SECTION_CONDITION_REGEX = /condition\s*:\s*\(/gi;

export const normalizeSectionConditionSpacing = (value: string) =>
  value.replace(SECTION_CONDITION_REGEX, "condition:(");
