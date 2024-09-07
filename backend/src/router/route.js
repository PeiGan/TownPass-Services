import express from "express";
import FoodModel from "../model/model.js";

const router = express.Router();

router.use(express.json());

router.get("/getall", async (req, res) => {
  try{
    const data = await FoodModel.find();
    res.send(data);
    return;
  } catch(e){
    console.log(e);
  }
});

router.get("/getbyuser", (req, res) => {
  const user = req.body.user;
  return getByUser(user);
});

router.post("/insertfood", async (req, res) => {
  const food = req.body;
  const newFood = new FoodModel(food);
  try{
    await newFood.save();
    res.send("success");
  }catch(e){
    console.log(e);
  }
});

async function getByUser(user) {
  const data = await FoodModel.find({ provider: user });
  try {
    return data;
  }
  catch (e) {
    console.log("error: " + e);
  }
}

export default router;
