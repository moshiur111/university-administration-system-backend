export const USER_ROLES = {
  ADMIN: "admin",
  FACULTY: "faculty",
  STUDENT: "student",
} as const;

export const USER_STATUS = {
  IN_PROGRESS: "in-progress",
  BLOCKED: "blocked",
} as const;

export type UserRoles = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
