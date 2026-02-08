import { ZodError } from 'zod';
import { TErrorSources } from '../interface/error';

// Handle Zod validation error
const handleZodError = (err: ZodError) => {
  const errorSources: TErrorSources = err.issues.map((issue) => ({
    path: issue.path.join('.'), // full field path
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleZodError;
