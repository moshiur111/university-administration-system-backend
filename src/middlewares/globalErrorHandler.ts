import { NextFunction, Request, Response } from "express";

interface ICustomError extends Error {
  statusCode?: number;
}

const globalErrorHandler = (
  err: ICustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default globalErrorHandler;
