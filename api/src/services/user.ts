import joi from "joi";
import argon from "argon2";
import { prisma } from "./orm";
import { generateJWT } from "./jwt";
import { handleError } from "./types";

import { Request, Response } from "express";

export async function login(req: Request, res: Response) {
  const schema = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
  });

  try {
    const userCredential = await schema.validateAsync(req.body);
    const user = await prisma.user.findFirst({
      where: { email: userCredential.email },
    });
    const message = "email or password are incorrect";
    if (!user) {
      res.status(404).send(message);
      return;
    }
    const isPasswordOk = await argon.verify(
      user.password,
      userCredential.password,
    );
    if (!isPasswordOk) {
      res.status(400).send(message);
      return;
    }

    const token = await generateJWT(user);
    res.status(201).send(token);
  } catch (error) {
    handleError(error, res);
  }
}

export async function register(req: Request, res: Response) {
  const schema = joi.object({
    firstname: joi.string(),
    lastname: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
  });

  try {
    const newUser = await schema.validateAsync(req.body);
    const existingUser = await prisma.user.findFirst({
      where: { email: newUser.email },
    });
    if (existingUser) {
      res.status(409).send("User already exists");
      return;
    }
    const password = await argon.hash(newUser.password);
    await prisma.user.create({
      data: {
        ...newUser,
        password,
      },
    });
    res.status(204);
  } catch (error) {
    handleError(error, res);
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const user = await prisma.user.findFirst({ where: { id: req.params.id } });
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    res.status(200).send({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      id: user.id
    });
  } catch (error) {
    handleError(error, res);
  }
}
