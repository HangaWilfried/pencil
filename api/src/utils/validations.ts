import Joi from "joi";
import { Request, Response, NextFunction } from "express";

import { ValidationException } from "./errors";
import joi from "joi";

export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return next(new ValidationException("Validation error"));
    }

    next();
  };
};

export const addFeedbackSchema = joi.object({
  message: joi.string().required(),
  star: joi.number().optional(),
});

export const editFeedbackSchema = joi.object({
  message: joi.string().optional(),
  star: joi.number().optional(),
  id: joi.string().required(),
});

export const postSchema = joi.object({
  title: joi.string().required(),
  tags: joi.array().items(joi.string()).required(),
  content: joi.string().required(),
  medias: joi.array().items(joi.string()).optional(),
});

export const LoginSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});

export const RegisterSchema = joi.object({
  firstname: joi.string(),
  lastname: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().required(),
});

export const tagSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
});