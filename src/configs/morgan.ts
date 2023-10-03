import { Response } from 'express';
import morgan from 'morgan';
import envConfig from './env-config';
import logger from './logger';

morgan.token('message', (req, res: Response) => res.locals.errorMessage || '');

const getIPFormat = () => (envConfig.env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIPFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIPFormat()}:method :url :status - :response-time ms - message: :message`;

export const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});
export const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

export default {
  successHandler,
  errorHandler,
};
