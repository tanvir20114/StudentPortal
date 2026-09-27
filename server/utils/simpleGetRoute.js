const express = require("express");
const { connectDB } = require("../config/db");
const { verifyFirebaseToken, verifyTokenEmail } = require("../middleware/auth");


function makeEmailScopedRouter(collection, options = {}) {
  const router = express.Router();
  const { single = false, sortField, sortOrder = 1 } = options;

  router.get("/", verifyFirebaseToken, verifyTokenEmail, async (req, res) => {
    await connectDB;
    const email = req.query.email;
    if (!email) return res.status(400).send({ message: "email query param is required" });

    if (single) {
      const result = await collection.findOne({ email });
      return res.send(result || null);
    }

    let cursor = collection.find({ email });
    if (sortField) cursor = cursor.sort({ [sortField]: sortOrder });
    const result = await cursor.toArray();
    res.send(result);
  });

  return router;
}

module.exports = makeEmailScopedRouter;
