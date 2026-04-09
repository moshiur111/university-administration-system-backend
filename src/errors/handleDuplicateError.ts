import { TErrorSources } from '../interface/error';

// Dynamically converts any camelCase field to a readable label
// id → "ID"
// contactNo → "Contact No"
const toReadableLabel = (field: string): string => {
  return field
    .replace(/([A-Z])/g, ' $1') // split camelCase → "contact No"
    .replace(/^./, (s) => s.toUpperCase()) // capitalize first letter → "Contact No"
    .replace(/\bId\b/g, 'ID') // "Id" → "ID"
    .trim();
};

const handleDuplicateError = (err: any) => {
  const keyValue = err?.keyValue || {};

  let errorSources: TErrorSources = [];
  let message = 'Duplicate entry detected';

  if (Object.keys(keyValue).length) {
    errorSources = Object.entries(keyValue).map(([field]) => ({
      path: field,
      message: `${toReadableLabel(field)} already exists`,
    }));

    message = errorSources.map((e) => e.message).join(', ');
  } else {
    const errmsg: string = err?.message || err?.errmsg || '';
    const match = errmsg.match(/dup key:\s*{(.*)}/);

    if (match && match[1]) {
      const pairs = match[1]
        .split(',')
        .map((pair) => pair.trim().replace(/"/g, ''));

      errorSources = pairs.map((item) => {
        const [field] = item.split(':').map((v) => v.trim());

        return {
          path: field || 'field',
          message: `${toReadableLabel(field)} already exists`,
        };
      });

      message = errorSources.map((e) => e.message).join(', ');
    } else {
      errorSources = [
        {
          path: '',
          message: 'Duplicate value already exists',
        },
      ];
    }
  }

  return {
    statusCode: 400,
    message,
    errorSources,
  };
};

export default handleDuplicateError;
