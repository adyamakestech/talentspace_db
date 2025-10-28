# 🧠 TalentSpace Backend (`talentspace_be`)

Backend API untuk platform **TalentSpace**, sebuah sistem rekrutmen yang menghubungkan **pencari kerja (job seekers)** dengan **recruiter / employer**.
Dibangun menggunakan **Node.js**, **Express**, dan **PostgreSQL**, dengan struktur modular yang bersih dan scalable.

---

## 🚀 Fitur Utama

- 🔐 **Autentikasi & Autorisasi**
  Register dan login menggunakan JWT Token.
- 👤 **Manajemen User**
  CRUD user dengan peran (user, employer, admin).
- 💼 **Manajemen Job**
  Employer dapat membuat, mengedit, dan menghapus lowongan pekerjaan.
- 📄 **Aplikasi Lamaran (Job Applications)**
  User dapat melamar pekerjaan, mengunggah CV & cover letter.
- 🧾 **Recruiter Dashboard**
  Menampilkan data statistik lamaran untuk recruiter.
- 📁 **Upload File System**
  Upload dan hapus file (CV/Cover Letter) ke lokal/cloud storage.

---

## 🏗️ Tech Stack

| Komponen                | Teknologi            |
| ----------------------- | -------------------- |
| **Runtime**             | Node.js              |
| **Framework**           | Express.js           |
| **Database**            | PostgreSQL           |
| **ORM / Query Builder** | Native SQL via `pg`  |
| **Auth**                | JWT (JSON Web Token) |
| **File Upload**         | Multer               |
| **Environment Config**  | dotenv               |
| **Security & CORS**     | cors, bcrypt         |

---

## 📁 Struktur Proyek

```
talentspace_be/
│
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── job.controller.js
│   ├── jobApplication.controller.js
│   └── recruiter.controller.js
│
├── middlewares/
│   ├── middleware.js        # JWT verification
│   └── upload.js            # Multer upload config
│
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── job.routes.js
│   ├── jobApplication.routes.js
│   └── recruiter.routes.js
│
├── db/
│   └── pool.js              # PostgreSQL connection
│
├── .env
├── package.json
├── app.js                   # Express app setup
└── server.js                # Entry point
```

---

## ⚙️ Instalasi & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/talentspace_be.git
cd talentspace_be
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Konfigurasi `.env`

Buat file `.env` di root folder:

```bash
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/talentspace_db
JWT_SECRET=your_jwt_secret
UPLOAD_DIR=uploads/
```

### 4️⃣ Jalankan Server

```bash
npm run dev
```

Server akan berjalan di:
👉 `http://localhost:5000`

---

## 🧩 Endpoint API

### 🔑 Auth Routes (`/api/auth`)

| Method | Endpoint | Deskripsi                   |
| ------ | -------- | --------------------------- |
| `POST` | `/reg`   | Register user baru          |
| `POST` | `/log`   | Login user & dapatkan token |

---

### 👤 User Routes (`/api/users`)

| Method   | Endpoint   | Deskripsi                 |
| -------- | ---------- | ------------------------- |
| `GET`    | `/us`      | Ambil semua user          |
| `GET`    | `/sus/:id` | Ambil user berdasarkan ID |
| `POST`   | `/cus`     | Tambah user               |
| `PUT`    | `/uus/:id` | Update user               |
| `DELETE` | `/dus/:id` | Hapus user                |

---

### 💼 Job Routes (`/api/jobs`)

| Method   | Endpoint  | Deskripsi        |
| -------- | --------- | ---------------- |
| `GET`    | `/oj/`    | Ambil semua job  |
| `GET`    | `/aj/:id` | Ambil detail job |
| `POST`   | `/cj/`    | Buat job baru    |
| `PUT`    | `/uj/:id` | Update job       |
| `DELETE` | `/dj/:id` | Hapus job        |

---

### 📄 Job Application Routes (`/api/applications`)

| Method   | Endpoint                        | Deskripsi                |
| -------- | ------------------------------- | ------------------------ |
| `GET`    | `/oa/`                          | Ambil semua aplikasi     |
| `GET`    | `/ua/:user_id`                  | Ambil aplikasi per user  |
| `GET`    | `/ja/:job_id`                   | Ambil aplikasi per job   |
| `POST`   | `/aj/`                          | Buat aplikasi baru       |
| `PUT`    | `/ua/:id/status`                | Update status aplikasi   |
| `DELETE` | `/da/:id`                       | Hapus aplikasi           |
| `POST`   | `/uf`                           | Upload file cover letter |
| `DELETE` | `/df/:filename/:application_id` | Hapus file upload        |

---

### 📊 Recruiter Dashboard (`/api/recruiter`)

| Method | Endpoint | Deskripsi                      |
| ------ | -------- | ------------------------------ |
| `GET`  | `/board` | Ambil data dashboard recruiter |

---

## 🔒 Middleware

- `verifyToken` → Verifikasi JWT untuk route yang memerlukan login.
- `upload.single("cover_letter")` → Upload file cover letter.

---

## 📤 Upload File

File akan disimpan di folder `/uploads` (atau bisa disesuaikan jika pakai cloud seperti S3 atau Cloudinary).
Pastikan folder **uploads** ada di root project:

```bash
mkdir uploads
```

---

## 🧪 Testing dengan Postman

1. Import collection Postman dari folder `/docs` (jika ada).
2. Set **Authorization Type = Bearer Token** untuk route yang butuh `verifyToken`.

---

## 🧰 Scripts

| Perintah       | Deskripsi                      |
| -------------- | ------------------------------ |
| `npm run dev`  | Jalankan server dengan nodemon |
| `npm start`    | Jalankan server produksi       |
| `npm run lint` | Cek format & style code        |

---

## 🧑‍💻 Kontributor

| Nama          | Peran                             |
| ------------- | --------------------------------- |
| Adia Ginansah | Backend Developer & Project Owner |

---

## 📜 Lisensi

Lisensi: **MIT License**
Copyright © 2025
adyamakes.tech@gmail.com
