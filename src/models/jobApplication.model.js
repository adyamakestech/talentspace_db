import pool from "../config/db.js";

// ======================================================
//  Ambil semua aplikasi (admin/recruiter) dengan pagination
// ======================================================
export const getAllJobApplications = async (limit = 20, offset = 0) => {
  const res = await pool.query(
    `
    SELECT ja.id, ja.cover_letter, ja.status, u.name AS applicant_name, j.title AS job_title
    FROM job_application ja
    JOIN users u ON ja.user_id = u.id
    JOIN jobs j ON ja.job_id = j.id
    ORDER BY ja.created_at DESC
    LIMIT $1 OFFSET $2
  `,
    [limit, offset]
  );

  return res.rows;
};

// ======================================================
//  Ambil aplikasi berdasarkan user_id (talent) dengan pagination
// ======================================================
export const getApplicationByUser = async (user_id, limit = 20, offset = 0) => {
  const res = await pool.query(
    `
      SELECT ja.id, ja.cover_letter, ja.status, j.title AS job_title, j.company_name, j.location AS job_location
      FROM job_application ja
      JOIN jobs j ON ja.job_id = j.id
      WHERE ja.user_id = $1
      ORDER BY ja.created_at DESC
      LIMIT $2 OFFSET $3
    `,
    [user_id, limit, offset]
  );
  return res.rows;
};

// ======================================================
//  Ambil aplikasi berdasarkan job_id (recruiter) dengan pagination
// ======================================================
export const getApplicationByJob = async (job_id, limit = 20, offset = 0) => {
  const res = await pool.query(
    `
      SELECT ja.id, ja.cover_letter, ja.status, u.name AS applicant_name, u.email AS applicant_email
      FROM job_application ja
      JOIN users u ON ja.user_id = u.id
      WHERE ja.job_id = $1
      ORDER BY ja.created_at DESC
      LIMIT $2 OFFSET $3
    `,
    [job_id, limit, offset]
  );
  return res.rows;
};

// ======================================================
//  Apply untuk pekerjaan (talent)
// ======================================================
export const applyJob = async ({ user_id, job_id, cover_letter }) => {
  // Cek apakah user sudah apply untuk job yang sama
  const existing = await pool.query(
    "SELECT * FROM job_application WHERE user_id = $1 AND job_id = $2",
    [user_id, job_id]
  );
  if (existing.rows.length > 0) {
    throw new Error("User already applied for this job");
  }

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

// ======================================================
//  Update status aplikasi (admin/recruiter)
// ======================================================
export const updateApplicationStatus = async (id, status) => {
  const validStatus = ["pending", "accepted", "rejected"];
  if (!validStatus.includes(status)) {
    throw new Error("Invalid status value");
  }

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

// ======================================================
//  Hapus aplikasi (talent bisa withdraw)
// ======================================================
export const deleteApplication = async (id) => {
  const result = await pool.query(
    "DELETE FROM job_application WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
