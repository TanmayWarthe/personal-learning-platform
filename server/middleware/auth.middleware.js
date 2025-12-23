const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // Prefer HTTP-only cookie set by backend; fallback to bearer header
  const bearer = req.headers.authorization?.split(" ")[1];
  const token = req.cookies?.token || bearer;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
