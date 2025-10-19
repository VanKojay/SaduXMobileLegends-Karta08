import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "shhhhh";

export const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing token" });
  const parts = auth.split(" ");
  if (parts.length !== 2) return res.status(401).json({ message: "Invalid token" });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type === "member") {
      req.user = { id: payload.id, id_member: payload.id_member, email_member: payload.email_member, type: payload.type };
    } else {
      req.user = { id: payload.id, email: payload.email, type: payload.type };
    }
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isNotMemberAllowedMiddleware = (req, res, next) => {
  if (req.user.type === "member") return res.status(403).json({ message: "Forbidden" });
  next();
}

export const isAdminAllowedMiddleware = (req, res, next) => {
  if (req.user.type !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
}