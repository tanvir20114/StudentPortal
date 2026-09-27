const admin = require("../config/firebase");
const rateLimit = require("express-rate-limit");

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (decoded.email) {
      decoded.email = decoded.email.toLowerCase();
    }
    req.decoded = decoded; 
    next();
  } catch (error) {
    return res.status(401).send({ message: "unauthorized access" });
  }
};

const verifyTokenEmail = (req, res, next) => {
  const rawEmail = req.query.email || req.body?.email;
  const email = rawEmail ? rawEmail.toLowerCase() : rawEmail;

  if (email && email !== req.decoded.email) {
    return res.status(403).send({ message: "forbidden access" });
  }

  if (req.query.email) req.query.email = email;
  if (req.body?.email) req.body.email = email;

  next();
};

const writeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  message: { message: "Too many requests, please try again later." },
});

module.exports = { verifyFirebaseToken, verifyTokenEmail, writeLimiter };