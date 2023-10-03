import envConfig from '../configs/env-config';
import { GenerateTokenDto, SaveTokenDto } from '../dtos/token';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import prisma from '../prisma-client';
import { Token, TokenType } from '@prisma/client';
import { AuthTokenResponse, IJwtPayload } from '../types/data';
import { BaseException } from '../errors/api-error';
import httpStatus from 'http-status';
import ERRORS from '../constants/errors';
import { userService } from '.';
/**
 * Generate a token
 * @param {GenerateTokenDto} Generate token dto
 * @returns {string} Token
 */
const generateToken = ({
  userId,
  expires,
  type,
  secret = envConfig.jwt.secret,
}: GenerateTokenDto): string => {
  const payload: IJwtPayload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {SaveTokenDto} Save Token dto
 * @returns {Promise<Token>} Token
 */
const saveToken = async ({ token, userId, expires, type }: SaveTokenDto): Promise<Token> => {
  const createdToken = await prisma.token.create({
    data: {
      token,
      expires: expires.toDate(),
      type,
      userId,
    },
  });
  return createdToken;
};

/**
 * Generate auth tokens (access and refresh)
 * @param {number} userId User id
 * @returns {Promise<AuthTokenResponse>} Auth tokens
 */
const generateAuthTokens = async (userId: number): Promise<AuthTokenResponse> => {
  const accessTokenExpires = moment().add(envConfig.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken({
    userId,
    expires: accessTokenExpires,
    type: TokenType.ACCESS,
    secret: envConfig.jwt.secret,
  });
  const refreshTokenExpires = moment().add(envConfig.jwt.refreshExpirationMinutes, 'minutes');
  const refreshToken = generateToken({
    userId,
    expires: refreshTokenExpires,
    type: TokenType.REFRESH,
    secret: envConfig.jwt.secret,
  });
  await saveToken({
    token: refreshToken,
    userId,
    expires: refreshTokenExpires,
    type: TokenType.REFRESH,
  });
  return {
    accessToken: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refreshToken: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Verify token and return token data
 * @param {string} token Token
 * @param {TokenType} type Token type
 * @returns {Promise<Token>} Token
 */
const verifyToken = async (token: string, type: TokenType): Promise<Token> => {
  try {
    const payload = jwt.verify(token, envConfig.jwt.secret);
    const userId = Number(payload.sub);
    const tokenData = await prisma.token.findFirst({
      where: {
        token,
        type,
        userId,
      },
    });
    if (!tokenData) {
      throw new BaseException(httpStatus.UNAUTHORIZED, ERRORS.COMMON.UNAUTHORIZED);
    }
    return tokenData;
  } catch (error) {
    throw new BaseException(httpStatus.UNAUTHORIZED, ERRORS.COMMON.UNAUTHORIZED);
  }
};

/**
 * Generate forgot password token
 * @param {string} email
 * @returns {Promise<string>} token
 */
const generateForgotPasswordToken = async (email: string): Promise<string> => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new BaseException(httpStatus.BAD_REQUEST, ERRORS.AUTH.EMAIL_NOT_FOUND);
  }
  const expires = moment().add(envConfig.jwt.resetPasswordExpirationMinutes, 'minutes');
  const forgotPasswordToken = generateToken({
    userId: user.id,
    expires,
    type: TokenType.PASSWORD_RESET,
    secret: envConfig.jwt.secret,
  });
  await saveToken({
    token: forgotPasswordToken,
    userId: user.id as number,
    expires,
    type: TokenType.PASSWORD_RESET,
  });
  return forgotPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user data
 * @returns {Promise<string>} token
 */
const generateVerifyEmailToken = async (user: { id: number }): Promise<string> => {
  const expires = moment().add(envConfig.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken({
    userId: user.id,
    expires,
    type: TokenType.EMAIL_VERIFICATION,
    secret: envConfig.jwt.secret,
  });
  await saveToken({
    token: verifyEmailToken,
    userId: user.id,
    expires,
    type: TokenType.EMAIL_VERIFICATION,
  });
  return verifyEmailToken;
};

export default {
  generateToken,
  saveToken,
  generateAuthTokens,
  verifyToken,
  generateForgotPasswordToken,
  generateVerifyEmailToken,
};
