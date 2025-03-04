import express from "express";
import passport from "passport";

import { getFileById, createNewFile, deleteFileById } from "./media.services";

import { upload } from "../../utils/upload";

const router = express.Router();

router
  .route("/")
  .post(
    passport.authenticate("jwt", { session: false }),
    upload.single("file"),
    createNewFile,
  );

router
  .route("/:id")
  .get(getFileById)
  .delete(passport.authenticate("jwt", { session: false }), deleteFileById);

export default router;
