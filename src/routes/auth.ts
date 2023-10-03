import express from 'express';
import { authController } from '../controllers';
import validate from '../middlewares/validate';
import {
  confirmResetPassword,
  confirmVerificationEmail,
  forgotPassword,
  login,
  register,
} from '../validations/auth';
import roles from '../middlewares/roles';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/register', validate(register), authController.registerUser);
router.post('/login', validate(login), authController.loginUser);
router.post('/forgot-password', validate(forgotPassword), authController.forgotPassword);
router.post(
  '/confirm-reset-password',
  validate(confirmResetPassword),
  authController.confirmResetPassword,
);
router.post(
  '/send-verification-email',
  roles(Role.USER, Role.ADMIN),
  authController.sendVerificationEmail,
);
router.post(
  '/confirm-verification-email',
  validate(confirmVerificationEmail),
  authController.confirmVerifyEmail,
);
export default router;
