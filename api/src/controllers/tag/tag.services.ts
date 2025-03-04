import { User } from "@prisma/client";
import type { Request, Response } from "express";

import { prisma } from "../../utils/orm";
import { ForbiddenException, NotFoundException } from "../../utils/error";

export async function createNewTag(req: Request, res: Response) {
  const tag = req.body;
  const userId = (req.user as User).id;

  await prisma.tag.create({
    data: {
      ...tag,
      userId,
    },
  });

  res.status(201).end();
}

export async function getAllTags(req: Request, res: Response) {
  const tags = await prisma.tag.findMany();

  res.status(200).json(tags);
}

export async function getTagById(req: Request, res: Response) {
  const tag = await prisma.tag.findFirst({ where: { id: req.params.id } });

  if (!tag) {
    throw new NotFoundException("No Tag found");
  }

  res.status(200).json(tag);
}

export async function editTag(req: Request, res: Response) {
  const updates = req.body;
  const tagId = req.params.id;
  const userId = (req.user as User).id;

  const tag = await prisma.tag.findFirst({ where: { id: tagId } });

  if (!tag) {
    throw new NotFoundException("No Tag found");
  }

  if (tag.userId !== userId) {
    throw new ForbiddenException("Not allowed to edit this tag");
  }

  await prisma.tag.update({
    where: { id: tagId },
    data: updates,
  });

  res.status(204).end();
}

export async function deleteTag(req: Request, res: Response) {
  const tagId = req.params.id;
  const userId = (req.user as User).id;

  const tag = await prisma.tag.findFirst({ where: { id: tagId } });

  if (!tag) {
    throw new NotFoundException("No Tag found");
  }

  if (tag.userId !== userId) {
    throw new ForbiddenException("Not allowed to delete this tag");
  }

  await prisma.tag.delete({ where: { id: tagId } });

  res.status(200).end();
}
