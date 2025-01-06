import cors from "cors";
import express from "express";
import passport from "passport";
import bodyParser from "body-parser";

import { extractTokenInfo, STRATEGY } from "./utils/jwt";
import { upload } from "./utils/upload";
import { prisma } from "./utils/orm";

import {
  getFeedbacksByPostId,
  getLikesByPostId,
  editFeedback,
  getUserPosts,
  addFeedback,
  getAllPosts,
  publishPost,
  getPostById,
  dislikePost,
  deletePost,
  createPost,
  draftPost,
  editPost,
  likePost, getPostsByTag,
} from "./services/post";
import { createNewFile, deleteFileById, getFileById } from "./services/media";
import { getAllUsers, getUserById, login, register } from "./services/user";
import {
  createNewTag,
  deleteTag,
  editTag,
  getAllTags,
  getTagById,
} from "./services/tag";

const PORT = 4500;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.use(STRATEGY).initialize());
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "*",
  }),
);

app
  .route("/api/tag")
  .get(passport.authenticate("jwt", { session: false }), getAllTags)
  .post(
    [passport.authenticate("jwt", { session: false }), extractTokenInfo],
    createNewTag,
  );

app
  .route("/api/tag/:id")
  .put(
    [passport.authenticate("jwt", { session: false }), extractTokenInfo],
    editTag,
  )
  .get(passport.authenticate("jwt", { session: false }), getTagById)
  .delete(
    [passport.authenticate("jwt", { session: false }), extractTokenInfo],
    deleteTag,
  );

app
  .route("/api/post")
  .get(getAllPosts)
  .post(
    [passport.authenticate("jwt", { session: false }), extractTokenInfo],
    createPost,
  );

app
    .route("/api/:tag/post")
    .get(getPostsByTag)

app
  .route("/api/post/:id")
  .get(getPostById)
  .put(
    [passport.authenticate("jwt", { session: false }), extractTokenInfo],
    editPost,
  )
  .delete(passport.authenticate("jwt", { session: false }), deletePost);

app
  .route("/api/post/:id/like")
  .get(getLikesByPostId)
  .put(
    [passport.authenticate("jwt", { session: false }), extractTokenInfo],
    likePost,
  )
  .delete(
    [passport.authenticate("jwt", { session: false }), extractTokenInfo],
    dislikePost,
  );

app
  .route("/api/post/:id/feedback")
  .get(getFeedbacksByPostId)
  .post(
    [passport.authenticate("jwt", { session: false }), extractTokenInfo],
    addFeedback,
  )
  .put(
    [passport.authenticate("jwt", { session: false }), extractTokenInfo],
    editFeedback,
  );

app
  .route("/api/post/:id/draft")
  .put(passport.authenticate("jwt", { session: false }), draftPost);

app
  .route("/api/post/:id/publish")
  .put(passport.authenticate("jwt", { session: false }), publishPost);

app
  .route("/api/my-posts")
  .get(
    [passport.authenticate("jwt", { session: false }), extractTokenInfo],
    getUserPosts,
  );

app
  .route("/api/user")
  .get(passport.authenticate("jwt", { session: false }), getAllUsers);
app.route("/api/user/:id").get(getUserById);

app.route("/api/auth/login").post(login);
app.route("/api/auth/register").post(register);

app
  .route("/api/media")
  .post(
    passport.authenticate("jwt", { session: false }),
    upload.single("file"),
    createNewFile,
  );

app
  .route("/api/media/:id")
  .get(getFileById)
  .delete(passport.authenticate("jwt", { session: false }), deleteFileById);

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`✅ Server started at http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
});

const gracefulShutdown = async () => {
  console.log("\n🛑 Gracefully shutting down...");
  try {
    await prisma.$disconnect();
    console.log("✅ Database disconnected");
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});
