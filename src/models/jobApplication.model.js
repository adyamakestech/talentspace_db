import pool from "../config/db.js";

// Ambil semua aplikasi (admin atau recruiter)
export const getAllJobApplications = async () => {
  const res = await pool.query(`
        SELECT ja.id, ja.cover_letter, ja.status, u.name AS applicant_name, j.title AS job_title
        FROM job_application ja
        JOIN users u ON ja.user_id = u.id
        JOIN jobs j ON ja.job_id = j.id
    `);
  return res.rows;
};

// Ambil semua aplikasi berdasarkan user_id (talent)
export const getApplicationById = async (user_id) => {
  const res = await pool.query(
    `
        SELECT ja.id, ja.cover_letter, ja.status, j.title AS job_title, j.company_name, j.location AS job_location
        FROM job_application ja
        JOIN jobs j ON ja.job_id = j.id
        WHERE ja.user_id = $1
        ORDER BY ja.created_at DESC`,
    [user_id]
  );
  return res.rows;
};

// Ambil semua aplikasi berdasarkan job_id (recruiter)
export const getApplicationByJob = async (job_id) => {
  const res = await pool.query(
    `
        SELECT ja.id, ja.cover_letter, ja.status, u.name AS applicant_name, u.email AS applicant_email
        FROM job_application ja
        JOIN users u ON ja.user_id = u.id
        WHERE ja.job_id = $1
        ORDER BY ja.created_at DESC
        `,
    [job_id]
  );
  return res.rows;
};

// Apply untuk pekerjaan
export const applyJob = async ({ user_id, job_id, cover_letter }) => {
  const res = await pool.query(
    `
      INSERT INTO job_application (user_id, job_id, cover_letter)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, job_id, cover_letter, status, created_at;
    `,
    [user_id, job_id, cover_letter]
  );

  return res.rows[0];
};

// Update status aplikasi (admin atau recruiter)
export const updateApplicationStatus = async (id, status) => {
  const res = await pool.query(
    `
        UPDATE job_application
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, user_id, job_id, cover_letter, status, created_at, updated_at;
    `,
    [status, id]
  );
  return res.rows[0];
};

// Hapus aplikasi (talent bisa withdraw)
export const deleteApplication = async (id) => {
  const result = await pool.query(
    "DELETE FROM job_application WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
