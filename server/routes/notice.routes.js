const express = require("express");
const router = express.Router();
const { connectDB, noticesCollection } = require("../config/db");
const { verifyFirebaseToken } = require("../middleware/auth");

router.get("/", verifyFirebaseToken, async (req, res) => {
  await connectDB;
  const result = await noticesCollection.find().sort({ pinned: -1, date: -1 }).toArray();
  res.send(result);
});

module.exports = router;
