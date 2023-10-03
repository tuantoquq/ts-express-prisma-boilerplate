import express from 'express';
import { userController } from '../controllers';
import roles from '../middlewares/roles';
import { Role } from '@prisma/client';

const router = express.Router();

router.get('/profile', roles(Role.USER), userController.getProfile);
export default router;
