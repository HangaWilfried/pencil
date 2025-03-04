import passport from "passport";
import express from "express";

import {
  addFeedback,
  createPost,
  deletePost,
  dislikePost,
  draftPost,
  editFeedback,
  editPost,
  getAllPosts,
  getFeedbacksByPostId,
  getLikesByPostId,
  getPostById,
  getUserPosts,
  likePost,
  publishPost,
} from "./post.services";

import { extractTokenInfo } from "../../utils/jwt";
import {
  FeedbackSchema,
  PostSchema,
  validateSchema,
} from "../../utils/validations";

const router = express.Router();

router
  .route("/")
  .get(getAllPosts)
  .post(
    [
      passport.authenticate("jwt", { session: false }),
      validateSchema(PostSchema),
      extractTokenInfo,
    ],
    createPost,
  );

router
  .route("/:id")
  .get(getPostById)
  .put(
    [
      passport.authenticate("jwt", { session: false }),
      validateSchema(PostSchema),
      extractTokenInfo,
    ],
    editPost,
  )
  .delete(passport.authenticate("jwt", { session: false }), deletePost);

router
  .route("/:id/like")
  .get(getLikesByPostId)
  .put(
    [passport.authenticate("jwt", { session: false }), extractTokenInfo],
    likePost,
  )
  .delete(
    [passport.authenticate("jwt", { session: false }), extractTokenInfo],
    dislikePost,
  );

router
  .route("/:id/feedback")
  .get(getFeedbacksByPostId)
  .post(
    [
      passport.authenticate("jwt", { session: false }),
      validateSchema(FeedbackSchema),
      extractTokenInfo,
    ],
    addFeedback,
  );

router
  .route("/:id/feedback/:feedbackId")
  .put(
    [
      passport.authenticate("jwt", { session: false }),
      validateSchema(FeedbackSchema),
      extractTokenInfo,
    ],
    editFeedback,
  );

router
  .route("/:id/draft")
  .put(passport.authenticate("jwt", { session: false }), draftPost);

router
  .route("/:id/publish")
  .put(passport.authenticate("jwt", { session: false }), publishPost);

router
  .route("/my-posts")
  .get(
    [passport.authenticate("jwt", { session: false }), extractTokenInfo],
    getUserPosts,
  );

export default router;
