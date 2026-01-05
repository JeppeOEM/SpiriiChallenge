export type ApiError = Error & {
  statusCode: number;
  errors?: string[];
};
