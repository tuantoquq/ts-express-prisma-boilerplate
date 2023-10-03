import { TokenType } from '@prisma/client';
import { Moment } from 'moment';

interface BaseTokenDto {
  userId: number;
  expires: Moment;
  type: TokenType;
}

export interface GenerateTokenDto extends BaseTokenDto {
  secret: string;
}

export interface SaveTokenDto extends BaseTokenDto {
  token: string;
}
