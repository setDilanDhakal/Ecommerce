import User from "../model/user.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configureCloudinary } from "../utils/cloudinary.js";
import fs from "fs/promises";
import { createAccessToken } from "../middlewares/auth.js";

const Register = async (req, res) => {
  try {
    if (!req.body.email?.includes("@")) {
      return res.status(400).send({ message: "Email invalid" });
    }
    if (!req.body.mobileNo || req.body.mobileNo.length !== 10) {
      return res.status(400).send({ message: "Mobile number invalid" });
    }
    if (!req.body.password || req.body.password.length < 8) {
      return res
        .status(400)
        .send({ message: "Password must be at least 8 characters" });
    }

    let imageUrl = "";
    if (req.file?.path) {
      const cloudinary = configureCloudinary();
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "nomad/users",
        resource_type: "image",
      });
      imageUrl = upload.secure_url;
      await fs.unlink(req.file.path).catch(() => {});
    } else if (req.body.image) {
      const cloudinary = configureCloudinary();
      const upload = await cloudinary.uploader.upload(req.body.image, {
        folder: "nomad/users",
        resource_type: "image",
      });
      imageUrl = upload.secure_url;
    }

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      mobileNo: req.body.mobileNo,
      image: imageUrl,
    });

    await newUser.save();
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
    return res.status(201).send({ message: "Registered successfully", data: userObj });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).send({ message: "Registration failed", error: error.message });
  }
};

export { Register };
