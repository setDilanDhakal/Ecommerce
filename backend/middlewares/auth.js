import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


// [SECTION] Token Creation
export const createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};


// [SECTION] Verify Token
export const verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (typeof token === "undefined") {
    return res.status(403).send({ auth: "Failed. No Token" });
  }

  token = token.slice(7, token.length);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(403).send({ auth: "Failed" });
    }

    req.user = decodedToken;
    next();
  });
};


// [SECTION] Verify Admin
export const verifyAdmin = (req, res, next) => {
  console.log(req.user);

  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({
      auth: "Failed",
      message: "Action Forbidden",
    });
  }
};


// [SECTION] Error Handler
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      message: errorMessage,
      errorCode: err.code || "SERVER_ERROR",
      details: err.details || null,
    },
  });
};
