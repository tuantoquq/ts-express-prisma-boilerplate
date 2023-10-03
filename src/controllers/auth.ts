import { authService, tokenService, userService } from '../services';
import catchAsync from '../middlewares/catch-async';
import { Request, Response } from 'express';
import { buildResponse, exclude } from '../utils/common';
import httpStatus from 'http-status';
import { LoginDto, RegisterDto } from '../dtos/auth';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const userCreateDto = req.body as RegisterDto;
  const user = await userService.createUser(userCreateDto);
  const userResponse = exclude(user, ['password', 'createdAt', 'updatedAt']);
  return res.status(httpStatus.CREATED).json(buildResponse(userResponse));
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const loginDto = req.body as LoginDto;
  const user = await authService.loginWithEmailAndPassword(loginDto);
  const token = await tokenService.generateAuthTokens(user.id);
  return res.status(httpStatus.OK).json(buildResponse(token));
});

export default {
  registerUser,
  loginUser,
};
