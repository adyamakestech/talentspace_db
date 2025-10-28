import pool from "../config/db.js";

// ======================================================
//  Get All Jobs - Mengambil semua data pekerjaan
// ======================================================
export const getAllJobs = async () => {
  // Query untuk mengambil seluruh kolom penting dari tabel jobs
  const res = await pool.query(
    `SELECT id, title, description, company_name, location, created_at
     FROM jobs
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  // Mengembalikan hasil query dalam bentuk array
  return res.rows;
};

// ======================================================
//  Get Job by ID - Mengambil data pekerjaan berdasarkan ID
// ======================================================
export const getJobById = async (id) => {
  // Query untuk mengambil satu baris data job berdasarkan ID
  const res = await pool.query(
    `SELECT id, title, description, company_name, location, created_at 
     FROM jobs 
     WHERE id = $1`,
    [id] // $1 adalah placeholder parameter untuk menghindari SQL Injection
  );
  // Mengembalikan satu objek job (baris pertama hasil query)
  return res.rows[0];
};

// ======================================================
//  Create Job - Menambahkan data pekerjaan baru ke database
// ======================================================
export const createJob = async (
  title,
  description,
  company_name,
  location,
  salary_range,
  user_id
) => {
  // Query untuk insert data baru ke tabel jobs
  const res = await pool.query(
    `INSERT INTO jobs (title, description, company_name, location, salary_range, user_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING title, description, company_name, location, salary_range, user_id, created_at;`,
    [title, description, company_name, location, salary_range, user_id]
  );
  // Mengembalikan data job yang baru dibuat
  return res.rows[0];
};

// ======================================================
//  Update Job - Memperbarui data pekerjaan yang sudah ada
// ======================================================
export const updateJob = async (id, data) => {
  const fields = []; // Menampung field yang akan di-update
  const values = []; // Menampung nilai dari masing-masing field
  let index = 1; // Menentukan urutan parameter ($1, $2, dst)

  // Loop melalui setiap field yang dikirim di data (body request)
  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = $${index++}`); // Contoh: title = $1
    values.push(value); // Menyimpan nilai untuk parameter query
  }

  // Jika ada field yang di-update, tambahkan updated_at otomatis
  if (fields.length > 0) {
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
  } else {
    throw new Error("No fields provided to update"); // Jika tidak ada field dikirim
  }

  // Buat query UPDATE dinamis berdasarkan field yang dikirim
  const query = `UPDATE jobs 
                 SET ${fields.join(", ")} 
                 WHERE id = $${index} 
                 RETURNING id, title, description, company_name, location, salary_range, user_id, created_at;`;

  values.push(id); // Tambahkan ID ke akhir parameter untuk WHERE id = $n

  // Jalankan query update
  const res = await pool.query(query, values);
  // Mengembalikan data job yang sudah diperbarui
  return res.rows[0];
};

// ======================================================
//  Delete Job - Menghapus data pekerjaan berdasarkan ID
// ======================================================
export const deleteJob = async (id) => {
  // Query untuk menghapus satu job berdasarkan ID
  const result = await pool.query(
    "DELETE FROM jobs WHERE id = $1 RETURNING *",
    [id] // Gunakan parameterized query untuk keamanan
  );
  // Mengembalikan data job yang dihapus (atau null jika tidak ditemukan)
  return result.rows[0];
};
