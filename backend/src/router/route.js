import express from "express";
import FoodModel from "../model/model.js";
import addressToPos from "../util/position.js";

const router = express.Router();

router.use(express.json());

router.delete("deletebyid", async (req, res) => {
})

router.get("/getall", async (req, res) => {
  try {
    const data = await FoodModel.find();
    res.send(data);
    return;
  } catch (e) {
    console.log(e);
  }
});

router.get("/getbyuserid", async (req, res) => {
  const userid = req.body.userid;
  try {
    const data = await FoodModel.find({ userid: userid });
    res.send(data);
  } catch(e){
    console.log(e);
  }
});

router.post("/insertfood", async (req, res) => {
  const food = req.body;
  const newFood = new FoodModel(food);
  if(food.lat === undefined || food.lng === undefined){
    const pos = addressToPos(food.address);
    food.lat = pos.lat;
    food.lng = pos.lng;
  }try {
    await newFood.save();
    res.send("success");
  } catch (e) {
    console.log(e);
  }
});

export default router;
