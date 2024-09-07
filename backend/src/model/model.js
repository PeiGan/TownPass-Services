import mongoose from "mongoose";

const schema = mongoose.Schema;

const FoodSchema = new schema(
  {
    name: String,
    amount: Number,
    address: String,
    provider: String,
    veg: String,
    memo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const FoodModel = mongoose.model("Food", FoodSchema);

export default FoodModel;
