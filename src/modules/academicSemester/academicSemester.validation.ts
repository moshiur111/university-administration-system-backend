import z from 'zod';
import { ACADEMIC_SEMESTER_NAMES } from './academicSemester.constant';

const createAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum(ACADEMIC_SEMESTER_NAMES),
    year: z.number().min(2000),
  }),
});

const updateAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum(ACADEMIC_SEMESTER_NAMES).optional(),
    year: z.number().min(2000).optional(),
  }),
});

export const AcademicSemesterValidations = {
  createAcademicSemesterValidationSchema,
  updateAcademicSemesterValidationSchema,
};
