import { PrismaClient } from '@prisma/client';
import envConfig from './configs/env-config';

interface CustomNodeJSGlobal extends Global {
  prisma: PrismaClient;
}

declare const global: CustomNodeJSGlobal;

const prisma = global.prisma || new PrismaClient();

if (envConfig.env === 'development') global.prisma = prisma;

export default prisma;
