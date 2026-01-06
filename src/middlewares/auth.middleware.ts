import type { Request, Response, NextFunction } from "express";
import type { ApiError } from "../types/api-error.type.js";

export const apiKeyMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const apiKey = req.header("x-api-key");
  const expectedKey = process.env.API_KEY;

  if (!expectedKey) {
    const message = "API key not configured for the server";
    const err: ApiError = new Error(message) as ApiError;
    err.statusCode = 500;
    err.errors = [message];
    return next(err);
  }

  if (!apiKey) {
    const message = "API key not provided in request header";
    const err: ApiError = new Error(message) as ApiError;
    err.statusCode = 403;
    err.errors = [message];
    return next(err);
  }

  if (apiKey !== expectedKey) {
    const message = "API key does not match expected value";
    const err: ApiError = new Error(message) as ApiError;
    err.statusCode = 403;
    err.errors = [message];
    return next(err);
  }

  next();
};
