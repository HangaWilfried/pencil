import cors from "cors";
import express from "express";
import bodyParser from 'body-parser';

import { getAllPosts, createPost, editPost, getPostById } from "./services/blog";

const PORT= 4500;
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors({
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: "http://localhost:5173",
}))

app.route("/api/blog")
  .get(getAllPosts)
  .post(createPost)

app.route("/api/blog/:id")
  .get(getPostById)
  .put(editPost)


app.listen(PORT, () => {
  console.log(`server start in port http://localhost/${PORT}`);
})