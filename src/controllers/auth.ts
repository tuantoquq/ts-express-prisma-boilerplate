import { authService, emailService, tokenService, userService } from '../services';
import catchAsync from '../middlewares/catch-async';
import { Request, Response } from 'express';
import { buildResponse, exclude } from '../utils/common';
import httpStatus from 'http-status';
import { LoginDto, RegisterDto } from '../dtos/auth';
import { User } from '@prisma/client';

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

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const resetPasswordToken = await tokenService.generateForgotPasswordToken(req.body.email);
  await emailService.sendEmailResetPassword(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const confirmResetPassword = catchAsync(async (req: Request, res: Response) => {
  const tokenReset = req.query.token as string;
  const newPassword = req.body.password as string;
  await authService.confirmResetPassword(tokenReset, newPassword);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;
  const token = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendEmailVerifyEmail(user.email, token);
  res.status(httpStatus.NO_CONTENT).send();
});

const confirmVerifyEmail = catchAsync(async (req: Request, res: Response) => {
  const tokenVerify = req.query.token as string;
  await authService.confirmVerifyEmail(tokenVerify);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  sendVerificationEmail,
  confirmResetPassword,
  confirmVerifyEmail,
};
