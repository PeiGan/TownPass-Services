import express from "express";
import FoodModel from "../model/model.js";
import addressToPos from "../util/position.js";

const router = express.Router();

router.use(express.json());

router.get('/endbyid', async (req, res) => {
  const _id = req.query._id;
  // console.log("fuck");
  console.log("_id: " + _id);
  try {
    await FoodModel.updateOne({ _id: _id }, { $set: { ended: true } });
    res.send("success");
  } catch (e) {
    console.log(e);
  }
});

router.post("/deletebyid", async (req, res) => {
  const _id = req.body._id;
  console.log(req.body);
  console.log("fuck");
  console.log("_id: " + _id);
  try{
    await FoodModel.deleteOne({
      _id: _id,
    })
    res.send("success");
  } catch(e){
    console.log(e);
  }
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

router.post("/getbyuserid", async (req, res) => {
  const userid = req.body.userid;
  console.log(userid);
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
    const pos = await addressToPos(food.address);
    console.log(pos);
    newFood.lat = pos.lat;
    newFood.lng = pos.lng;
  }try {
    await newFood.save();
    res.send("success");
  } catch (e) {
    console.log(e);
  }
});

export default router;
