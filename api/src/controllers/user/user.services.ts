import { Request, Response } from "express";

import { prisma } from "../../utils/orm";
import { NotFoundException } from "../../utils/error";

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
