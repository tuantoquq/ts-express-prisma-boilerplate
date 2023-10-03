import { Role, User } from '@prisma/client';
import httpStatus from 'http-status';
import ERRORS from '../constants/errors';
import { BaseException } from '../errors/api-error';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

const verifyCallback =
  (
    req: any,
    resolve: (value?: unknown) => void,
    reject: (reason?: unknown) => void,
    requiredRights: Array<Role>,
  ) =>
  async (err: unknown, user: User | false, info: unknown) => {
    if (err || info || !user) {
      return reject(new BaseException(httpStatus.UNAUTHORIZED, ERRORS.COMMON.UNAUTHORIZED));
    }
    req.user = user;

    if (requiredRights.length) {
      if (!requiredRights.includes(user.role)) {
        return reject(new BaseException(httpStatus.FORBIDDEN, ERRORS.COMMON.FORBIDDEN));
      }
    }
    resolve();
  };

const roles =
  (...requiredRights: Array<Role>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights),
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default roles;
