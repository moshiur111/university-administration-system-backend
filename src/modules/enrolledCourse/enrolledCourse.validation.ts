import z from 'zod';

const createEnrolledCourseValidationSchema = z.object({
  body: z.object({
    offeredCourse: z.string().min(1, 'Offered Course is required'),
  }),
});

const updateEnrolledCourseValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string().optional(),
    offeredCourse: z.string().optional(),
    student: z.string().optional(),
    courseMarks: z.object({
      classTest1: z.number().optional(),
      midTerm: z.number().optional(),
      classTest2: z.number().optional(),
      finalTerm: z,
    }),
  }),
});

export const EnrolledCourseValidations = {
  createEnrolledCourseValidationSchema,
  updateEnrolledCourseValidationSchema,
};
