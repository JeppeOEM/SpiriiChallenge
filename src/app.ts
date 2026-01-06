import express from "express";
import messageRoutes from "./routes/analyze.routes.js";
import { apiKeyMiddleware } from "./middlewares/auth.middleware.js"
import { errorHandler } from "./middlewares/error.middleware.js";
import { ApiError } from "./types/api-error.type.js";

const app = express();

app.use(express.json());

app.use(apiKeyMiddleware)
app.use("/analyze", messageRoutes);

app.get("/test-error", (_req, _res, next) => {
  const message = "Test error triggered manually";
  const err: ApiError = new Error(message) as ApiError;
  err.statusCode = 400;
  err.errors = [message, "Additional detail for testing"];
  next(err); // pass to general error handler
});

app.get("/test-success", (_req, res) => {
  res.json({ message: "Success! API key validated." });
});

app.use(errorHandler)

export default app;
