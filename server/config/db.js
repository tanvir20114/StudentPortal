const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("xyzStudentPortal");

const studentsCollection = db.collection("students");
const transactionsCollection = db.collection("transactions");
const waiversCollection = db.collection("waivers");
const examClearanceCollection = db.collection("examClearance");
const registeredCoursesCollection = db.collection("registeredCourses");
const availableCoursesCollection = db.collection("availableCourses");
const courseCartCollection = db.collection("courseCart");
const academicResultCollection = db.collection("academicResult");
const classRoutineCollection = db.collection("classRoutine");
const liveResultsCollection = db.collection("liveResults");
const teachingEvaluationCollection = db.collection("teachingEvaluation");
const convocationCollection = db.collection("convocation");
const notificationsCollection = db.collection("notifications");
const attendanceCollection = db.collection("attendance");
const calendarEventsCollection = db.collection("calendarEvents");
const noticesCollection = db.collection("notices");
const scholarshipApplicationsCollection = db.collection("scholarshipApplications");
const availableScholarshipsCollection = db.collection("availableScholarships");
const certificateRequestsCollection = db.collection("certificateRequests");
const certificateDocumentTypesCollection = db.collection("certificateDocumentTypes");
const learningResourcesCollection = db.collection("learningResources");
const helpDeskTicketsCollection = db.collection("helpDeskTickets");
const transportApplicationsCollection = db.collection("transportApplications");
const transportRoutesCollection = db.collection("transportRoutes");

const connectDB = client
  .connect()
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => alert("MongoDB connection failed:", error));

module.exports = {
  client,
  connectDB,
  ObjectId,
  studentsCollection,
  transactionsCollection,
  waiversCollection,
  examClearanceCollection,
  registeredCoursesCollection,
  availableCoursesCollection,
  courseCartCollection,
  academicResultCollection,
  classRoutineCollection,
  liveResultsCollection,
  teachingEvaluationCollection,
  convocationCollection,
  notificationsCollection,
  attendanceCollection,
  calendarEventsCollection,
  noticesCollection,
  scholarshipApplicationsCollection,
  availableScholarshipsCollection,
  certificateRequestsCollection,
  certificateDocumentTypesCollection,
  learningResourcesCollection,
  helpDeskTicketsCollection,
  transportApplicationsCollection,
  transportRoutesCollection,
};
