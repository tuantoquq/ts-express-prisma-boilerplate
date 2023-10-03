import express from 'express';
import { healthCheckController } from '../controllers';

const router = express.Router();

router.get('/health-check', healthCheckController.healthCheck);

export default router;
