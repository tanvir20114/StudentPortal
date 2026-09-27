const express = require("express");
const router = express.Router();
const { connectDB, notificationsCollection, ObjectId } = require("../config/db");
const { verifyFirebaseToken, verifyTokenEmail } = require("../middleware/auth");

router.get("/", verifyFirebaseToken, verifyTokenEmail, async (req, res) => {
  await connectDB;
  const email = req.query.email;
  const result = await notificationsCollection.find({ email }).sort({ time: -1 }).toArray();
  res.send(result);
});

router.patch("/:id/read", verifyFirebaseToken, async (req, res) => {
  await connectDB;
  const notif = await notificationsCollection.findOne({ _id: new ObjectId(req.params.id) });
  if (!notif || notif.email !== req.decoded.email) {
    return res.status(403).send({ message: "forbidden access" });
  }
  const result = await notificationsCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { read: true } }
  );
  res.send(result);
});

router.patch("/read-all", verifyFirebaseToken, async (req, res) => {
  await connectDB;
  const result = await notificationsCollection.updateMany(
    { email: req.decoded.email },
    { $set: { read: true } }
  );
  res.send(result);
});

module.exports = router;
