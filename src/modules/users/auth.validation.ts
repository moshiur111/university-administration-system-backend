import z, { string } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    id: string(),
    password: string(),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
};
