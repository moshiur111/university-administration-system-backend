import z from 'zod';
import { SEMESTER_REGISTRATION_STATUS } from './semesterRegistration.constant';

const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    minCredit: z.number(),
    maxCredit: z.number(),
  }),
});

const updateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
    status: z
      .enum([
        SEMESTER_REGISTRATION_STATUS.UPCOMING,
        SEMESTER_REGISTRATION_STATUS.ONGOING,
        SEMESTER_REGISTRATION_STATUS.ENDED,
      ])
      .optional(),
  }),
});

export const SemesterRegistrationValidations = {
  createSemesterRegistrationValidationSchema,
  updateSemesterRegistrationValidationSchema,
};
