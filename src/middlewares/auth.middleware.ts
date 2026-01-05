// src/middleware/apiKey.middleware.ts
import type { Request, Response, NextFunction } from "express";
import type { ApiError } from "../types/api-error.type.js"

export const apiKeyMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const apiKey = req.header("x-api-key");
  const expectedKey = process.env.API_KEY;

  if (!expectedKey) {
    const err = new Error("API key not configured") as ApiError;
    err.statusCode = 500;
    return next(err);
  }

  if (!apiKey || apiKey !== expectedKey) {
    const err = new Error("Forbidden: invalid API key") as ApiError;
    err.statusCode = 403;
    return next(err);
  }

  next();
};
