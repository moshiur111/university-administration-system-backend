import z from 'zod';

const createEnrollmentValidationSchema = z.object({
  body: z.object({
    student: z.string().min(1, 'Student ID is required'),
    academicSemester: z.string().min(1, 'Academic Semester ID is required'),
    academicDepartment: z.string().min(1, 'Academic Department ID is required'),
  }),
});

export const EnrollmentValidations = {
  createEnrollmentValidationSchema,
};
