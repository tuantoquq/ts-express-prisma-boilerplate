import express from 'express';
import healthCheckRoute from './health-check';
import authRoute from './auth';
import userRoute from './user';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: healthCheckRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
