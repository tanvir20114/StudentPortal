const express = require("express");
const router = express.Router();
const {
  connectDB,
  transportApplicationsCollection,
  transportRoutesCollection,
} = require("../config/db");
const { verifyFirebaseToken, verifyTokenEmail, writeLimiter } = require("../middleware/auth");

router.get("/", verifyFirebaseToken, verifyTokenEmail, async (req, res) => {
  await connectDB;
  const email = req.query.email;
  const [routesData, application] = await Promise.all([
    transportRoutesCollection.find().toArray(),
    transportApplicationsCollection.findOne({ email }),
  ]);
  const pickupPoints = {};
  routesData.forEach((r) => {
    pickupPoints[r.name] = r.pickupPoints || [];
  });
  res.send({
    routes: routesData,
    pickupPoints,
    currentStatus: application?.status || "none",
    defaultForm: application || null,
  });
});

router.post("/apply", verifyFirebaseToken, writeLimiter, async (req, res) => {
  await connectDB;
  const email = req.decoded.email;
  const { route, pickup, semester, paymentMethod } = req.body;
  if (!route || !pickup) {
    return res.status(400).send({ message: "route and pickup are required" });
  }

  const application = {
    email,
    route,
    pickup,
    semester,
    paymentMethod: paymentMethod || "bKash",
    status: "pending",
    appliedOn: new Date().toISOString().slice(0, 10),
  };
  await transportApplicationsCollection.updateOne({ email }, { $set: application }, { upsert: true });
  res.send(application);
});

module.exports = router;
