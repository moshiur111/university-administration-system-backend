export const ACADEMIC_SEMESTER_CODES = {
  Spring: '01',
  Summer: '02',
  Fall: '03',
} as const;

export const ACADEMIC_SEMESTER_NAMES = ['Spring', 'Summer', 'Fall'] as const;

export const SEMESTER_MONTH_RANGE = {
  Spring: { startMonth: 1, endMonth: 4 },
  Summer: { startMonth: 5, endMonth: 8 },
  Fall: { startMonth: 9, endMonth: 12 },
} as const;

export const MONTH_MAP = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
} as const;
