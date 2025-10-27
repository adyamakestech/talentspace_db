import { getRecruiterByUserId } from "../models/recruiter.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

// Controller to get recruiter dashboard data
export const getRecruiterDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const rows = await getRecruiterByUserId(userId);

    const jobs = [];

    rows.forEach((row) => {
      let job = jobs.find((j) => j.id === row.job_id);
      if (!job) {
        job = {
          id: row.job_id,
          title: row.title,
          description: row.description,
          applicants: [],
        };
        jobs.push(job);
      }
      if (row.applicant_id) {
        job.applicants.push({
          id: row.applicant_id,
          name: row.applicant_name,
          email: row.applicant_email,
          status: row.status,
          applied_at: row.applied_at,
        });
      }
    });
    console.log("User ID from JWT:", req.user.id);
    console.log("Rows from DB:", rows);
    return successResponse(res, { jobs }, "Recruiter Dashboard Data", 200);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
