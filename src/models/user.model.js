import pool from "../config/db.js";

export const getAllUsers = async () => {
  const res = await pool.query(
    `SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`
  );
  return res.rows;
};

export const getUserById = async (id) => {
  const res = await pool.query(
    `SELECT id, name, email, role, created_at FROM users WHERE id = $1`,
    [id]
  );
  return res.rows[0];
};

export const createUser = async (name, email, password) => {
  const { rows } = await pool.query(`
    SELECT COALESCE(
      (
        SELECT MIN(t1.id + 1)
        FROM users t1
        LEFT JOIN users t2 ON t2.id = t1.id + 1
        WHERE t2.id IS NULL
      ),
      1
    ) AS next_id;
  `);
  const nextId = rows[0].next_id;
  let res;
  res = await pool.query(
    `INSERT INTO users (id, name, email, password)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at;`,
    [nextId, name, email, password]
  );

  await pool.query(
    `SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));`
  );

  return res.rows[0];
};

export const updateUser = async (id, name, email) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (name) {
    fields.push(`name = $${index++}`);
    values.push(name);
  }

  if (email) {
    fields.push(`email = $${index++}`);
    values.push(email);
  }

  if (fields.length === 0) {
    throw new Error("No fields provided to update");
  }

  values.push(id);

  const query = `
    UPDATE users
    SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${index}
    RETURNING id, name, email, role, created_at;
  `;

  const res = await pool.query(query, values);

  return res.rows[0];
};

export const deleteUser = async (id) => {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
};
