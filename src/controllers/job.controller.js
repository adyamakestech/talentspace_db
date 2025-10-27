import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from "../models/job.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getJobs = async (req, res) => {
  try {
    const jobs = await getAllJobs();
    successResponse(res, jobs);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await getJobById(req.params.id);
    if (!job) return errorResponse(res, "Job not found", 404);
    successResponse(res, job);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const createJobController = async (req, res) => {
  try {
    const { title, description, company_name, location, salary_range } =
      req.body;

    const user_id = req.user.id;

    const newJob = await createJob(
      title,
      description,
      company_name,
      location,
      salary_range,
      user_id
    );

    return successResponse(res, newJob, "Job created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const updateJobController = async (req, res) => {
  try {
    const updatedJob = await updateJob(req.params.id, req.body);
    if (!updatedJob) return errorResponse(res, "Job not found", 404);
    successResponse(res, updatedJob, "Job Updated");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const deleteJobController = async (req, res) => {
  try {
    const job = await getAllJobs(req.params.id);
    if (!job) return errorResponse(res, "Job not found", 404);
    await deleteJob(req.params.id);
    successResponse(res, null, "Job Deleted");
  } catch (error) {
    errorResponse(res, error.message);
  }
};
