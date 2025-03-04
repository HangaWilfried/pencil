import { User } from "@prisma/client";
import { Request, Response } from "express";

import { prisma } from "../../utils/orm";
import { ForbiddenException, NotFoundException } from "../../utils/error";

export async function getAllPosts(req: Request, res: Response) {
  const list = await prisma.post.findMany();

  const posts = await Promise.all(
    list.map(async (post) => {
      const [likes, feedbacks] = await Promise.all([
        countLikesByPost(post.id),
        countFeedbacksByPost(post.id),
      ]);
      return {
        ...post,
        likes,
        feedbacks,
      };
    }),
  );

  res.status(200).json(posts);
}

export async function getPostsByTag(req: Request, res: Response) {
  const list = await prisma.post.findMany({
    where: {
      tags: {
        has: req.params.tag,
      },
    },
  });

  const posts = await Promise.all(
    list.map(async (post) => {
      const [likes, feedbacks] = await Promise.all([
        countLikesByPost(post.id),
        countFeedbacksByPost(post.id),
      ]);
      return {
        ...post,
        likes,
        feedbacks,
      };
    }),
  );

  res.status(200).json(posts);
}

export async function createPost(req: Request, res: Response) {
  const newPost = req.body;
  const userId = (req.user as User).id;

  const postEntity = await prisma.post.create({
    data: {
      ...newPost,
      userId,
    },
  });

  res.status(201).send(postEntity.id);
}

export async function getPostById(req: Request, res: Response) {
  const post = await prisma.post.findFirst({ where: { id: req.params.id } });

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  const rate = await getPostRate(post.id);

  res.status(200).json({ ...post, rate });
}

export async function editPost(req: Request, res: Response) {
  const updates = req.body;
  const postId = req.params.id;
  const userId = (req.user as User).id;

  const post = await prisma.post.findFirst({
    where: { id: postId },
  });

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  if (post.userId !== userId) {
    throw new ForbiddenException("Not allowed to edit this post");
  }

  await prisma.post.update({
    where: { id: postId },
    data: updates,
  });

  res.status(204).end();
}

export async function deletePost(req: Request, res: Response) {
  const postId = req.params.id;
  const userId = (req.user as User).id;

  const post = await prisma.post.findFirst({ where: { id: postId } });

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  if (post.userId !== userId) {
    throw new ForbiddenException("Not allowed to delete this tag");
  }

  await prisma.post.delete({ where: { id: postId } });

  res.status(200).end();
}

export async function getUserPosts(req: Request, res: Response) {
  const user = await prisma.post.findMany({
    where: { userId: (req.user as User).id },
  });

  if (!user) {
    throw new NotFoundException("User not found");
  }

  res.status(200).json(user);
}

export async function publishPost(req: Request, res: Response) {
  const post = await prisma.post.findFirst({
    where: { id: req.params.id },
  });

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  await prisma.post.update({
    where: { id: req.params.id },
    data: { status: "PUBLISH" },
  });

  res.status(204).end();
}

export async function draftPost(req: Request, res: Response) {
  const post = await prisma.post.findFirst({
    where: { id: req.params.id },
  });

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  await prisma.post.update({
    where: { id: req.params.id },
    data: { status: "DRAFT" },
  });

  res.status(204).end();
}

export async function addFeedback(req: Request, res: Response) {
  const feedback = req.body;
  const postId = req.params.id;
  const userId = (req.user as User).id;

  const post = await prisma.post.findFirst({
    where: { id: postId },
  });

  if (!post) {
    throw new NotFoundException("Post not found");
  }

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

export async function editFeedback(req: Request, res: Response) {
  const updates = req.body;
  const postId = req.params.id;
  const userId = (req.user as User).id;
  const feedbackId = req.params.feedbackId;

  const post = await prisma.post.findFirst({
    where: { id: postId },
  });

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  await prisma.feedback.update({
    where: { id: feedbackId },
    data: {
      userId,
      postId,
      star: updates.star,
      message: updates.message,
    },
  });

  res.status(204).end();
}

export async function getFeedbacksByPostId(req: Request, res: Response) {
  const postId = req.params.id;

  const post = await prisma.post.findFirst({
    where: { id: postId },
  });

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  const feedbacks = await prisma.feedback.findMany({
    where: { postId },
  });

  res.status(200).json(feedbacks);
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
  const userId = (req.user as User).id;
  const postId = req.params.id;

  const post = await prisma.post.findFirst({
    where: { id: postId },
  });

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  await prisma.like.create({
    data: {
      userId,
      postId,
    },
  });

  res.status(201).end();
}

export async function dislikePost(req: Request, res: Response) {
  const postId = req.params.id;
  const userId = (req.user as User).id;

  const post = await prisma.post.findFirst({
    where: { id: postId },
  });

  if (!post) {
    throw new NotFoundException("Post not found");
  }

  await prisma.like.deleteMany({
    where: { userId, postId },
  });

  res.status(201).end();
}

export async function getLikesByPostId(req: Request, res: Response) {
  const postId = req.params.id;

  const post = await prisma.post.findFirst({
    where: { id: postId },
  });

  if (!post) {
    throw new NotFoundException("Post not found");
  }
  const likes = await prisma.like.findMany({
    where: { postId },
  });

  res.status(200).json(likes.map((like) => like.userId));
}

function countLikesByPost(postId: string): Promise<number> {
  return prisma.like.count({
    where: {
      postId,
    },
  });
}

function countFeedbacksByPost(postId: string): Promise<number> {
  return prisma.feedback.count({
    where: { postId },
  });
}
