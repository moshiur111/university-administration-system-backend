export const SEMESTER_REGISTRATION_STATUS = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  ENDED: 'ENDED',
} as const;

export type TSemesterRegistrationStatus =
  (typeof SEMESTER_REGISTRATION_STATUS)[keyof typeof SEMESTER_REGISTRATION_STATUS];
