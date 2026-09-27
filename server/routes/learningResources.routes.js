const express = require("express");
const router = express.Router();
const { connectDB, learningResourcesCollection } = require("../config/db");
const { verifyFirebaseToken } = require("../middleware/auth");

router.get("/", verifyFirebaseToken, async (req, res) => {
  await connectDB;
  const resources = await learningResourcesCollection.find().toArray();
  const courses = ["All Courses", ...new Set(resources.map((r) => r.course))];
  res.send({ courses, resources });
});

module.exports = router;
