require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
const port = process.env.PORT;

require("./config/firebase");

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("XYZ University Student Portal server is running");
});

app.use("/students", require("./routes/student.routes"));
app.use("/transactions", require("./routes/transactions.routes"));
app.use("/waivers", require("./routes/waiver.routes"));
app.use("/exam-clearance", require("./routes/examClearance.routes"));
app.use("/registered-courses", require("./routes/registeredCourses.routes"));
app.use("/course-registration", require("./routes/courseRegistration.routes"));
app.use("/academic-result", require("./routes/academicResult.routes"));
app.use("/routine", require("./routes/routine.routes"));
app.use("/live-results", require("./routes/liveResult.routes"));
app.use("/teaching-evaluation", require("./routes/teachingEvaluation.routes"));
app.use("/convocation", require("./routes/convocation.routes"));
app.use("/notifications", require("./routes/notifications.routes"));
app.use("/attendance", require("./routes/attendance.routes"));
app.use("/academic-calendar", require("./routes/calendar.routes"));
app.use("/notices", require("./routes/notice.routes"));
app.use("/scholarship", require("./routes/scholarship.routes"));
app.use("/certificate-transcript", require("./routes/certificate.routes"));
app.use("/learning-resources", require("./routes/learningResources.routes"));
app.use("/student-services", require("./routes/studentServices.routes"));
app.use("/transport-card", require("./routes/transport.routes"));

app.listen(port, () => {
  console.log(`XYZ Student Portal server running on port ${port}`);
});

module.exports = app;
