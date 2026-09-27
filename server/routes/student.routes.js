const express = require("express");
const router = express.Router();
const { connectDB, studentsCollection } = require("../config/db");
const { verifyFirebaseToken, verifyTokenEmail } = require("../middleware/auth");

router.get("/profile", verifyFirebaseToken, verifyTokenEmail, async (req, res) => {
  await connectDB;
  const email = req.query.email;
  const student = await studentsCollection.findOne({ email });
  res.send(student || { email, name: "New Student", studentId: "N/A" });
});

module.exports = router;
