import cors from "cors";
import express from "express";
import bodyParser from 'body-parser';

import { createCycle, getCycleById, getCycles, editCycle } from "./services/cycles";

const PORT= 4500;
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors({
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: "http://localhost:5173",
}))

app.route("/api/cycle")
  .get(getCycles)
  .post(createCycle)

app.route("/api/cycle/:id")
  .get(getCycleById)
  .put(editCycle)


app.listen(PORT, () => {
  console.log(`server start in port http://localhost/${PORT}`);
})