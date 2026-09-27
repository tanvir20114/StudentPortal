const express = require("express");
const router = express.Router();
const {
  connectDB,
  availableCoursesCollection,
  courseCartCollection,
  ObjectId,
} = require("../config/db");
const { verifyFirebaseToken, verifyTokenEmail, writeLimiter } = require("../middleware/auth");

const CREDIT_LIMIT = 15;

router.get("/available", verifyFirebaseToken, async (req, res) => {
  await connectDB;
  const { semester } = req.query;
  const query = semester && semester !== "All" ? { semester } : {};
  const result = await availableCoursesCollection.find(query).toArray();
  res.send(result);
});

router.get("/cart", verifyFirebaseToken, verifyTokenEmail, async (req, res) => {
  await connectDB;
  const email = req.query.email;
  const result = await courseCartCollection.find({ email }).toArray();
  res.send(result);
});

router.post("/cart", verifyFirebaseToken, writeLimiter, async (req, res) => {
  await connectDB;
  const email = req.decoded.email;
  const { courseId } = req.body;
  if (!courseId) return res.status(400).send({ message: "courseId is required" });

  let course;
  try {
    course = await availableCoursesCollection.findOne({ _id: new ObjectId(courseId) });
  } catch {
    return res.status(400).send({ message: "Invalid courseId" });
  }
  if (!course) return res.status(404).send({ message: "Course not found" });

  const already = await courseCartCollection.findOne({ email, code: course.code });
  if (already) {
    return res.status(400).send({ message: `${course.code} ইতিমধ্যে রেজিস্টার্ড।` });
  }
  if (course.seatFilled >= course.seatTotal) {
    return res.status(400).send({ message: `${course.code} এ কোনো সিট খালি নেই।` });
  }

  const cart = await courseCartCollection.find({ email }).toArray();
  const totalCredit = cart.reduce((s, c) => s + c.credit, 0);
  if (totalCredit + course.credit > CREDIT_LIMIT) {
    return res.status(400).send({ message: `Credit limit (${CREDIT_LIMIT}) অতিক্রম করছে।` });
  }

  const newEntry = {
    email,
    code: course.code,
    title: course.title,
    credit: course.credit,
    semester: course.semester,
  };
  const result = await courseCartCollection.insertOne(newEntry);
  await availableCoursesCollection.updateOne({ _id: course._id }, { $inc: { seatFilled: 1 } });
  res.send({ ...newEntry, _id: result.insertedId });
});

router.delete("/cart/:id", verifyFirebaseToken, writeLimiter, async (req, res) => {
  await connectDB;
  const email = req.decoded.email;
  let entry;
  try {
    entry = await courseCartCollection.findOne({ _id: new ObjectId(req.params.id) });
  } catch {
    return res.status(400).send({ message: "Invalid id" });
  }
  if (!entry || entry.email !== email) {
    return res.status(403).send({ message: "forbidden access" });
  }
  await courseCartCollection.deleteOne({ _id: new ObjectId(req.params.id) });
  await availableCoursesCollection.updateOne({ code: entry.code }, { $inc: { seatFilled: -1 } });
  res.send({ deletedCount: 1 });
});

module.exports = router;
