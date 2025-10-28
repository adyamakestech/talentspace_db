import { getRecruiterByUserId } from "../models/recruiter.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

/**
 * Controller untuk mengambil data dashboard recruiter
 */
export const getRecruiterDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const rows = await getRecruiterByUserId(userId);
    // Mengambil data recruiter termasuk job yang dibuat dan pelamar yang apply

    // Array untuk menampung data job + pelamar
    const jobs = [];

    // Looping setiap row dari DB
    rows.forEach((row) => {
      // Cek apakah job sudah ada di array jobs
      let job = jobs.find((j) => j.id === row.job_id);
      if (!job) {
        // Jika job belum ada, buat object baru
        job = {
          id: row.job_id,
          title: row.title,
          description: row.description,
          applicants: [],
        };
        jobs.push(job);
      }
      // Jika ada applicant di row, tambahkan ke array applicants job tersebut
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

    return successResponse(res, { jobs }, "Recruiter Dashboard Data", 200);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
