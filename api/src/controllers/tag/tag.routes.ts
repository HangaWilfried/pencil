import express from "express";
import passport from "passport";

import { extractTokenInfo } from "../../utils/jwt";
import { getPostsByTag } from "../post/post.services";
import {
  createNewTag,
  deleteTag,
  editTag,
  getAllTags,
  getTagById,
} from "./tag.services";
import { TagSchema, validateSchema } from "../../utils/validations";

const router = express.Router();

router
  .route("/")
  .get(getAllTags)
  .post(
    [
      passport.authenticate("jwt", { session: false }),
      validateSchema(TagSchema),
      extractTokenInfo,
    ],
    createNewTag,
  );

router
  .route("/:id")
  .put(
    [
      passport.authenticate("jwt", { session: false }),
      validateSchema(TagSchema),
      extractTokenInfo,
    ],
    editTag,
  )
  .get(passport.authenticate("jwt", { session: false }), getTagById)
  .delete(
    [passport.authenticate("jwt", { session: false }), extractTokenInfo],
    deleteTag,
  );

router.route("/:id/posts").get(getPostsByTag);

export default router;
