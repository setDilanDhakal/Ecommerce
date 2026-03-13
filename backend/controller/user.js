import User from "../model/user.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configureCloudinary } from "../utils/cloudinary.js";
import fs from "fs/promises";
import { createAccessToken } from "../middlewares/auth.js";


// [SECTION] Register
const Register = async (req, res) => {
  try {

    const cleanLocal = async () => {
      if (req.file?.path) {
        try { await fs.unlink(req.file.path) } catch {}
      }
    }

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
    let uploadedPublicId = "";
    let createdUserId = "";

    if (req.file?.path) {
      const cloudinary = configureCloudinary();

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "nomad/users",
        resource_type: "image",
      });

      imageUrl = upload.secure_url;
      uploadedPublicId = upload.public_id;

      await fs.unlink(req.file.path).catch(() => {});
    } 
    else if (req.body.image) {
      const cloudinary = configureCloudinary();

      const upload = await cloudinary.uploader.upload(req.body.image, {
        folder: "nomad/users",
        resource_type: "image",
      });

      imageUrl = upload.secure_url;
      uploadedPublicId = upload.public_id;
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
      if (uploadedPublicId) {
        const cloudinary = configureCloudinary();
        await cloudinary.uploader.destroy(uploadedPublicId).catch(() => {});
      }
    } catch (_) {}
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

export {Register};
