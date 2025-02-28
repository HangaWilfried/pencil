import type { NextFunction, Request, Response } from "express";

export class ApiError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ValidationException extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedException extends ApiError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenException extends ApiError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class NotFoundException extends ApiError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictException extends ApiError {
  constructor(message: string) {
    super(message, 409);
  }
}

export const ExceptionErrorHandler = (error: Error & {statusCode: number}, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  console.log(`INTERCEPTOR =====  ${statusCode} and ${message}`);

  res.status(statusCode).send(message);
};