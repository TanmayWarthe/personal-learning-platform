const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
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

function optionalAuthMiddleware(req, res, next) {
  const bearer = req.headers.authorization?.split(" ")[1];
  const token = req.cookies?.token || bearer;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      req.user = null;
    }
  }
  next();
}

module.exports = authMiddleware;
module.exports.optional = optionalAuthMiddleware;
