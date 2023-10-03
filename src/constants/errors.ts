import { IError } from '../types/response';

const ERRORS = {
  SUCCESS: {
    code: 0,
    message: 'Successfully!',
  } as IError,
  COMMON: {
    INTERNAL_SERVER_ERROR: {
      code: 1000,
      message: 'Internal Server Error!',
    } as IError,
    API_NOT_FOUND: {
      code: 1001,
      message: 'API not found!',
    } as IError,
    VALIDATION_ERROR: {
      code: 1003,
      message: 'Validation error!',
    } as IError,
    UNAUTHORIZED: {
      code: 1005,
      message: 'Unauthorized!',
    } as IError,
    FORBIDDEN: {
      code: 1006,
      message: 'Forbidden in this resources!',
    } as IError,
  },
  AUTH: {
    EMAIL_EXISTED: {
      code: 1002,
      message: 'Email has been existed!',
    } as IError,
    INCORRECT_EMAIL_OR_PASSWORD: {
      code: 1004,
      message: 'Incorrect email or password!',
    } as IError,
    EMAIL_NOT_FOUND: {
      code: 1007,
      message: 'No users found with this email!',
    } as IError,
  },
  USER: {
    NOT_FOUND: {
      code: 1008,
      message: 'User not found!',
    } as IError,
  },
};
export default ERRORS;
