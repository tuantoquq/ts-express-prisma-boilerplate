import { TokenType } from '@prisma/client';

export interface TokenResponse {
  token: string;
  expires: Date;
}
export interface AuthTokenResponse {
  accessToken: TokenResponse;
  refreshToken: TokenResponse;
}

export interface IJwtPayload {
  sub: number;
  iat: number;
  exp: number;
  type: TokenType;
}
