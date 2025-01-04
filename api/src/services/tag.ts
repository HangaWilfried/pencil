import { Request, Response } from "express";
import Joi from "joi";

import { handleError } from "../utils/types";
import { prisma } from "../utils/orm";
import { User } from "@prisma/client";

export async function createNewTag(req: Request, res: Response) {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
  });

  try {
    const userId = (req.user as User).id;
    const tag = await schema.validateAsync(req.body);

    await prisma.tag.create({
      data: {
        ...tag,
        userId,
      },
    });
    res.status(201).end();
  } catch (error) {
    handleError(error, res);
  }
}

export async function getAllTags(req: Request, res: Response) {
  try {
    const tags = await prisma.tag.findMany();
    res.status(200).json(tags);
  } catch (error) {
    handleError(error, res);
  }
}

export async function getTagById(req: Request, res: Response) {
  try {
    const tag = await prisma.tag.findFirst({ where: { id: req.params.id } });

    if (!tag) {
      res.status(404).json({ message: "No Tag found" });
      return;
    }

    res.status(200).json(tag);
  } catch (error) {
    handleError(error, res);
  }
}

export async function editTag(req: Request, res: Response) {
  try {
    const tagId = req.params.id;
    const userId = (req.user as User).id;

    const schema = Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
    });

    const [updates, tag] = await Promise.all([
      schema.validateAsync(req.body),
      prisma.tag.findFirst({ where: { id: tagId } }),
    ]);

    if (!tag) {
      res.status(404).json({ message: "No Tag found" });
      return;
    }

    if (tag.userId !== userId) {
      res.status(403).json({ message: "Not allowed to edit this tag" });
      return;
    }

    await prisma.tag.update({
      where: { id: tagId },
      data: updates,
    });
    res.status(204).end();
  } catch (error) {
    handleError(error, res);
  }
}

export async function deleteTag(req: Request, res: Response) {
  try {
    const tagId = req.params.id;
    const userId = (req.user as User).id;

    const tag = await prisma.tag.findFirst({ where: { id: tagId } });

    if (!tag) {
      res.status(404).json({ message: "No Tag found" });
      return;
    }

    if (tag.userId !== userId) {
      res.status(403).json({ message: "Not allowed to delete this tag" });
      return;
    }

    await prisma.tag.delete({ where: { id: tagId } });
    res.status(200).end();
  } catch (error) {
    handleError(error, res);
  }
}
