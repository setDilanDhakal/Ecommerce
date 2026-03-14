import multer from "multer";
import fs from "fs";
import Path from "path";

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./public/uploads/users";
    try { fs.mkdirSync(dir, { recursive: true }); } catch {}
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + Path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage: userStorage,
});

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./public/uploads/products";
    try { fs.mkdirSync(dir, { recursive: true }); } catch {}
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + Path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const uploadProduct = multer({
  storage: productStorage,
});
