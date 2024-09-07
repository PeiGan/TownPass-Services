import mongoose from "mongoose";

const schema = mongoose.Schema;

const FoodSchema = new schema(
  {
    name: String,
    amount: Number,
    address: String,
    provider: String,
    veg: String,
    lat: {
      type: Number,
      default: 25.02605
    },
    lng:{
      type: Number,
      default: 121.5436
    },
    memo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const FoodModel = mongoose.model("Food", FoodSchema);

export default FoodModel;
