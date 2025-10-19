# Backend (Express + MVC) - Events API

Minimal Express MVC app with:
- User register (email verification), login (JWT)
- Event CRUD (create/list/get/update/delete)
- Password hashing with bcrypt
- Email via SMTP (optional)

Quick start
1. Copy `.env.example` to `.env` and fill values.
2. Install deps: npm install
3. `npm sequelize db:migrate` for migrate tables to db
3. Start server: npm run dev

API
- POST /api/auth/register {name,email,password}
- GET /api/auth/verify?token=...
- POST /api/auth/login {email,password} -> {token}
- GET /api/events
- GET /api/events/:id
- POST /api/events (Authorization: Bearer <token>) {title,date,description}
- PUT /api/events/:id (Authorization) {title,date,description}
- DELETE /api/events/:id (Authorization)
