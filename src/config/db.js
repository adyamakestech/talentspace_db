import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

// Konfigurasi koneksi database PostgreSQL
const pool = new Pool({
  // Username database
  user: process.env.DB_USER,
  // Host/database server
  host: process.env.DB_HOST,
  // Nama database
  database: process.env.DB_NAME,
  // Password database
  password: process.env.DB_PASSWORD,
  // Port default PostgreSQL
  port: 5432,
});

// Cek koneksi ke database
pool
  .connect()
  .then(() => {
    console.log("Connected to the database successfully.");
  })
  .catch((err) => {
    console.error("Database connection error:", err.stack);
  });

// Export pool agar bisa digunakan di file lain (misal di model)
export default pool;
