import User from "../model/user.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const Register = (req, res) => {
  try {
    if (!req.body.email.includes("@")) {
      return res.status(400).send({ message: "Email invalid" });
    } else if (req.body.mobileNo.length !== 11) {
      return res.status(400).send({ message: "Mobile number invalid" });
    } else if (req.body.password.length < 8) {
      return res
        .status(400)
        .send({ message: "Password must be at least 8 characters" });
    } else {
      let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        mobileNo: req.body.mobileNo,
      });

      return newUser
        .save()
        .then(() =>
          res.status(201).send({
            message: "Registered successfully",
          }),
        )
        .catch((error) => errorHandler(error, req, res));
    }
  } catch (error) {
    console.error("Error", error);
  }
};

export { Register };
