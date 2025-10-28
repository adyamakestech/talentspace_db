import fs from "fs";
import pool from "../config/db.js";

export class uploadModel {
  // ======================================================
  //  Simpan info file setelah upload (lokal)
  // ======================================================
  static saveFileInfo(file) {
    if (!file) throw new Error("No file uploaded");

    // Mengembalikan objek info file untuk disimpan di DB atau log
    return {
      filename: file.filename, // Nama file di server
      originalname: file.originalname, // Nama file asli dari user
      mimetype: file.mimetype, // Tipe file (MIME type)
      size: file.size, // Ukuran file (bytes)
      path: file.path, // Path lokal file
      uploaded_at: new Date(), // Timestamp upload
    };
  }

  // ======================================================
  //  Hapus file dari storage lokal
  // ======================================================
  static deleteFile(filePath) {
    if (!filePath) return;

    // Cek apakah file ada sebelum dihapus
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  // ======================================================
  //  Dapatkan URL publik file (misal untuk frontend)
  // ======================================================
  static getPublicUrl(filePath) {
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    // Replace backslash (\) dengan slash (/) agar URL valid
    return `${baseUrl}/${filePath.replace(/\\/g, "/")}`;
  }

  // ======================================================
  //  Simpan URL file ke kolom cover_letter di DB
  // ======================================================
  static async saveToDatabase(applicationId, filePath) {
    try {
      const publicUrl = this.getPublicUrl(filePath);

      const result = await pool.query(
        `UPDATE job_application 
         SET cover_letter = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *;`,
        [publicUrl, applicationId]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error saving file path to database:", error);
      throw error;
    }
  }

  // ======================================================
  //  Hapus kolom cover_letter di DB setelah file dihapus
  // ======================================================
  static async removeFromDatabase(applicationId) {
    try {
      const result = await pool.query(
        `UPDATE job_application 
         SET cover_letter = NULL, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 
         RETURNING *;`,
        [applicationId]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error removing file path from database:", error);
      throw error;
    }
  }
}
