import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import httpStatus from 'http-status';
import ERRORS from '../constants/errors';
import { buildResponse, pick } from '../utils/common';
const validate = (schema: object) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ')
      .replace(/['"]+/g, '');
    const errorResponse = buildResponse(null, {
      code: ERRORS.COMMON.VALIDATION_ERROR.code,
      message: errorMessage,
    });
    return res.status(httpStatus.BAD_REQUEST).json(errorResponse);
  }
  Object.assign(req, value);
  return next();
};

export default validate;
