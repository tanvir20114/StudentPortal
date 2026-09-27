const express = require("express");
const router = express.Router();
const { connectDB, teachingEvaluationCollection, ObjectId } = require("../config/db");
const { verifyFirebaseToken, verifyTokenEmail, writeLimiter } = require("../middleware/auth");


const EVALUATION_QUESTIONS = [
  "The instructor explained topics clearly and effectively.",
  "The instructor was well prepared for each class.",
  "The instructor encouraged questions and discussion.",
  "Course materials (slides, notes, references) were helpful.",
  "The instructor was punctual and available during office hours.",
  "Overall, I am satisfied with this course.",
];

router.get("/", verifyFirebaseToken, verifyTokenEmail, async (req, res) => {
  await connectDB;
  const email = req.query.email;
  const courses = await teachingEvaluationCollection.find({ email }).toArray();
  res.send({ deadline: "2026-07-20", questions: EVALUATION_QUESTIONS, courses });
});

router.post("/:id/submit", verifyFirebaseToken, writeLimiter, async (req, res) => {
  await connectDB;
  const { ratings, comment } = req.body;
  let evalDoc;
  try {
    evalDoc = await teachingEvaluationCollection.findOne({ _id: new ObjectId(req.params.id) });
  } catch {
    return res.status(400).send({ message: "Invalid id" });
  }
  if (!evalDoc || evalDoc.email !== req.decoded.email) {
    return res.status(403).send({ message: "forbidden access" });
  }
  if (evalDoc.status === "submitted") {
    return res.status(400).send({ message: "Already submitted" });
  }
  const result = await teachingEvaluationCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { status: "submitted", ratings, comment, submittedAt: new Date().toISOString() } }
  );
  res.send(result);
});

module.exports = router;
