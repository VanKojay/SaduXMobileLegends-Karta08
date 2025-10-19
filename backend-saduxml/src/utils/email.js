import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM = process.env.EMAIL_FROM || "no-reply@example.com";

let transporter;
if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export const sendVerificationEmail = async (to, token) => {
  if (!transporter) {
    console.warn("SMTP not configured; skipping email to", to);
    return;
  }

  const url = `${process.env.APP_URL || "http://localhost:5000"}/api/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Verify your email",
    text: `Click to verify: ${url}`,
    html: `<p>Click to verify: <a href="${url}">${url}</a></p>`,
  });
};
