import { 
  createReadStream, 
  unlinkSync, 
  existsSync, 
  mkdirSync 
} from "node:fs";
import { join } from "path";
import multer from "multer";

export const deleteFile = (source?: string) => {
  if (!source) return;
  const file = join(process.cwd(), source);
  unlinkSync(file);
};

export const createTmpFolder = () => {
  const folderName = process.cwd() + '/media/blobs';
  try {
    if(existsSync(folderName)) console.log(folderName + " already exists");
    else mkdirSync(folderName);
  } catch (error) {
    console.error(error);
  }
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
