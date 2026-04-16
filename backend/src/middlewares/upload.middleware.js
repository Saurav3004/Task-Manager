import multer from "multer";
import path from "path";

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// file filter (ONLY PDF)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);

  if (ext !== ".pdf") {
    return cb(new Error("Only PDF files allowed"), false);
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 3,
  },
});