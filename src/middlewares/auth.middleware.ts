import type { Request, Response, NextFunction } from "express";
import type { ApiError } from "../types/api-error.type.js";

export const apiKeyMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const apiKey = req.header("x-api-key");
  const expectedKey = process.env.API_KEY;

  // 1️⃣ Server misconfiguration
  if (!expectedKey) {
    const message = "API key not configured for the server";
    const err: ApiError = new Error(message) as ApiError;
    err.statusCode = 500;
    err.errors = [message]; // message matches detailed error
    return next(err);
  }

  // 2️⃣ No API key provided
  if (!apiKey) {
    const message = "API key not provided in request header";
    const err: ApiError = new Error(message) as ApiError;
    err.statusCode = 403;
    err.errors = [message]; // same message in errors array
    return next(err);
  }

  // 3️⃣ API key provided but incorrect
  if (apiKey !== expectedKey) {
    const message = "API key does not match expected value";
    const err: ApiError = new Error(message) as ApiError;
    err.statusCode = 403;
    err.errors = [message]; // same message in errors array
    return next(err);
  }

  // 4️⃣ Valid API key
  next();
};
