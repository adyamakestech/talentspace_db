import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../models/user.model.js";
import { hashPassword } from "../utils/bcrypt.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    successResponse(res, users);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return errorResponse(res, "User not found", 404);
    successResponse(res, user);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const createUserController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser(name, email, hashedPassword, role);
    successResponse(res, newUser, "User Created", 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updatedUser = await updateUser(req.params.id, name, email, role);
    if (!updatedUser) return errorResponse(res, "User not found", 404);
    successResponse(res, updatedUser, "User Updated");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return errorResponse(res, "User not found", 404);
    await deleteUser(req.params.id);
    successResponse(res, null, "User Deleted");
  } catch (error) {
    errorResponse(res, error.message);
  }
};
