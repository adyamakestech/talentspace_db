import dotenv from "dotenv";
import app from "./app.js";

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 5000; // Gunakan port dari .env atau default 5000

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
