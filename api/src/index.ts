import cors from "cors";
import express from "express";
import bodyParser from "body-parser";

import {
  editPost,
  likePost,
  draftPost,
  createPost,
  deletePost,
  dislikePost,
  getAllPosts,
  getPostById,
  publishPost,
  getUserPosts,
  upsertFeedback,
  getLikesByPostId,
  getFeedbacksByPostId,
} from "@/services/post";
import { getUserById, login, register } from "@/services/user";

import passport from "passport";
import { prisma } from "@/utils/orm";
import { extractTokenInfo, STRATEGY } from "@/utils/jwt";

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
  .route("/api/post")
  .get(getAllPosts)
  .post(
    [passport.authenticate("jwt", { session: false }), extractTokenInfo], 
    createPost
  );

app
  .route("/api/post/:id")
  .get(getPostById)
  .put(passport.authenticate("jwt", { session: false }), editPost)
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
    upsertFeedback,
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

app.route("/api/user/:id").get(getUserById);
app.route("/api/auth/login").post(login);
app.route("/api/auth/register").post(register);

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
