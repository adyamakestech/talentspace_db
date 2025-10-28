import fs from "fs";
import path from "path";
import {
  getAllJobApplications,
  getApplicationById,
  getApplicationByJob,
  applyJob,
  updateApplicationStatus,
  deleteApplication,
} from "../models/jobApplication.model.js";
import { getJobById } from "../models/job.model.js";
import { uploadModel } from "../models/upload.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * (Admin / Recruiter) - Ambil semua job applications
 */
export const fetchAllApplications = async (req, res) => {
  try {
    // Ambil semua aplikasi dari DB
    const applications = await getAllJobApplications();
    successResponse(res, applications);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

/**
 * Ambil semua aplikasi milik user tertentu (Talent)
 */
export const fetchApplicationsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    // Ambil aplikasi user
    const applications = await getApplicationById(user_id);

    // check jika tidak ada aplikasi
    if (applications.length === 0)
      return errorResponse(res, "No applications found for this user", 404);

    successResponse(res, applications);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

/**
 * Ambil semua aplikasi berdasarkan job_id (Recruiter)
 */
export const fetchApplicationsByJob = async (req, res) => {
  try {
    const { job_id } = req.params;
    const applications = await getApplicationByJob(job_id);

    if (applications.length === 0)
      return errorResponse(res, "No applications found for this job", 404);

    successResponse(res, applications);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

/**
 * Talent apply ke job
 */
export const createApplication = async (req, res) => {
  try {
    const { user_id, job_id, cover_letter } = req.body;

    // Validasi input
    if (!user_id || !job_id)
      return errorResponse(res, "user_id and job_id are required", 400);

    // Cek apakah job ada
    const job = await getJobById(job_id);
    if (!job) return errorResponse(res, "Job not found", 404);

    // Simpan aplikasi baru ke DB
    const application = await applyJob({ user_id, job_id, cover_letter });
    successResponse(
      res,
      application,
      "Application submitted successfully",
      201
    );
  } catch (error) {
    errorResponse(res, error.message);
  }
};

/**
 * Recruiter update status aplikasi
 */
export const updateApplicationStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return errorResponse(res, "Status field is required", 400);

    const updated = await updateApplicationStatus(id, status);
    if (!updated) return errorResponse(res, "Application not found", 404);

    successResponse(res, updated, "Application status updated");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

/**
 * Talent withdraw / hapus aplikasi
 */
export const removeApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteApplication(id);

    if (!deleted) return errorResponse(res, "Application not found", 404);

    successResponse(res, null, "Application deleted successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

/**
 * Class untuk handle upload dan delete file untuk job applications
 */
export class uploadFileHandler {
  /**
   * Upload file
   */
  static async handle(req, res) {
    try {
      const { application_id } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Simpan info file
      const fileData = uploadModel.saveFileInfo(req.file);
      const publicUrl = uploadModel.getPublicUrl(fileData.path);

      let updatedApp = null;
      if (application_id) {
        // Update path file di database jika application_id tersedia
        updatedApp = await uploadModel.saveToDatabase(
          application_id,
          fileData.path
        );
      }

      return res.status(200).json({
        message: "File uploaded successfully",
        file: { ...fileData, url: publicUrl },
        updated_application: updatedApp,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res
        .status(500)
        .json({ message: "File upload failed", error: error.message });
    }
  }

  /**
   * Delete file
   */
  static async delete(req, res) {
    try {
      const { filename, application_id } = req.params;

      if (!filename) {
        return res.status(400).json({ message: "Filename required" });
      }

      const filePath = path.resolve("uploads/applications", filename);

      // Cek apakah file ada
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      // Hapus file dari filesystem
      fs.unlinkSync(filePath);

      let updatedApp = null;
      if (application_id) {
        // Hapus reference file di DB jika application_id tersedia
        updatedApp = await uploadModel.removeFromDatabase(application_id);
      }

      return res.status(200).json({
        message: "File deleted successfully",
        file: filename,
        updated_application: updatedApp,
      });
    } catch (error) {
      console.error("Delete file error:", error);
      return res
        .status(500)
        .json({ message: "Failed to delete file", error: error.message });
    }
  }
}
