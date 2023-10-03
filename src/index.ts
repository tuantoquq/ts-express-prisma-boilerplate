import { Server } from 'http';
import app from './app';
import envConfig from './configs/env-config';
import logger from './configs/logger';
import prisma from './prisma-client';

let server: Server;

prisma.$connect().then(() => {
  logger.log('info', 'Database connected!');
  server = app.listen(envConfig.port, () => {
    logger.log('info', `Server started on port ${envConfig.port} (${envConfig.env})`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.log('info', 'Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.log('error', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
