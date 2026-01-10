import express, { Application } from "express";

const app: Application = express();

// Middlewares
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
  });
});

export default app;
