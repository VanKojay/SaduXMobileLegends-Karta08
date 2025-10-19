
# 🏆 SaduXMobileLegends-Karta08

Platform manajemen turnamen Mobile Legends berbasis web dengan arsitektur **React (Vite)** di frontend dan **Node.js (Express)** di backend.  
Dilengkapi dengan sistem **pendaftaran, verifikasi email, halaman admin approval, dan live bracket realtime** menggunakan WebSocket.

---

## 📘 1. Deskripsi Proyek

**SaduXMobileLegends-Karta08** adalah platform yang memungkinkan pengguna untuk:
- Melihat informasi turnamen (landing page)
- Mendaftar sebagai peserta
- Melakukan verifikasi email
- Login melalui modal form
- Mengelola peserta melalui admin panel
- Melihat bagan pertandingan secara realtime

---

## 🧱 2. Arsitektur dan Teknologi

| Komponen | Teknologi | Keterangan |
|----------|------------|------------|
| **Frontend (Client)** | React + Vite + TailwindCSS | UI cepat dan modern |
| **Backend (API)** | Node.js + Express | REST API utama |
| **Database** | MySQL | Menyimpan data peserta & turnamen |
| **Authentication** | JWT | Login user & admin |
| **Email Service** | Nodemailer + SMTP | Untuk verifikasi email |
| **Realtime Communication** | Socket.IO | Untuk update bagan pertandingan secara langsung |
| **Deployment** | Docker + Nginx | Untuk production |
| **Version Control** | Git + GitHub | Kolaborasi dan versioning |

---

## 🧭 3. Flow Aplikasi

### 🏠 Landing Page
- Hero section + deskripsi turnamen
- Tombol "Daftar Sekarang" membuka modal login/register
- Form pendaftaran → kirim data → backend kirim email verifikasi

### 📧 Email Verifikasi
- Pengguna menerima email dengan link `/verify?token=xxxxx`
- Klik link → backend ubah `isVerified = true`

### 🔐 Login Modal
- Login tanpa pindah halaman
- Token JWT disimpan di localStorage / cookie

### 👨‍💼 Admin Dashboard
- Login khusus admin
- Halaman:
  - Dashboard statistik
  - Daftar peserta (Approve/Reject)
  - Manajemen bracket

### ⚔️ Live Bracket (Realtime)
- Halaman publik dengan bagan realtime menggunakan **Socket.IO**
- Admin update skor → broadcast ke semua client

---

## 🧩 4. Struktur Folder

```
SaduXMobileLegends-Karta08/
├── frontend/           # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   ├── vite.config.js
│   └── package.json
│
├── backend/            # Node.js + Express
│   ├── src/
│   │   ├── config/     # db.js, dotenv.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── utils/      # email, socket, etc
│   │   ├── server.js
│   │   └── app.js
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🧠 5. Modul dan Fungsi

| Modul | Deskripsi | Teknologi |
|--------|------------|------------|
| **Auth Module** | Login, Register, JWT, Email verification | Express, Nodemailer, JWT |
| **User Module** | Menyimpan data peserta | Express + MySQL |
| **Admin Module** | Approve/reject peserta | Express + JWT Middleware |
| **Tournament Module** | Bracket + live update | Socket.IO + MySQL |
| **Frontend UI** | Landing page, modal, form | React + Tailwind + Axios |
| **Realtime Update** | Update live bracket | Socket.IO client |

---

## 🔒 6. Keamanan Dasar

- Hash password dengan **bcrypt**
- Validasi input menggunakan **Joi/Zod**
- Token JWT disimpan di cookie **httpOnly**
- Rate limiting untuk endpoint register
- Sanitasi data (hindari XSS/SQL Injection)

---

## 🚀 7. Tahapan Pengembangan

| Tahap | Deskripsi | Target |
|--------|------------|--------|
| Step 1 | Setup project structure (React, Express, MySQL) | 1 hari |
| Step 2 | Buat landing page + modal login/register | 2 hari |
| Step 3 | Backend Auth + Email verification | 2 hari |
| Step 4 | Halaman Admin dashboard | 2 hari |
| Step 5 | Sistem bracket + Socket.IO realtime | 3 hari |
| Step 6 | Integrasi front-backend + testing | 2 hari |
| Step 7 | Deployment (Docker + Nginx) | 1 hari |

---

## 🧩 8. Diagram Flow (Deskripsi)

1. User buka landing page → klik "Daftar"
2. Isi form → backend kirim email verifikasi
3. Klik link → akun aktif
4. Admin login → approve peserta
5. Turnamen mulai → sistem generate bracket
6. Admin update skor → update realtime (Socket.IO)
7. User melihat live bracket tanpa reload

---

## ✅ 9. Optional Feature

- Login via Google OAuth
- Upload logo tim & foto pemain (S3)
- Statistik pertandingan
- Auto-generate bracket visual (pakai `react-brackets`)

---

## 📦 10. Environment Variables (.env Example)

```
# Backend
PORT=3000
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=sadux_tournament
JWT_SECRET=your_jwt_secret
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=yourpassword

# Frontend
VITE_API_URL=http://localhost:3000/api
```

---

## 💡 Catatan Akhir

Struktur dan dokumentasi ini disusun agar proyek **SaduXMobileLegends-Karta08** bisa dikembangkan bersama AI dan manusia dengan workflow yang jelas, modular, dan maintainable.
