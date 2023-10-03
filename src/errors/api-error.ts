import httpStatus from 'http-status';
import ERRORS from '../constants/errors';
import { IError } from '../types/response';

export class BaseException extends Error {
  statusCode: number;
  errorCode: number;
  constructor(
    statusCode: number = httpStatus.INTERNAL_SERVER_ERROR,
    error: IError = ERRORS.COMMON.INTERNAL_SERVER_ERROR,
    stack?: any,
  ) {
    super(error.message);
    this.statusCode = statusCode;
    this.errorCode = error.code;
    if (stack) {
      this.stack = stack;
    }
  }
}
