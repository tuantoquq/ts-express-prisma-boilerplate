import express from 'express';
import cors from 'cors';
import morgan from './configs/morgan';
import router from './routes';
import { errorHandler } from './middlewares/error';
import helmet from 'helmet';
import passport from 'passport';
import { jwtStrategy } from './configs/passport';

const app = express();

/* Cors */
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

/* Parse json request body */
app.use(express.json());

/* Set security HTTP headers */
app.use(helmet());

/* Parse urlencoded request body */
app.use(express.urlencoded({ extended: true }));

/* Morgan */
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

/* Base API path */
app.use('/api/v1', router);

/* Handle error */
app.use(errorHandler);

export default app;
