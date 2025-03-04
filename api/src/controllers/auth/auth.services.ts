import argon from "argon2";
import { Request, Response } from "express";

import { prisma } from "../../utils/orm";
import { generateJWT } from "../../utils/jwt";
import { DuplicateException, NotFoundException } from "../../utils/error";

export async function login(req: Request, res: Response) {
  const userCredential = req.body;

  const user = await prisma.user.findUnique({
    where: { email: userCredential.email },
  });

  if (!user) {
    throw new NotFoundException("email or password are incorrect");
  }

  const isPasswordOk = await argon.verify(
    user.password,
    userCredential.password,
  );

  if (!isPasswordOk) {
    throw new NotFoundException("email or password are incorrect");
  }

  const token = await generateJWT(user);

  res.status(201).send(token);
}

export async function register(req: Request, res: Response) {
  const newUser = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email: newUser.email },
  });

  if (existingUser) {
    throw new DuplicateException("User already exists");
  }

  const password = await argon.hash(newUser.password);

  await prisma.user.create({ data: { ...newUser, password } });

  res.status(204).end();
}
