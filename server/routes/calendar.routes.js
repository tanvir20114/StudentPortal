const express = require("express");
const router = express.Router();
const { connectDB, calendarEventsCollection } = require("../config/db");
const { verifyFirebaseToken } = require("../middleware/auth");

router.get("/", verifyFirebaseToken, async (req, res) => {
  await connectDB;
  const result = await calendarEventsCollection.find().sort({ date: 1 }).toArray();
  res.send(result);
});

module.exports = router;
