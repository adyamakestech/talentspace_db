import express from "express";
import {
  fetchAllApplications,
  fetchApplicationsByUser,
  fetchApplicationsByJob,
  createApplication,
  updateApplicationStatusController,
  removeApplication,
} from "../controllers/jobApplication.controller.js";
import { verifyToken } from "../middlewares/middleware.js";

const router = express.Router();

router.get("/oa/", verifyToken, fetchAllApplications);
router.get("/ua/:user_id", verifyToken, fetchApplicationsByUser);
router.get("/ja/:job_id", verifyToken, fetchApplicationsByJob);
router.post("/aj/", verifyToken, createApplication);
router.put("/ua/:id/status", verifyToken, updateApplicationStatusController);
router.delete("/da/:id", verifyToken, removeApplication);

export default router;
