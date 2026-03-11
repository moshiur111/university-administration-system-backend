import { TErrorSources } from '../interface/error';

const handleDuplicateError = (err: any) => {
  const keyValue = err?.keyValue || {};

  let errorSources: TErrorSources = [];
  let message = 'Duplicate entry detected';

  if (Object.keys(keyValue).length) {
    errorSources = Object.entries(keyValue).map(([field, value]) => ({
      path: field,
      message: `${value} already exists`,
    }));

    const values = Object.values(keyValue).join(' ');

    message = `${values} already exists`;
  } else {
    const errmsg: string = err?.message || err?.errmsg || '';

    const match = errmsg.match(/dup key:\s*{(.*)}/);

    if (match && match[1]) {
      const pairs = match[1]
        .split(',')
        .map((pair) => pair.trim().replace(/"/g, ''));

      errorSources = pairs.map((item) => {
        const [field, value] = item.split(':').map((v) => v.trim());

        return {
          path: field || 'field',
          message: `${value || 'Duplicate value'} already exists`,
        };
      });

      const values = pairs
        .map((item) => item.split(':')[1]?.trim())
        .join(' ');

      message = `${values} already exists`;
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