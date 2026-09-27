const express = require("express");
const router = express.Router();
const {
  connectDB,
  scholarshipApplicationsCollection,
  availableScholarshipsCollection,
  studentsCollection,
} = require("../config/db");
const { verifyFirebaseToken, verifyTokenEmail, writeLimiter } = require("../middleware/auth");

router.get("/", verifyFirebaseToken, verifyTokenEmail, async (req, res) => {
  await connectDB;
  const email = req.query.email;
  const [availableScholarships, applicationHistory, student] = await Promise.all([
    availableScholarshipsCollection.find().toArray(),
    scholarshipApplicationsCollection.find({ email }).sort({ appliedOn: -1 }).toArray(),
    studentsCollection.findOne({ email }),
  ]);
  res.send({
    cgpa: student?.cgpa ?? null,
    availableScholarships,
    applicationHistory,
  });
});

router.post("/apply", verifyFirebaseToken, writeLimiter, async (req, res) => {
  await connectDB;
  const email = req.decoded.email;
  const { name, semester, note } = req.body;
  if (!name) return res.status(400).send({ message: "Scholarship name is required" });

  const already = await scholarshipApplicationsCollection.findOne({ email, name, status: "pending" });
  if (already) {
    return res.status(400).send({ message: "একটা আবেদন ইতিমধ্যে পেন্ডিং আছে এই স্কলারশিপের জন্য।" });
  }

  const newEntry = {
    email,
    name,
    semester: semester || "Summer 2026",
    status: "pending",
    coverage: "—",
    appliedOn: new Date().toISOString().slice(0, 10),
    remarks: note || undefined,
  };
  const result = await scholarshipApplicationsCollection.insertOne(newEntry);
  res.send({ ...newEntry, _id: result.insertedId });
});

module.exports = router;
