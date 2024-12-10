import { Response } from "express";

export interface CustomError extends Error {
  statusCode: number;
}

export function createError(
  message: string,
  statusCode: number = 500
): CustomError {
  const error = new Error(message) as CustomError;
  error.statusCode = statusCode;
  return error;
}

export function handleError(error: unknown, res: Response) {
  if (isCustomError(error)) {
    res.status(error.statusCode).json({ error: error.message });
  } else if (error instanceof Error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "An unexpected error occurred" });
  } else {
    console.error(error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
}

function isCustomError(error: unknown): error is CustomError {
  return error instanceof Error && "statusCode" in error;
}

export const badRequest = (message: string) => createError(message, 400);
export const notFound = (message: string) => createError(message, 404);
export const internal = (message: string = "An unexpected error occurred") =>
  createError(message, 500);
