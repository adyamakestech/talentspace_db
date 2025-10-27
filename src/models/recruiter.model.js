import pool from "../config/db.js";

export const getRecruiterByUserId = async (user_id) => {
  const query = `
        SELECT
        j.id AS job_id,
        j.title,
        j.description,
        a.id AS applicant_id,
        u.name AS applicant_name,
        u.email AS applicant_email,
        a.status,
        a.created_at AS applied_at
        FROM jobs j
        JOIN job_application a ON j.id = a.job_id
        JOIN users u ON a.user_id = u.id
        WHERE j.user_id = $1
        ORDER BY a.created_at DESC
    `;
  const res = await pool.query(query, [user_id]);
  return res.rows;
};
