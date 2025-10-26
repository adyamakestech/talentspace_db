import {
  getAllJobApplications,
  getApplicationById,
  getApplicationByJob,
  applyJob,
  updateApplicationStatus,
  deleteApplication,
} from "../models/jobApplication.model.js";
import { getJobById } from "../models/job.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

// (Admin atau recruiter) - Ambil semua job application
export const fetchAllApplications = async (req, res) => {
  try {
    const applications = await getAllJobApplications();
    successResponse(res, applications);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

// Ambil semua application milik user (talent)
export const fetchApplicationsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const applications = await getApplicationById(user_id);

    if (applications.length === 0)
      return errorResponse(res, "No applications found for this user", 404);

    successResponse(res, applications);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

// Ambil semua pelamar berdasarkan job_id (recruiter)
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

// Talent apply ke job
export const createApplication = async (req, res) => {
  try {
    const { user_id, job_id, cover_letter } = req.body;

    if (!user_id || !job_id)
      return errorResponse(res, "user_id and job_id are required", 400);

    // Cek apakah job valid
    const job = await getJobById(job_id);
    if (!job) return errorResponse(res, "Job not found", 404);

    // Simpan aplikasi baru
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

// Recruiter update status aplikasi
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

// Talent withdraw / hapus aplikasi
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
