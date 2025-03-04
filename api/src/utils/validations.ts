import joi from "joi";
import { Request, Response, NextFunction } from "express";

import { BadRequestException } from "./error";
import Joi from "joi";

export const validateSchema = (schema: joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const subject = error.details.map((d) => d.message);
      return next(
        new BadRequestException(`Validation error ${JSON.stringify(subject)}`),
      );
    }
    next();
  };
};

export const LoginSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});

export const RegisterSchema = joi.object({
  firstname: joi.string(),
  email: joi.string().required(),
  lastname: joi.string().required(),
  password: joi.string().required(),
});

export const TagSchema = joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
});

export const PostSchema = joi.object({
  title: joi.string().required(),
  tags: joi.array().items(joi.string()).required(),
  content: joi.string().required(),
  medias: joi.array().items(joi.string()).optional(),
});

export const FeedbackSchema = joi.object({
  message: joi.string().required(),
  star: joi.number().optional(),
});
