import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  productID: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: {},
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    cart: [cartSchema],
  },
  { timestamps: true }
);

const CartModel = mongoose.model("cart", cartSchema);

export default mongoose.model("users", userSchema);
export { CartModel };
