import express from "express";
import {
  getUser,
  getUsers,
  createUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/us", getUsers);
router.get("/sus/:id", getUser);
router.post("/cus", createUserController);
router.put("/uus/:id", updateUserController);
router.delete("/dus/:id", deleteUserController);

export default router;
