import cors from "cors";
import express from "express";
import passport from "passport";
import bodyParser from "body-parser";

import { prisma } from "./utils/orm";
import { STRATEGY } from "./utils/jwt";
import { ErrorHandler } from "./utils/error";
import { createTmpFolder } from "./utils/upload";
import { LoggerMiddleware } from "./utils/middleware";

import tagRoutes from "./controllers/tag/tag.routes";
import userRoutes from "./controllers/user/user.routes";
import authRoutes from "./controllers/auth/auth.routes";
import postRoutes from "./controllers/post/post.routes";
import mediaRoutes from "./controllers/media/media.routes";

const PORT = 4500;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(LoggerMiddleware);

app.use(passport.use(STRATEGY).initialize());

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "*",
  }),
);

app.use("/api/tag", tagRoutes);
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);

app.use(ErrorHandler);

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    createTmpFolder();
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
