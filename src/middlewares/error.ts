import { ErrorRequestHandler } from 'express';
import { BaseException } from '../errors/api-error';
import httpStatus from 'http-status';
import { buildResponse } from '../utils/common';

export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  let error = err;
  if (!(error instanceof BaseException)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

    const message = error.message || httpStatus[statusCode];
    error = new BaseException(statusCode, { code: statusCode, message }, err?.stack);
  }
  res.locals.errorMessage = error.message;

  const response = buildResponse(error.stack, { code: error.errorCode, message: error.message });
  res.status(error.statusCode).json(response);
};
