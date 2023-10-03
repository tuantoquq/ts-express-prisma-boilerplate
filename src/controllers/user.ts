import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../middlewares/catch-async';
import { buildResponse, exclude } from '../utils/common';
import { User } from '@prisma/client';

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;
  const userData = exclude(user, ['password', 'createdAt', 'updatedAt']);
  return res.status(httpStatus.OK).json(buildResponse(userData));
});

export default {
  getProfile,
};
