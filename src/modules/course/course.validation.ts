import z from 'zod';

const createPreRequisiteValidationSchema = z.object({
  course: z.string().min(1, 'Course is required'),
});

const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    prefix: z.string().min(1, 'Prefix is required'),
    code: z.number().min(1, 'Code is required'),
    credits: z.number().min(1, 'Credits is required'),
    preRequisiteCourses: z.array(createPreRequisiteValidationSchema).optional(),
  }),
});

const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    prefix: z.string().min(1, 'Prefix is required').optional(),
    code: z.number().min(1, 'Code is required').optional(),
    credits: z.number().min(1, 'Credits is required').optional(),
    preRequisiteCourses: z.array(createPreRequisiteValidationSchema).optional(),
  }),
});

export const CourseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
};
