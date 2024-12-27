import joi from "joi";
import { prisma } from "./orm";
import { handleError } from "./types";

import { Request, Response } from "express";

export async function getAllPosts(req: Request, res: Response) {
  console.log("request", req);
  try {
    const posts = await prisma.post.findMany();
    res.status(201).send({ posts });
  } catch (error) {
    handleError(error, res);
  }
}

export async function createPost(req: Request, res: Response) {
  const schema = joi.object({
    title: joi.string().required(),
    content: joi.string().required(),
    userId: joi.string().required(),
  });

  try {
    const newPost = await schema.validateAsync(req.body);
    const postEntity = await prisma.post.create({ data: newPost });
    res.status(201).send({ id: postEntity.id });
  } catch (error) {
    handleError(error, res);
  }
}

export async function getPostById(req: Request, res: Response) {
  try {
    const post = await prisma.post.findFirst({ where: { id: req.params.id } });
    if (!post) {
      res.status(404).send({ message: 'Post not found' });
      return;
    }
    res.status(200).send({ post });
  } catch (error) {
    handleError(error, res);
  }
}

export async function editPost(req: Request, res: Response) {
  try {
    const postId = req.params.id;
    const schema = joi.object({
      title: joi.string().required(),
      content: joi.string().required(),
    });
    const newPostData = await schema.validateAsync(req.body);
    const existingPost = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!existingPost) {
      res.status(404).send({ message: 'Post not found' });
      return;
    }
    await prisma.post.update({
      where: { id: postId },
      data: newPostData,
    });
    res.status(201).send({ message: 'Post edited' });
  } catch (error) {
    handleError(error, res);
  }
}
