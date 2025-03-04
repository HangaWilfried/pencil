import type { Request, Response, NextFunction } from "express";

export class BadRequestException extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

export class DuplicateException extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
}

export class NotFoundException extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export class UnauthorizedException extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export class ForbiddenException extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}

export function ErrorHandler(
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).send(err.message);
}
