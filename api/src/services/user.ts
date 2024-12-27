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
      res.status(404).send({ message });
      return;
    }
    const isPasswordOk = await argon.verify(
      user.password,
      userCredential.password,
    );
    if (!isPasswordOk) {
      res.status(400).send({ message });
      return;
    }

    const token = await generateJWT(user);
    res.status(200).send({ token });
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
    console.log("Validating schema...");
    const newUser = await schema.validateAsync(req.body);
    console.log("Schema validated:", newUser);

    console.log("Checking existing user...");
    const existingUser = await prisma.user.findFirst({
      where: { email: newUser.email },
    });
    if (existingUser) {
      console.log("User exists");
      res.status(409).send({ message: "User already exists" });
      return;
    }

    console.log("Hashing password...");
    const password = await argon.hash(newUser.password);
    console.log("Password hashed:", password);

    console.log("Creating user...");
    await prisma.user.create({
      data: {
        ...newUser,
        password,
      },
    });
    console.log("User created successfully");
    res.status(201).send({ message: "User created" });
  } catch (error) {
    handleError(error, res);
  }
}
