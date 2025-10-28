import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/applications";

// Buat folder jika belum ada
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Export multer instance
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maks 5MB
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext))
      return cb(new Error("Only PDF files are allowed"));
    cb(null, true);
  },
});

// Helper hapus file fisik
export const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};
