const express = require("express");
const router = express.Router();
const {
  connectDB,
  certificateRequestsCollection,
  certificateDocumentTypesCollection,
  ObjectId,
} = require("../config/db");
const { verifyFirebaseToken, verifyTokenEmail, writeLimiter } = require("../middleware/auth");

router.get("/", verifyFirebaseToken, verifyTokenEmail, async (req, res) => {
  await connectDB;
  const email = req.query.email;
  const [documentTypes, requests] = await Promise.all([
    certificateDocumentTypesCollection.find().toArray(),
    certificateRequestsCollection.find({ email }).sort({ requestedOn: -1 }).toArray(),
  ]);
  res.send({ documentTypes, requests });
});

router.post("/", verifyFirebaseToken, writeLimiter, async (req, res) => {
  await connectDB;
  const email = req.decoded.email;
  const { documentTypeId, quantity = 1, delivery = "Pickup" } = req.body;

  let docType;
  try {
    docType = await certificateDocumentTypesCollection.findOne({ _id: new ObjectId(documentTypeId) });
  } catch {
    return res.status(400).send({ message: "Invalid documentTypeId" });
  }
  if (!docType) return res.status(404).send({ message: "Document type not found" });

  const fee = docType.fee * quantity + (delivery === "Courier" ? 150 : 0);
  const newRequest = {
    email,
    type: docType.name,
    quantity,
    delivery,
    fee,
    status: "processing",
    requestedOn: new Date().toISOString().slice(0, 10),
  };
  const result = await certificateRequestsCollection.insertOne(newRequest);
  res.send({ ...newRequest, _id: result.insertedId });
});

module.exports = router;
