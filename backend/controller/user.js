import User from "../model/user.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import { createAccessToken } from "../middlewares/auth.js";

// [SECTION] Register
const Register = async (req, res) => {
  try {
    const cleanLocal = async () => {
      if (req.file?.path) {
        try {
          await fs.unlink(req.file.path);
        } catch {}
      }
    };

    if (!req.body.email || !req.body.email.includes("@")) {
      await cleanLocal();
      return res.status(400).send({ message: "Email invalid" });
    }

    if (!req.body.mobileNo || req.body.mobileNo.length !== 10) {
      await cleanLocal();
      return res.status(400).send({ message: "Mobile number invalid" });
    }

    if (!req.body.password || req.body.password.length < 8) {
      await cleanLocal();
      return res.status(400).send({
        message: "Password must be at least 8 characters",
      });
    }

    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      await cleanLocal();
      return res.status(400).send({
        message: "Email already registered , Login Instead",
      });
    }

    const existingMobile = await User.findOne({ mobileNo: req.body.mobileNo });
    if (existingMobile) {
      await cleanLocal();
      return res.status(400).send({
        message: "Mobile number already registered",
      });
    }

    let imageUrl = "";
    let createdUserId = "";
    if (!req.file?.filename) {
      await cleanLocal();
      return res.status(400).send({ message: "Image is required" });
    }
    imageUrl = `/uploads/users/${req.file.filename}`;

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      mobileNo: req.body.mobileNo,
      image: imageUrl,
    });

    await newUser.save();
    createdUserId = newUser._id?.toString?.() || "";

    const token = createAccessToken(newUser);
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).send({
      message: "Registered successfully",
      data: userObj,
    });
  } catch (error) {
    console.error("Register error:", error);

    try {
      if (createdUserId) {
        await User.findByIdAndDelete(createdUserId).catch(() => {});
      }
    } catch (_) {}

    return res.status(500).send({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// [SECTION] Login
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const token = createAccessToken(user);
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).send({
      message: "Logged in successfully",
      data: userObj,
      token: token,
    });
  } catch (error) {
    console.log("Error from Login", error);
    return res.status(500).send({
      message: "Login failed",
      error: error.message,
    });
  }
};

// [SECTION] Get User
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      console.log("User Id required");
      res.send(500).json({ message: "User Id is required" });
    }
    const user = await User.findById(id).select("-password");

    if (!user) {
      res.send(500).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User Found",
      data: user,
    });
  } catch (error) {
    console.log("Error from getUser", error);
    return res.status(500).json({
      message: "Something went Wrong",
      error: error.message,
    });
  }
};

// [SECTION] Update User
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanLocal = async () => {
      if (req.file?.path) {
        try {
          await fs.unlink(req.file.path);
        } catch {}
      }
    };

    if (!id) {
      await cleanLocal();
      return res.status(400).json({
        message: "User Id is required",
      });
    }

    const user = await User.findById(id);
    console.log(user);

    if (!user) {
      await cleanLocal();
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { firstName, lastName, email, image, mobileNo } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (mobileNo) user.mobileNo = mobileNo;

    if (req.file?.filename) {
      user.image = `/uploads/users/${req.file.filename}`;
    }

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: "User updated successfully",
      data: userObj,
    });
  } catch (error) {
    console.error("Error from updateUser:", error);
    try {
      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }
    } catch (_) {}
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error from deleteUser:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Update Password
const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body || {};

    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export { Register, Login, getUser, updateUser, deleteUser, updatePassword };
