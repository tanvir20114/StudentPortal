require("dotenv").config();
const { MongoClient } = require("mongodb");

const collectionsWithEmail = [
  "students", "transactions", "waivers", "examClearance",
  "registeredCourses", "courseCart", "academicResult", "classRoutine",
  "liveResults", "teachingEvaluation", "convocation", "notifications",
  "attendance", "scholarshipApplications", "certificateRequests",
  "helpDeskTickets", "transportApplications",
];

async function run() {
  const client = new MongoClient(process.env.URI);
  await client.connect();
  const db = client.db("xyzStudentPortal");

  for (const name of collectionsWithEmail) {
    const col = db.collection(name);
    const docs = await col.find({ email: { $exists: true } }).toArray();
    for (const doc of docs) {
      const lower = doc.email.toLowerCase();
      if (lower !== doc.email) {
        await col.updateOne({ _id: doc._id }, { $set: { email: lower } });
      }
    }
    console.log(`✔ ${name}: ${docs.length} checked`);
  }

  await db.collection("students").updateMany({}, [
    { $set: { emails: { $map: { input: "$emails", as: "e", in: { $toLower: "$$e" } } } } }
  ]);

  await client.close();
  console.log("Done ✅");
}
run();