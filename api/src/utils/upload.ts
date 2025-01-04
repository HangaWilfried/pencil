import multer from "multer";
import { join } from "path";
import { createReadStream, unlinkSync } from "node:fs";

export const deleteFile = (source?: string) => {
  if (!source) return;
  const file = join(process.cwd(), source);
  unlinkSync(file);
};

export const loadFile = (source: string) => {
  return createReadStream(join(process.cwd(), source));
};

const uuid = (): string => {
  const heap = Date.now().toString(36);
  const tail = Math.random().toString(36).substring(2);
  return heap + tail;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = join(process.cwd(), "media/blobs");
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, uuid());
  },
});

export const upload = multer({ storage });
