import z from 'zod';

const timeStringSchema = z.string().refine(
  (time) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  },
  {
    message: 'Invalid start time format. Use HH:mm in 24-hour format.',
  },
);

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z
        .string()
        .min(1, 'Semester registration is required'),
      academicFaculty: z.string().min(1, 'Academic faculty is required'),
      academicDepartment: z.string().min(1, 'Academic department is required'),
      course: z.string().min(1, 'Course is required'),
      faculty: z.string().min(1, 'Faculty is required'),
      maxCapacity: z.number().min(1, 'Max capacity is required'),
      section: z.number().min(1, 'Section is required'),
      days: z.array(z.string()).min(1, 'Days is required'),
      startTime: z.string().min(1, 'Start time is required'),
      endTime: z.string().min(1, 'End time is required'),
    })
    .refine(
      (body) => {
        const start = new Date(`1970-01-01T${body.startTime}`);
        const end = new Date(`1970-01-01T${body.endTime}`);
        return start < end;
      },
      {
        message: 'Start time must be before end time',
      },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string().min(1, 'Faculty is required').optional(),
      maxCapacity: z.number().min(1, 'Max capacity is required').optional(),
      section: z.number().min(1, 'Section is required').optional(),
      days: z.array(z.string()).min(1, 'Days is required').optional(),
      startTime: timeStringSchema.optional(),
      endTime: timeStringSchema.optional(),
    })
    .refine(
      (body) => {
        if (body.startTime && body.endTime) {
          const start = new Date(`1970-01-01T${body.startTime}`);
          const end = new Date(`1970-01-01T${body.endTime}`);
          return start < end;
        }
        return true;
      },
      {
        message: 'Start time must be before end time',
      },
    ),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
