const express = require("express");
const router = express.Router();
const { connectDB, waiversCollection } = require("../config/db");
const { verifyFirebaseToken, verifyTokenEmail, writeLimiter } = require("../middleware/auth");

router.get("/", verifyFirebaseToken, verifyTokenEmail, async (req, res) => {
  await connectDB;
  const email = req.query.email;
  const result = await waiversCollection.find({ email }).sort({ appliedOn: -1 }).toArray();
  res.send(result);
});

router.post("/", verifyFirebaseToken, writeLimiter, async (req, res) => {
  await connectDB;
  const { semester, type, percentage, amountOn, remarks } = req.body;
  if (!semester || !type || percentage === undefined) {
    return res.status(400).send({ message: "semester, type and percentage are required" });
  }
  const newWaiver = {
    email: req.decoded.email,
    semester,
    type,
    percentage: Number(percentage),
    amountOn: Number(amountOn) || 45000,
    status: "pending",
    appliedOn: new Date().toISOString().slice(0, 10),
    remarks: remarks || "—",
  };
  const result = await waiversCollection.insertOne(newWaiver);
  res.send({ ...newWaiver, _id: result.insertedId });
});

module.exports = router;
