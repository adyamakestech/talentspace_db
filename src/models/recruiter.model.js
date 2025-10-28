import pool from "../config/db.js";

// ======================================================
//  Ambil semua aplikasi untuk job yang dimiliki recruiter
// ======================================================
export const getRecruiterByUserId = async (user_id, limit = 20, offset = 0) => {
  // Query untuk join tabel jobs, job_application, dan users
  // Mengambil semua aplikasi yang terkait dengan job milik recruiter tertentu
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
    LIMIT $2 OFFSET $3
  `;

  // Parameterized query untuk keamanan dari SQL Injection
  const res = await pool.query(query, [user_id, limit, offset]);

  // Mengembalikan array aplikasi yang terkait dengan recruiter
  return res.rows;
};
