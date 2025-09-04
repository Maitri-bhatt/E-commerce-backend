import { Schema } from "mongoose";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, question, answer } =
      req.body;
    // validations
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!question) {
      return res.send({ message: "Question is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }

    // check user
    const existingUser = await userModel.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    // register user
    const hashedPassword = await hashPassword(password);
    console.log(question, answer);
    // save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      question,
      answer,
      cart: [],
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registration",
      error,
    });
  }
};
// POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    // check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    console.log(user);
    const match = await comparePassword(password, user.password);
    console.log(match);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }
    // token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        cart: user.cart,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
// forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //  check
    const user = await userModel.findOne({ email, answer });
    // console.log(user);
    //  validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
// test controller
export const testController = (req, res) => {
  try {
    res.send("protected Route");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

// update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //  password
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and 6 charcter long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error While Update profile",
      error,
    });
  }
};

export const addToCart = async (req, res) => {
  const user = await userModel.findById(req.user._id);
  const product_id = req.body["product_id"];

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "You are unauthorized",
    });
  }

  const productInCart = user.cart.filter(
    (c) => c.productID.toString() === product_id
  );

  let updatedCart;

  if (productInCart.length === 0) {
    updatedCart = { productID: req.body["product_id"], quantity: 1 };
    user.cart.push(updatedCart);
  } else {
    const cart = productInCart[0];
    cart.quantity += 1;
    updatedCart = cart;
    await userModel.findOneAndUpdate({ userID: user._id }, { cart: cart });
  }
  await user.save();

  res.json({
    success: true,
    message: "Added to cart",
    payload: {
      cart: updatedCart,
    },
  });
};

// get user cart
export const getUserCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    return res.json({
      status: true,
      cart: user.cart,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e,
    });
  }
};

export const removeItemFromCart = async (req, res) => {
  const cartID = req.params["cart_id"];
  try {
    const user = await userModel.findById(req.user._id);

    const [cart] = user.cart.filter((c) => c._id.toString() === cartID);
    if (!cart) {
      res.status(404).json({
        status: false,
        message: "Cart not found",
      });
    }

    if (cart.quantity == 1) {
      await userModel.findOneAndUpdate(
        { _id: user._id },
        {
          cart: user.cart.filter((c) => c._id.toString() !== cartID),
        }
      );
      res.send({ status: true });
    } else {
      // const updatedCart = cart;
      // const quantity = cart.quantity;
      const result = await userModel.updateOne(
        { _id: user._id, "cart._id": cart._id },
        { $set: { "cart.$.quantity": --cart.quantity } }
      );

      res.send({ status: true, cart: cart });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: e,
    });
  }
};
