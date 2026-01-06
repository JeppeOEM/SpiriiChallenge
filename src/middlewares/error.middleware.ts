import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../types/api-error.type.js"

/*
Middleware factory pattern

(err, req, res, next)
error-handling middleware has 4 , normal middleware 3 params
*/

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction // underscore signals human and linters function is unsused
) => {
  const error = err as ApiError;

  const statusCode = error.statusCode ?? 500;
  const message = error.message || "Internal Server Error";

  console.error(err);

  res.status(statusCode).json({
    message,
    ...(error.errors && { errors: error.errors })
  });
};
