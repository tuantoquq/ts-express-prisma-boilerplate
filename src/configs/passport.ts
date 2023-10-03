import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback } from 'passport-jwt';
import envConfig from './env-config';
import { IJwtPayload } from '../types/data';
import { TokenType } from '@prisma/client';
import { BaseException } from '../errors/api-error';
import ERRORS from '../constants/errors';
import httpStatus from 'http-status';
import prisma from '../prisma-client';

const jwtOptions = {
  secretOrKey: envConfig.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify: VerifyCallback = async (payload: IJwtPayload, done) => {
  try {
    if (payload.type !== TokenType.ACCESS) {
      throw new BaseException(httpStatus.UNAUTHORIZED, ERRORS.COMMON.UNAUTHORIZED);
    }
    const user = await prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!user) {
      throw new BaseException(httpStatus.UNAUTHORIZED, ERRORS.COMMON.UNAUTHORIZED);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
