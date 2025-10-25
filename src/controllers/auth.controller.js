import jwt from "jsonwebtoken";
import { findUserByEmail, createUserWithRole } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) return errorResponse(res, "Email already exists", 400);

    const hashedPassword = await hashPassword(password);
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) return errorResponse(res, "Invalid email or password", 401);

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return errorResponse(res, "Invalid email or password", 401);

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
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
