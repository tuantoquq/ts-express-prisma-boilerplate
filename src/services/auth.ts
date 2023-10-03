import { TokenType, User } from '@prisma/client';
import { LoginDto } from '../dtos/auth';
import { userService } from '.';
import { comparePassword } from '../utils/encryption';
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

export default {
  loginWithEmailAndPassword,
  logout,
};
