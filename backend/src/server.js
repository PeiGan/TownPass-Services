import express from "express";
import mongoose from "mongoose";
import router from "./router/route.js";

mongoose.connect(
  "mongodb+srv://agree:teamagree@foodmap.t0ifj.mongodb.net/?retryWrites=true&w=majority&appName=FoodMap",
)
.then(() => {
    console.log("successfully connected");
  })
.catch((e) => {
    console.log(e);
  });

const db = mongoose.connection;
const PORT = 3000;
const app = express();

db.once("open", () => {
  app.use("/", router);
  app.listen(PORT, () => {
    console.log("connected");
  });
});

db.on("error", (error) => {
  console.log(error);
})
