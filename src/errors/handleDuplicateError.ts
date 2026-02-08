/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources } from '../interface/error';

const handleDuplicateError = (err: any) => {
  const errmsg: string = err.message || err.errmsg || '';

  // Extract duplicate value with regex
  const match = errmsg.match(/dup key:\s*{\s*[^:]+:\s*"([^"]+)"\s*}/);
  const value = match ? match[1] : 'Unknown';

  // Extract the key name (e.g., "name", "email")
  const key = Object.keys(err.keyValue || {})[0] || 'field';

  const errorSources: TErrorSources = [
    {
      path: key,
      message: `${value} already exists`,
    },
  ];

  return {
    statusCode: 400,
    message: 'Duplicate Key Error',
    errorSources,
  };
};

export default handleDuplicateError;
