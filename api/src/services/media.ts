import { Request, Response } from "express";
import path from "node:path";

import { deleteFile, loadFile } from "../utils/upload";
import { handleError } from "../utils/types";
import { prisma } from "../utils/orm";

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
      handleError(error, res);
    }
  } else {
    res.status(400).json({ message: "Bad request" });
  }
}

export async function getFileById(req: Request, res: Response) {
  try {
    const fileId = req.params.id;
    const file = await prisma.media.findFirst({
      where: { id: fileId },
    });
    if (!file) {
      res.status(404).json({ message: "No file found" });
      return;
    }
    const fileStream = loadFile(file.source);

    res.setHeader("Content-Length", file.size);
    res.setHeader("Content-Type", getMimeType(file.ext));
    res.setHeader("Content-Disposition", `attachment; filename=${file.name}`);

    fileStream.pipe(res);
  } catch (error) {
    handleError(error, res);
  }
}

export async function deleteFileById(req: Request, res: Response) {
  const fileId = req.params.id;
  try {
    const file = await prisma.media.findFirst({
      where: { id: fileId },
    });

    if (!file) {
      res.status(404).json({ message: "No file found" });
      return;
    }

    await prisma.media.delete({ where: { id: fileId } });
    deleteFile(file.source);

    res.status(200).end();
  } catch (error) {
    handleError(error, res);
  }
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
