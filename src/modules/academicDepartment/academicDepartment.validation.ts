import z from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    academicFaculty: z.string().min(1, 'Academic Faculty ID is required'),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    academicFaculty: z
      .string()
      .min(1, 'Academic Faculty ID is required')
      .optional(),
  }),
});

export const AcademicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
