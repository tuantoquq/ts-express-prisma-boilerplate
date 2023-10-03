import { RequestHandler } from 'express';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { BaseException } from '../errors/api-error';
import { buildResponse } from '../utils/common';

export interface CustomParamDictionary {
  [key: string]: any;
}

const catchAsync =
  (fn: RequestHandler<CustomParamDictionary, any, any, qs.ParsedQs, Record<string, any>>) =>
  (
    req: Request<CustomParamDictionary, any, any, any, Record<string, any>>,
    res: Response<any, Record<string, any>, number>,
    next: NextFunction,
  ) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      if (!(error instanceof BaseException)) {
        const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

        const message = error.message || httpStatus[statusCode];
        error = new BaseException(statusCode, { code: statusCode, message }, error?.stack);
      }
      res.locals.errorMessage = error.message;

      const response = buildResponse(error.stack, {
        code: error.errorCode,
        message: error.message,
      });
      res.status(error.statusCode).json(response);
    });
  };

export default catchAsync;
