import mongoose from "mongoose";

const schema = mongoose.Schema;

const FoodSchema = new schema(
  {
    id: {
      type: String,
      default: ""
    },
    userid: {
      type: String,
      default: ""
    },
    name: String,
    category: String,
    diet: String,
    address: String,
    quantity: Number,
    notes: String,
    photo: String,
  },
  { timestamps: true },
);

const FoodModel = mongoose.model("Food", FoodSchema);

export default FoodModel;
