import { TokenType, User } from '@prisma/client';
import { LoginDto } from '../dtos/auth';
import { tokenService, userService } from '.';
import { comparePassword, hashPassword } from '../utils/encryption';
import { BaseException } from '../errors/api-error';
import httpStatus from 'http-status';
import ERRORS from '../constants/errors';
import { exclude } from '../utils/common';
import prisma from '../prisma-client';

/**
 * Login with email and password
 * @param {LoginDto} loginDto
 * @returns {Promise<Omit<User, 'password'>>}
 */
const loginWithEmailAndPassword = async (loginDto: LoginDto): Promise<Omit<User, 'password'>> => {
  const user = await userService.getUserByEmail(loginDto.email, [
    'id',
    'email',
    'password',
    'name',
    'role',
    'password',
    'createdAt',
    'updatedAt',
    'isEmailVerified',
  ]);
  const checkPassword = await comparePassword(loginDto.password, user?.password as string);
  if (!user || !checkPassword) {
    throw new BaseException(httpStatus.UNAUTHORIZED, ERRORS.AUTH.INCORRECT_EMAIL_OR_PASSWORD);
  }
  return exclude(user, ['password']);
};

/**
 * Logout user
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenData = await prisma.token.findFirst({
    where: {
      token: refreshToken,
      type: TokenType.REFRESH,
    },
  });
  if (!refreshTokenData) {
    throw new BaseException(httpStatus.UNAUTHORIZED, ERRORS.COMMON.UNAUTHORIZED);
  }
  await prisma.token.delete({
    where: {
      id: refreshTokenData.id,
    },
  });
};

/**
 * Confirm reset password
 * @param {string} tokenReset
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
const confirmResetPassword = async (tokenReset: string, newPassword: string): Promise<void> => {
  const resetPasswordToken = await tokenService.verifyToken(tokenReset, TokenType.PASSWORD_RESET);
  const user = await userService.getUserById(resetPasswordToken.userId);
  if (!user) {
    throw new BaseException(httpStatus.FORBIDDEN, ERRORS.COMMON.FORBIDDEN);
  }
  const encryptPassword = await hashPassword(newPassword);
  await userService.updateUserById(user.id, {
    password: encryptPassword,
  });
  await prisma.token.deleteMany({
    where: {
      userId: user.id,
      type: TokenType.PASSWORD_RESET,
    },
  });
};

/**
 * Confirm verify email
 * @param {string} tokenVerify
 * @returns {Promise<void>}
 */
const confirmVerifyEmail = async (tokenVerify: string): Promise<void> => {
  const verifyEmailToken = await tokenService.verifyToken(
    tokenVerify,
    TokenType.EMAIL_VERIFICATION,
  );
  const user = await userService.getUserById(verifyEmailToken.userId);
  if (!user) {
    throw new BaseException(httpStatus.FORBIDDEN, ERRORS.COMMON.FORBIDDEN);
  }
  await userService.updateUserById(user.id, {
    isEmailVerified: true,
  });
  await prisma.token.deleteMany({
    where: {
      userId: user.id,
      type: TokenType.EMAIL_VERIFICATION,
    },
  });
};
export default {
  loginWithEmailAndPassword,
  logout,
  confirmResetPassword,
  confirmVerifyEmail,
};
