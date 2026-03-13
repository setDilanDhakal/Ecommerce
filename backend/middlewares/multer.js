import multer from "multer";
import Path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./nomad/users");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + Path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
});
