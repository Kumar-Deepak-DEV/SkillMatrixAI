const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;

  next();
};

const isTrainer = (req, res, next) => {
  if (req.user.role !== "TRAINER") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

module.exports = { protect, isTrainer };