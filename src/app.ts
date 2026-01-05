import express from "express";

import messageRoutes from "./routes/analyze.routes.js";
import { apiKeyMiddleware } from "./middlewares/auth.middleware.js"

const app = express();

app.use(express.json());

app.use(apiKeyMiddleware)
app.use("/analyze", messageRoutes);

export default app;
