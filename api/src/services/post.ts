import joi from "joi";
import { prisma } from "./orm";
import { handleError } from "./types";

import { User } from "@prisma/client";
import { Request, Response } from "express";

export async function getAllPosts(req: Request, res: Response) {
  try {
    const list = await prisma.post.findMany();
    const posts = await Promise.all(list.map(async post => {
      const likes = await countLikesByPost(post.id);
      return {
        ...post,
        likes,
      }
    }));

    res.status(200).json(posts);
  } catch (error) {
    handleError(error, res);
  }
}

export async function createPost(req: Request, res: Response) {
  try {
    const schema = joi.object({
      title: joi.string().required(),
      content: joi.string().required(),
    });
    const newPost = await schema.validateAsync(req.body);
    const userId = (req.user as User).id;

    const postEntity = await prisma.post.create({ 
      data: {
        ...newPost,
        userId
      } 
    });
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
    res.status(204).end();
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
    res.status(200).end();
  } catch (error) {
    handleError(error, res);
  }
}

export async function getUserPosts(req: Request, res: Response) {
  try {
    const user = await prisma.post.findMany({
      where: { userId: (req.user as User).id },
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
      data: { status: "PUBLISH" },
    });
    res.status(204).end();
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
      data: { status: "DRAFT" },
    });
    res.status(204).end();
  } catch (error) {
    handleError(error, res);
  }
}

export async function upsertFeedback(req: Request, res: Response) {
  try {
    const userId = (req.user as User).id;
    const postId = req.params.id;

    const schema = joi.object({
      message: joi.string().required(),
      star: joi.number().optional(),
      id: joi.string().optional(),
    });

    const feedback = await schema.validateAsync(req.body);
    const post = await prisma.post.findFirst({
      where: { id: postId },
    });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    if (feedback.id) {
      await prisma.feedback.update({
        where: { id: feedback.id },
        data: {
          userId,
          postId,
          star: feedback.star,
          message: feedback.message,
        },
      });
      res.status(204).end();
    } else {
      await prisma.feedback.create({
        data: {
          userId,
          postId,
          star: feedback.star,
          message: feedback.message,
        },
      });
      res.status(201).end();
    }
  } catch (error) {
    handleError(error, res);
  }
}

export async function getFeedbacksByPostId(req: Request, res: Response) {
  try {
    const postId = req.params.id;
    const post = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    const feedbacks = await prisma.feedback.findMany({
      where: { postId },
    });
    res.status(200).json(feedbacks);
  } catch (error) {
    handleError(error, res);
  }
}

export async function getPostRate(postId: string): Promise<number> {
  const totalFeedbacks: Array<{ count: number; star: number }> = [];
  await Promise.all(
    [1, 2, 3, 4, 5].map(async (star: number) => {
      const count = await prisma.feedback.count({
        where: {
          postId,
          star,
        },
      });
      totalFeedbacks.push({ star, count });
    }),
  );

  const numerator = totalFeedbacks.reduce((acc, curr) => {
    return acc + curr.count * curr.star;
  }, 0);

  const denominator = totalFeedbacks.reduce((acc, curr) => {
    return acc + curr.count;
  }, 0);

  return numerator / denominator;
}

export async function likePost(req: Request, res: Response) {
  try {
    const userId = (req.user as User).id;
    const postId = req.params.id;

    const post = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
    res.status(201).end();
  } catch (error) {
    handleError(error, res);
  }
}

export async function dislikePost(req: Request, res: Response) {
  try {
    const postId = req.params.id;
    const userId = (req.user as User).id;

    const post = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    await prisma.like.deleteMany({
      where: { userId, postId },
    });
    res.status(201).end();
  } catch (error) {
    handleError(error, res);
  }
}

function countLikesByPost(postId: string): Promise<number> {
  return prisma.like.count({
    where: {
      postId,
    },
  });
}
