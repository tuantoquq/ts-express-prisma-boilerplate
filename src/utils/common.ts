import envConfig from '../configs/env-config';
import ERRORS from '../constants/errors';
import { IError, IResponse } from '../types/response';

const pick = (obj: object, keys: string[]) => {
  return keys.reduce<{ [key: string]: unknown }>((rs, key) => {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      rs[key] = obj[key as keyof typeof obj];
    }
    return rs;
  }, {});
};

const exclude = <Type, Key extends keyof Type>(obj: Type, keys: Key[]) => {
  for (const key of keys) {
    delete obj[key];
  }
  return obj;
};

const buildResponse = <T>(data: T, error?: IError) => {
  const dataResponse: IResponse = {
    errorCode: error?.code || ERRORS.SUCCESS.code,
    message: error?.message || ERRORS.SUCCESS.message,
  };
  if (error && error.code !== ERRORS.SUCCESS.code && envConfig.env === 'production') {
    return dataResponse;
  }
  if (data && JSON.stringify(data) !== '{}') {
    dataResponse.data = data;
  }
  return dataResponse;
};

export { pick, exclude, buildResponse };
