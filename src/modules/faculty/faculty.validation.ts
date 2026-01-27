import z from 'zod';
import { BloodGroup, Gender } from './faculty.constant';

const userNameSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
});

const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    faculty: z.object({
      name: userNameSchema,
      designation: z.string().min(1, 'Designation is required'),
      gender: z.enum([...Gender], 'Gender is required'),
      dateOfBirth: z.string().optional(),
      email: z.string().email('Invalid email address'),
      contactNo: z.string().min(1, 'Contact number is required'),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency contact number is required'),
      bloodGroup: z.enum([...BloodGroup], 'Blood group is required'),
      presentAddress: z.string().min(1, 'Present address is required'),
      permanentAddress: z.string().min(1, 'Permanent address is required'),
      academicDepartment: z.string().min(1, 'Academic department is required'),
      profileImg: z.string().optional(),
    }),
  }),
});

const updateFacultyValidationSchema = z.object({
  body: z.object({
    name: userNameSchema.optional(),
    desigination: z.string().optional(),
    gender: z.enum([...Gender]).optional(),
    dateOfBirth: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
    contactNo: z.string().optional(),
    emergencyContactNo: z.string().optional(),
    bloodGroup: z.enum([...BloodGroup]).optional(),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),
    academicDepartment: z.string().optional(),
    profileImg: z.string().optional(),
  }),
});


export const FacultyValidations = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};