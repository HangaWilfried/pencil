import express from "express";
import passport from "passport";
import { getAllUsers, getUserById } from "./user.services";

const router = express.Router();

router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), getAllUsers);

router
  .route("/:id")
  .get(passport.authenticate("jwt", { session: false }), getUserById);

export default router;
