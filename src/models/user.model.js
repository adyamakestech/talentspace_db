import pool from "../config/db.js";

// CRUD Operations for Users
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
  const res = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role, created_at;`,
    [name, email, password]
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

// Authentication
export const findUserByEmail = async (email) => {
  const res = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return res.rows[0];
};

export const createUserWithRole = async (
  name,
  email,
  password,
  role = "user"
) => {
  const res = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at;`,
    [name, email, password, role]
  );

  return res.rows[0];
};
