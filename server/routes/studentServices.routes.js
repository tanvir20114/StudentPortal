const express = require("express");
const router = express.Router();
const { connectDB, helpDeskTicketsCollection } = require("../config/db");
const { verifyFirebaseToken, verifyTokenEmail, writeLimiter } = require("../middleware/auth");

router.get("/", verifyFirebaseToken, verifyTokenEmail, async (req, res) => {
  await connectDB;
  const email = req.query.email;
  const tickets = await helpDeskTicketsCollection.find({ email }).sort({ createdOn: -1 }).toArray();
  res.send({ tickets });
});

router.post("/", verifyFirebaseToken, writeLimiter, async (req, res) => {
  await connectDB;
  const email = req.decoded.email;
  const { category, subject, details, priority = "Normal" } = req.body;
  if (!subject || !subject.trim()) {
    return res.status(400).send({ message: "Subject is required" });
  }

  const count = await helpDeskTicketsCollection.countDocuments();
  const newTicket = {
    ticketRef: `TCK-${1000 + count + 1}`,
    email,
    category,
    subject: subject.trim(),
    details,
    priority,
    status: "open",
    createdOn: new Date().toISOString().slice(0, 10),
    lastUpdate: "Ticket received, awaiting review.",
  };
  const result = await helpDeskTicketsCollection.insertOne(newTicket);
  res.send({ ...newTicket, _id: result.insertedId });
});

module.exports = router;
