import fs from "fs";
import pool from "../config/db.js";

export class uploadModel {
  static saveFileInfo(file) {
    if (!file) throw new Error("No file uploaded");

    return {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      uploaded_at: new Date(),
    };
  }

  static deleteFile(filePath) {
    if (!filePath) return;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  static getPublicUrl(filePath) {
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    return `${baseUrl}/${filePath.replace(/\\/g, "/")}`;
  }

  // ✅ Simpan URL file ke kolom cover_letter
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

  // 🧹 Kosongkan kolom cover_letter di DB setelah file dihapus
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
