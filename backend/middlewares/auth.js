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
  const authorization = req.headers.authorization;
  let token = "";

  if (authorization && authorization.startsWith("Bearer ")) {
    token = authorization.slice(7);
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(403).send({ auth: "Failed. No Token" });
  }

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
