import express from "express";

import messageRoutes from "./routes/analyze.routes.js";


const app = express();

app.use(express.json());
app.use("/analyze", messageRoutes);

export default app;