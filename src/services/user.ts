import { User } from '@prisma/client';
import prisma from '../prisma-client';
import { BaseException } from '../errors/api-error';
import httpStatus from 'http-status';
import ERRORS from '../constants/errors';
import { hashPassword } from '../utils/encryption';
import { RegisterDto } from '../dtos/auth';

/**
 * Create a user
 * @param {Object} user create dto
 * @returns {Promise<User>}
 */
const createUser = async (userCreateDto: RegisterDto): Promise<User> => {
  if (await getUserByEmail(userCreateDto.email)) {
    throw new BaseException(httpStatus.BAD_REQUEST, ERRORS.AUTH.EMAIL_EXISTED);
  }
  return prisma.user.create({
    data: {
      ...userCreateDto,
      password: await hashPassword(userCreateDto.password),
    },
  });
};

/**
 * Get a user by id
 * @param {Number} id user id
 * @param {Array<Key>} keys array of keys to select
 * @returns {Promise<Pick<User, Key>> | null}
 */
const getUserById = async <Key extends keyof User>(
  id: number,
  key: Key[] = [
    'id',
    'email',
    'name',
    'password',
    'role',
    'isEmailVerified',
    'createdAt',
    'updatedAt',
  ] as Key[],
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: key.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<User, Key> | null>;
};

/**
 * Get a user by email
 * @param {String} email user email
 * @param {Array<Key>} keys array of keys to select
 * @returns {Promise<Pick<User, Key>> | null}
 */
const getUserByEmail = async <Key extends keyof User>(
  email: string,
  key: Key[] = [
    'id',
    'email',
    'name',
    'password',
    'role',
    'isEmailVerified',
    'createdAt',
    'updatedAt',
  ] as Key[],
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { email },
    select: key.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<User, Key> | null>;
};

export default { createUser, getUserById, getUserByEmail };
