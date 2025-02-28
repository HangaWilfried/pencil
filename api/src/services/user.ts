import argon from "argon2";
import { Request, Response } from "express";

import { prisma } from "../utils/orm";
import { generateJWT } from "../utils/jwt";
import { ConflictException, NotFoundException } from "../utils/errors";

export async function login(req: Request, res: Response) {
  const userCredential = req.body;
  const user = await prisma.user.findFirst({
    where: { email: userCredential.email },
  });

  if (!user) {
    throw new NotFoundException("email or password is incorrect")
  }

  const isPasswordOk = await argon.verify(
    user.password,
    userCredential.password,
  );

  if (!isPasswordOk) {
    throw new NotFoundException("email or password is incorrect")
  }

  const token = await generateJWT(user);
  res.status(201).send(token);
}

export async function register(req: Request, res: Response) {
  const newUser = req.body;
  const existingUser = await prisma.user.findFirst({
    where: { email: newUser.email },
  });
  if (existingUser) {
    throw new ConflictException("User already exists");
  }

  const password = await argon.hash(newUser.password);

  await prisma.user.create({
    data: {
      ...newUser,
      password,
    },
  });

  res.status(204).end();
}

export async function getAllUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany();

  res.status(200).json(
    users.map((user) => {
      return {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        id: user.id,
      };
    }),
  );
}

export async function getUserById(req: Request, res: Response) {
  const user = await prisma.user.findFirst({ where: { id: req.params.id } });

  if (!user) {
    throw new NotFoundException("User not found");
  }

  res.status(200).json({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    id: user.id,
  });
}
