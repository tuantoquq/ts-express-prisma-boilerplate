import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IResponse } from '../types/response';
import ERRORS from '../constants/errors';
const healthCheck = async (req: Request, res: Response) => {
  const response: IResponse = {
    errorCode: ERRORS.SUCCESS.code,
    message: 'Service is healthy!',
  };
  return res.status(httpStatus.OK).json(response);
};

export default {
  healthCheck,
};
