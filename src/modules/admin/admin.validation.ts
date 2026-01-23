import z from 'zod';
import { BloodGroup, Gender } from './admin.constant';

const createUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20),
  middleName: z.string().max(20).optional(),
  lastName: z.string().max(20),
});

const createAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().min(6).max(20),
    admin: z.object({
      designation: z.string(),
      name: createUserNameValidationSchema,
      gender: z.enum([...Gender]),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum([...BloodGroup]),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      profileImg: z.string().optional(),
    }),
  }),
});

export const AdminValidations = {
  createAdminValidationSchema,
};
