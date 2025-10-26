import express from "express";
import {
  getJobs,
  getJob,
  createJobController,
  updateJobController,
  deleteJobController,
} from "../controllers/job.controller.js";
import { verifyToken } from "../middlewares/middleware.js";

const router = express.Router();

router.get("/oj/", verifyToken, getJobs);
router.get("/aj/:id", verifyToken, getJob);
router.post("/cj/", verifyToken, createJobController);
router.put("/uj/:id", verifyToken, updateJobController);
router.delete("/dj/:id", verifyToken, deleteJobController);

export default router;
