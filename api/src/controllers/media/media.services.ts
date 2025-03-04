import path from "node:path";
import type { Request, Response } from "express";

import { prisma } from "../../utils/orm";
import { deleteFile, loadFile } from "../../utils/upload";
import { BadRequestException, NotFoundException } from "../../utils/error";

export async function createNewFile(req: Request, res: Response) {
  const file = req.file;
  if (file) {
    try {
      const { id } = await prisma.media.create({
        data: {
          ext: path.extname(file.originalname),
          source: `media/blobs/${file.filename}`,
          name: file.originalname,
          size: file.size,
        },
      });
      res.status(201).json(id);
    } catch (error) {
      deleteFile(file.filename);
      throw error;
    }
  } else {
    throw new BadRequestException("No file has been provided");
  }
}

export async function getFileById(req: Request, res: Response) {
  const file = await prisma.media.findFirst({
    where: { id: req.params.id },
  });

  if (!file) {
    throw new NotFoundException("No file found");
  }

  const fileStream = loadFile(file.source);

  res.setHeader("Content-Length", file.size);
  res.setHeader("Content-Type", getMimeType(file.ext));
  res.setHeader("Content-Disposition", `attachment; filename=${file.name}`);

  fileStream.pipe(res);
}

export async function deleteFileById(req: Request, res: Response) {
  const fileId = req.params.id;
  const file = await prisma.media.findFirst({ where: { id: fileId } });

  if (!file) {
    throw new NotFoundException("No file found");
  }

  await prisma.media.delete({ where: { id: fileId } });
  deleteFile(file.source);

  res.status(200).end();
}

function getMimeType(ext: string) {
  const mimeTypes = {
    ".txt": "text/plain",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".pdf": "application/pdf",
    ".json": "application/json",
    ".html": "text/html",
  };
  return mimeTypes[ext as keyof typeof mimeTypes] || "application/octet-stream";
}
