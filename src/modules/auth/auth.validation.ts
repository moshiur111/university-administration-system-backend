import z, { string } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    id: string(),
    password: string(),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: string({ message: 'Old password is required' }),
    newPassword: string({ message: 'New password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: string({ message: 'Refresh token is required' }),
  }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    id: string({ message: 'UserId is required' }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: string({ message: 'UserId is required' }),
    newPassword: string({ message: 'New password is required' }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
