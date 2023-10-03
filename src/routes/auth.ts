import express from 'express';
import { authController } from '../controllers';
import validate from '../middlewares/validate';
import { login, register } from '../validations/auth';

const router = express.Router();

router.post('/register', validate(register), authController.registerUser);
router.post('/login', validate(login), authController.loginUser);
export default router;
