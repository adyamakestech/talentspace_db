import express from "express";
import {
  fetchAllApplications,
  fetchApplicationsByUser,
  fetchApplicationsByJob,
  createApplication,
  updateApplicationStatusController,
  removeApplication,
  uploadFileHandler,
} from "../controllers/jobApplication.controller.js";
import { upload } from "../middlewares/upload.js";
import { verifyToken } from "../middlewares/middleware.js";

const router = express.Router();

router.get("/oa/", verifyToken, fetchAllApplications);
router.get("/ua/:user_id", verifyToken, fetchApplicationsByUser);
router.get("/ja/:job_id", verifyToken, fetchApplicationsByJob);
router.post("/aj/", verifyToken, createApplication);
router.put("/ua/:id/status", verifyToken, updateApplicationStatusController);
router.delete("/da/:id", verifyToken, removeApplication);

// File Upload Route
router.post("/uf", upload.single("cover_letter"), uploadFileHandler.handle);
router.delete(
  "/df/:filename/:application_id",
  verifyToken,
  uploadFileHandler.delete
);
export default router;
