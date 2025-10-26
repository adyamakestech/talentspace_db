import pool from "../config/db.js";

// CRUD Operations for Jobs
export const getAllJobs = async () => {
  const res = await pool.query(
    `SELECT id, title, description, company_name, location, created_at FROM jobs ORDER BY created_at DESC`
  );
  return res.rows;
};

export const getJobById = async (id) => {
  const res = await pool.query(
    `SELECT id, title, description,company_name, location, created_at FROM jobs WHERE id = $1`,
    [id]
  );
  return res.rows[0];
};

export const createJob = async (
  title,
  description,
  company_name,
  location,
  salary_range,
  user_id
) => {
  const { rows } = await pool.query(`
    SELECT COALESCE(
    (
      SELECT MIN(missing_id)
      FROM generate_series(1, COALESCE((SELECT MAX(id) FROM jobs), 0) + 1) AS missing_id
      WHERE missing_id NOT IN (SELECT id FROM jobs)
    ), 1
  ) AS next_id;
  `);

  const nextId = rows[0].next_id;

  const res = await pool.query(
    `INSERT INTO jobs (id, title, description, company_name, location, salary_range, user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, title, description, company_name, location, salary_range, user_id, created_at;`,
    [nextId, title, description, company_name, location, salary_range, user_id]
  );

  await pool.query(`
    SELECT setval('jobs_id_seq', (SELECT MAX(id) FROM jobs));
  `);

  return res.rows[0];
};

export const updateJob = async (id, data) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = $${index++}`);
    values.push(value);
  }

  if (fields.length > 0) {
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
  } else {
    throw new Error("No fields provided to update");
  }

  const query = `UPDATE jobs SET ${fields.join(
    ", "
  )} WHERE id = $${index} RETURNING id, title, description, company_name, location, salary_range, user_id, created_at;`;
  values.push(id);

  const res = await pool.query(query, values);
  return res.rows[0];
};

export const deleteJob = async (id) => {
  const result = await pool.query(
    "DELETE FROM jobs WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
