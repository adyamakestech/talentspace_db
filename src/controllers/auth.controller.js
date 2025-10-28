import jwt from "jsonwebtoken";
import { findUserByEmail, createUserWithRole } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Register user baru
 */
export const register = async (req, res) => {
  try {
    // Ambil input dari request body
    const { name, email, password } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = await findUserByEmail(email);
    if (existingUser) return errorResponse(res, "Email already exists", 400);

    // Hash password sebelum disimpan ke database
    const hashedPassword = await hashPassword(password);

    // Buat user baru dengan role default "user"
    const user = await createUserWithRole(name, email, hashedPassword, "user");

    successResponse(
      res,
      { id: user.id, name: user.name, email: user.email, role: user.role },
      "User registered successfully",
      201
    );
  } catch (error) {
    errorResponse(res, error.message);
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    // Ambil input dari request body
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await findUserByEmail(email);
    if (!user) return errorResponse(res, "Invalid email or password", 401);

    // Bandingkan password input dengan password hash di database
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return errorResponse(res, "Invalid email or password", 401);

    // Buat JWT token berisi data user
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token berlaku 1 jam
    );

    successResponse(
      res,
      { token, user: { id: user.id, email: user.email, role: user.role } },
      "Login successful"
    );
  } catch (error) {
    errorResponse(res, error.message);
  }
};
