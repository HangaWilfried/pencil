import joi from "joi";
import { prisma } from "./orm";
import { handleError } from "./types";

import { Request, Response } from "express";

export async function getAllPosts(req: Request, res: Response) {
  console.log("request", req);
  try {
    const posts = await prisma.post.findMany();
    res.status(200).json(posts);
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
    res.status(201).send(postEntity.id);
  } catch (error) {
    handleError(error, res);
  }
}

export async function getPostById(req: Request, res: Response) {
  try {
    const post = await prisma.post.findFirst({ where: { id: req.params.id } });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    const rate = await getPostRate(post.id);
    res.status(200).json({
      ...post,
      rate,
    });
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
      res.status(404).json({ message: "Post not found" });
      return;
    }
    await prisma.post.update({
      where: { id: postId },
      data: newPostData,
    });
    res.status(204);
  } catch (error) {
    handleError(error, res);
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const post = await prisma.post.findFirst({ where: { id: req.params.id } });
    if (!post) {
      res.status(404).send({ message: "Post not found" });
      return;
    }
    await prisma.post.delete({
      where: { id: post.id },
    });
    res.status(200);
  } catch (error) {
    handleError(error, res);
  }
}

export async function getUserPosts(req: Request, res: Response) {
  try {
    const user = await prisma.post.findMany({
      where: { userId: req.params.userId },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    handleError(error, res);
  }
}

export async function publishPost(req: Request, res: Response) {
  try {
    const post = await prisma.post.findFirst({
      where: { id: req.params.id },
    });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    await prisma.post.update({
      where: { id: req.params.id },
      data: { status: "PUBLISH" }
    })
    res.status(201);
  } catch (error) {
    handleError(error, res);
  }
}

export async function draftPost(req: Request, res: Response) {
  try {
    const post = await prisma.post.findFirst({
      where: { id: req.params.id },
    });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    await prisma.post.update({
      where: { id: req.params.id },
      data: { status: "DRAFT" }
    })
    res.status(201);
  } catch (error) {
    handleError(error, res);
  }
}

export async function upsertFeedback(req: Request, res: Response) {
  const postId = req.params.id;

  const schema = joi.object({
    message: joi.string().required(),
    userId: joi.string().required(),
    star: joi.number().optional(),
    id: joi.string().optional(),
  });

  try {
    const feedback = await schema.validateAsync(req.body);
    const post = await prisma.post.findFirst({
      where: { id: postId },
    });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    if(feedback.id) {
      await prisma.feedback.update({
        where: { id: feedback.id },
        data: {
          postId: postId,
          star: feedback.star,
          userId: feedback.userId,
          message: feedback.message,
        }
      });
      res.status(201).json({ message: "feedback updated" });
    } else {
      await prisma.feedback.create({
        data: {
          postId: postId,
          star: feedback.star,
          userId: feedback.userId,
          message: feedback.message,
        }
      });
      res.status(201).json({ message: "feedback created" });
    }
  } catch (error) {
    handleError(error, res);
  }
}

export async function getFeedbacksByPostId(req: Request, res: Response) {
  const postId = req.params.id;
  const post = await prisma.post.findFirst({
    where: { id: postId },
  });

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { postId }
    });
    res.status(200).json(feedbacks);
  } catch (error) {
    handleError(error, res);
  }
}

export async function getPostRate(postId: string): Promise<number> {
  const totalFeedbacks: Array<{count: number; star: number}> = [];
  await Promise.all([1, 2, 3, 4, 5].map(async (star: number) => {
    const count = await prisma.feedback.count({
      where: {
        postId,
        star
      },
    });
    totalFeedbacks.push({ star, count });
  }));

  const numerator = totalFeedbacks.reduce((acc, curr) => {
    return acc + (curr.count * curr.star);
  }, 0);

  const denominator = totalFeedbacks.reduce((acc, curr) => {
    return acc + curr.count;
  }, 0);

  return numerator/denominator;
}
