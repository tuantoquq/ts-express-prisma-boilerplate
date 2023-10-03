export interface IResponse {
  errorCode: number;
  message: string;
  data?: unknown;
}

export interface IError {
  code: number;
  message: string;
}
