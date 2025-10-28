import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";

/**
 * Middleware untuk memverifikasi JWT token
 */
export const verifyToken = (req, res, next) => {
  try {
    // Ambil header Authorization
    const authHeader = req.headers.authorization;

    // Cek apakah header tersedia dan dimulai dengan "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Unauthorized jika tidak ada token
      return errorResponse(res, "No token provided", 401);
    }

    // Ambil token dari header
    const token = authHeader.split(" ")[1];
    // Verifikasi token menggunakan secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan payload token ke req.user agar bisa digunakan di controller
    req.user = decoded;
    // Lanjut ke middleware/controller berikutnya
    next();
  } catch (error) {
    // Jika token invalid atau expired
    return errorResponse(res, error.message);
  }
};
