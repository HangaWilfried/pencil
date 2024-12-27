import { Response } from "express";

type Failure = { message: string; statusCode: number };

export const handleError = (error: unknown, res: Response) => {
  console.log("ERROR", error);

  const { message, statusCode } = error as Failure;
  return res.status(statusCode ?? 400).send({ message });
};
