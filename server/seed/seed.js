
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(process.env.URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

async function seed() {
  await client.connect();
  const db = client.db("xyzStudentPortal");

  const students = [
    {
      email: "Sakib35-1122@gmail.com",
      name: "Sakib Ahmed Shanto",
      studentId: "01812345678",
      registrationId: "221-35-1122",
      batch: 38,
      shift: "MORNING",
      campus: "DSC",
      program: "B.Sc. in Software Engineering",
      department: "Software Engineering",
      faculty: "Faculty of Science & Information Technology",
      section: "38-A",
      status: "Active",
      phone: "01911223344",
      emails: ["Sakib35-1122@gmail.com", "Sakib.Ahmed@gmail.com"],
      gender: "male",
      bloodGroup: "B+",
      issueDate: "2022-01-22",
      expireDate: "2026-08-31",
      cgpa: 3.07,
      personalInfo: {
        fullName: "Sakib Ahmed Shanto",
        fatherName: "MD. KAMAL HOSSAIN",
        motherName: "MST. SHIRIN AKTER",
        dateOfBirth: "2002-03-09",
        gender: "male",
        bloodGroup: "B+",
        nationality: "Bangladeshi",
        religion: "Islam",
      },
      academicInfo: {
        program: "B.Sc. in Software Engineering",
        department: "Software Engineering",
        batch: 38,
        shift: "Morning",
        campus: "DSC",
      },
      addressInfo: {
        presentAddress: "Flat 3B, Road 7, Dhanmondi, Dhaka",
        permanentAddress: "Village: Sadarpur, Comilla",
        district: "Comilla",
        division: "Chattogram",
        postalCode: "3500",
      },
    },
    {
      email: "Maruf35-1079@gmail.com",
      name: "Maruf Hasan",
      studentId: "01788645278",
      registrationId: "221-35-1079",
      batch: 38,
      shift: "MORNING",
      campus: "DSC",
      program: "B.Sc. in Software Engineering",
      department: "Software Engineering",
      faculty: "Faculty of Science & Information Technology",
      section: "38-A",
      status: "Active",
      phone: "01910793344",
      emails: ["Maruf35-1079@gmail.com", "Maruf.Hasan@gmail.com"],
      gender: "male",
      bloodGroup: "A+",
      issueDate: "2022-01-22",
      expireDate: "2026-08-31",
      cgpa: 2.0,
      personalInfo: {
        fullName: "Maruf Hasan",
        fatherName: "MD. ABDUL ALIM",
        motherName: "MST. NAFISA ISLAM",
        dateOfBirth: "2001-08-27",
        gender: "male",
        bloodGroup: "A+",
        nationality: "Bangladeshi",
        religion: "Islam",
      },
      academicInfo: {
        program: "B.Sc. in Software Engineering",
        department: "Software Engineering",
        batch: 38,
        shift: "Morning",
        campus: "DSC",
      },
      addressInfo: {
        presentAddress: "Flat 3B, Road 7, Dhanmondi, Dhaka",
        permanentAddress: "Village: Sadarpur, Comilla",
        district: "Comilla",
        division: "Chattogram",
        postalCode: "3500",
      },
    },
  ];

  const emails = students.map((s) => s.email);

  const transactions = emails.flatMap((email) => [
    { email, date: "2022-01-24", semester: "Spring 2022", particulars: "Admission Fee", debit: 15000, credit: 0, method: "Cash", status: "posted" },
    { email, date: "2022-01-27", semester: "Spring 2022", particulars: "Tuition Fee (Semester 1)", debit: 45000, credit: 0, method: "Bank", status: "posted" },
    { email, date: "2022-01-30", semester: "Spring 2022", particulars: "Scholarship Waiver (50%)", debit: 0, credit: 22500, method: "Waiver", status: "posted" },
    { email, date: "2022-02-10", semester: "Spring 2022", particulars: "Payment Received", debit: 0, credit: 22500, method: "bKash", status: "posted" },
    { email, date: "2026-06-25", semester: "Summer 2026", particulars: "Tuition Fee (Semester 8)", debit: 45000, credit: 0, method: "Bank", status: "pending" },
  ]);

  const waivers = emails.flatMap((email) => [
    { email, semester: "Spring 2022", type: "Merit Scholarship", percentage: 50, amountOn: 45000, status: "approved", appliedOn: "2022-01-08", remarks: "SSC/HSC GPA 5.00, admission merit scholarship" },
    { email, semester: "Summer 2026", type: "Merit Scholarship", percentage: 50, amountOn: 45000, status: "pending", appliedOn: "2026-06-05", remarks: "CGPA maintained above 3.80 throughout, renewal application" },
  ]);

  const examClearance = emails.map((email) => ({
    email,
    semester: "Summer 2026",
    departments: [
      { id: 1, name: "Accounts / Finance", iconKey: "wallet", status: "cleared", remarks: "No outstanding dues", updatedOn: "2026-07-01" },
      { id: 2, name: "Library", iconKey: "library", status: "cleared", remarks: "No books/fine pending", updatedOn: "2026-06-28" },
      { id: 3, name: "Department (Software Engineering)", iconKey: "building", status: "cleared", remarks: "Attendance & CT requirements met", updatedOn: "2026-06-30" },
      { id: 4, name: "Lab Clearance", iconKey: "flask", status: "pending", remarks: "Lab equipment return awaiting confirmation", updatedOn: "—" },
      { id: 5, name: "Discipline / Proctor Office", iconKey: "shield", status: "cleared", remarks: "No disciplinary record", updatedOn: "2026-06-29" },
    ],
  }));

  const registeredCourses = emails.flatMap((email) => [
    { email, code: "SWE 3103", title: "Software Requirement Engineering", credit: 3.0, section: "38-A", faculty: "Dr. Farhana Alam", schedule: "Sun, Tue — 08:30 AM", room: "Room 402, DSC", type: "Theory" },
    { email, code: "SWE 3104", title: "Software Requirement Engineering Lab", credit: 1.0, section: "38-A", faculty: "Md. Rakibul Hasan", schedule: "Thu — 02:00 PM", room: "Lab 3, DSC", type: "Lab" },
    { email, code: "SWE 3201", title: "Software Design Patterns", credit: 3.0, section: "38-A", faculty: "Prof. Dr. Kamrul Islam", schedule: "Mon, Wed — 10:00 AM", room: "Room 305, DSC", type: "Theory" },
    { email, code: "CSE 3255", title: "Computer Networks", credit: 3.0, section: "38-A", faculty: "Dr. Sakib Ahmed", schedule: "Sun, Tue — 11:30 AM", room: "Room 210, DSC", type: "Theory" },
    { email, code: "CSE 3256", title: "Computer Networks Lab", credit: 1.0, section: "38-A", faculty: "Md. Shakil Ahmed", schedule: "Wed — 02:00 PM", room: "Lab 5, DSC", type: "Lab" },
    { email, code: "GED 3101", title: "Bangladesh Studies", credit: 2.0, section: "38-A", faculty: "Ms. Sabrina Yasmin", schedule: "Mon — 01:00 PM", room: "Room 108, DSC", type: "Theory" },
  ]);

  const academicResult = emails.flatMap((email) => [
    {
      email, semester: "Spring 2022", sgpa: 3.75, order: 1,
      courses: [
        { code: "CSE 1101", title: "Structured Programming Language", credit: 3.0, grade: "A", point: 4.0 },
        { code: "CSE 1102", title: "Structured Programming Language Lab", credit: 1.0, grade: "A", point: 4.0 },
        { code: "MAT 1101", title: "Differential & Integral Calculus", credit: 3.0, grade: "B+", point: 3.5 },
        { code: "GED 1101", title: "English Fundamentals", credit: 2.0, grade: "A-", point: 3.7 },
      ],
    },
    {
      email, semester: "Summer 2022", sgpa: 3.62, order: 2,
      courses: [
        { code: "CSE 1201", title: "Data Structures", credit: 3.0, grade: "A-", point: 3.7 },
        { code: "CSE 1202", title: "Data Structures Lab", credit: 1.0, grade: "A", point: 4.0 },
        { code: "MAT 1201", title: "Linear Algebra", credit: 3.0, grade: "B+", point: 3.5 },
        { code: "PHY 1101", title: "Physics", credit: 3.0, grade: "B", point: 3.0 },
      ],
    },
    {
      email, semester: "Spring 2023", sgpa: 3.88, order: 3,
      courses: [
        { code: "CSE 2101", title: "Algorithms", credit: 3.0, grade: "A", point: 4.0 },
        { code: "CSE 2102", title: "Algorithms Lab", credit: 1.0, grade: "A", point: 4.0 },
        { code: "SWE 2101", title: "Object Oriented Design", credit: 3.0, grade: "A-", point: 3.7 },
        { code: "GED 2101", title: "Sociology", credit: 2.0, grade: "A", point: 4.0 },
      ],
    },
    {
      email, semester: "Summer 2026", sgpa: null, ongoing: true, order: 4,
      courses: [
        { code: "SWE 3103", title: "Software Requirement Engineering", credit: 3.0, grade: "—", point: null },
        { code: "SWE 3104", title: "Software Requirement Engineering Lab", credit: 1.0, grade: "—", point: null },
        { code: "SWE 3201", title: "Software Design Patterns", credit: 3.0, grade: "—", point: null },
        { code: "CSE 3255", title: "Computer Networks", credit: 3.0, grade: "—", point: null },
      ],
    },
  ]);

  const timeSlots = ["08:30 - 10:00", "10:00 - 11:30", "11:30 - 01:00", "01:00 - 02:00", "02:00 - 03:30", "03:30 - 05:00"];
  const routineTemplate = {
    section: "38-A",
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    timeSlots,
    routine: {
      Sunday: { "08:30 - 10:00": { code: "SWE 3103", room: "402", type: "Theory" }, "11:30 - 01:00": { code: "CSE 3255", room: "210", type: "Theory" } },
      Monday: { "10:00 - 11:30": { code: "SWE 3201", room: "305", type: "Theory" }, "01:00 - 02:00": { code: "GED 3101", room: "108", type: "Theory" } },
      Tuesday: { "08:30 - 10:00": { code: "SWE 3103", room: "402", type: "Theory" }, "11:30 - 01:00": { code: "CSE 3255", room: "210", type: "Theory" } },
      Wednesday: { "10:00 - 11:30": { code: "SWE 3201", room: "305", type: "Theory" }, "02:00 - 03:30": { code: "CSE 3256", room: "Lab 5", type: "Lab" } },
      Thursday: { "02:00 - 03:30": { code: "SWE 3104", room: "Lab 3", type: "Lab" } },
    },
    courseDetails: {
      "SWE 3103": { title: "Software Requirement Engineering", faculty: "Dr. Farhana Alam" },
      "SWE 3104": { title: "Software Requirement Engineering Lab", faculty: "Md. Rakibul Hasan" },
      "SWE 3201": { title: "Software Design Patterns", faculty: "Prof. Dr. Kamrul Islam" },
      "CSE 3255": { title: "Computer Networks", faculty: "Dr. Sakib Ahmed" },
      "CSE 3256": { title: "Computer Networks Lab", faculty: "Md. Shakil Ahmed" },
      "GED 3101": { title: "Bangladesh Studies", faculty: "Ms. Sabrina Yasmin" },
    },
  };
  const classRoutine = emails.map((email) => ({ email, ...routineTemplate }));

  const liveResults = emails.flatMap((email) => [
    { email, semester: "Fall 2025", examType: "Final Examination", status: "published", publishedOn: "2026-01-10", sgpa: 3.82 },
    { email, semester: "Spring 2026", examType: "Mid Term", status: "published", publishedOn: "2026-04-02", sgpa: null },
    { email, semester: "Spring 2026", examType: "Final Examination", status: "processing", publishedOn: null, sgpa: null },
    { email, semester: "Summer 2026", examType: "Mid Term", status: "not_published", publishedOn: null, sgpa: null },
  ]);

  const teachingEvaluation = emails.flatMap((email) => [
    { email, code: "SWE 3103", title: "Software Requirement Engineering", faculty: "Dr. Farhana Alam", status: "pending" },
    { email, code: "SWE 3201", title: "Software Design Patterns", faculty: "Prof. Dr. Kamrul Islam", status: "pending" },
    { email, code: "CSE 3255", title: "Computer Networks", faculty: "Dr. Sakib Ahmed", status: "submitted" },
    { email, code: "GED 3101", title: "Bangladesh Studies", faculty: "Ms. Sabrina Yasmin", status: "pending" },
  ]);

  const convocation = emails.map((email) => ({
    email,
    eligibility: { isEligible: true, cgpaCleared: true, duesCleared: true, thesisSubmitted: true },
    info: {
      title: "12th Convocation",
      date: "2026-12-15",
      venue: "International Convention City, Bashundhara",
      reportingTime: "08:00 AM",
      fee: 3000,
      registrationDeadline: "2026-09-30",
    },
  }));

  const notifications = emails.flatMap((email) => [
    { email, type: "Payment", title: "টিউশন ফি বকেয়া", message: "আপনার এই সেমিস্টারের ৳45,000 বকেয়া আছে। ৩১ জুলাইয়ের মধ্যে পরিশোধ করুন।", time: "2026-07-22T10:30:00", read: false },
    { email, type: "Result", title: "মিড-টার্ম রেজাল্ট প্রকাশিত", message: "Spring 2026 সেমিস্টারের মিড-টার্ম রেজাল্ট প্রকাশ করা হয়েছে।", time: "2026-07-21T15:00:00", read: false },
    { email, type: "Notice", title: "রেজিস্ট্রেশন উইন্ডো খোলা হয়েছে", message: "Fall 2026 সেমিস্টারের কোর্স রেজিস্ট্রেশন শুরু হয়েছে।", time: "2026-07-20T09:00:00", read: true },
    { email, type: "System", title: "পাসওয়ার্ড পরিবর্তন সফল", message: "আপনার অ্যাকাউন্টের পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।", time: "2026-07-18T18:45:00", read: true },
    { email, type: "Payment", title: "পেমেন্ট গৃহীত হয়েছে", message: "৳22,500 পেমেন্ট সফলভাবে গৃহীত হয়েছে।", time: "2026-07-15T12:00:00", read: true },
  ]);

  const attendance = emails.flatMap((email) => [
    { email, code: "SWE 3103", title: "Software Requirement Engineering", totalClass: 30, present: 27 },
    { email, code: "CSE 3255", title: "Computer Networks", totalClass: 28, present: 19 },
    { email, code: "SWE 3201", title: "Software Design Patterns", totalClass: 25, present: 24 },
    { email, code: "GED 3101", title: "Bangladesh Studies", totalClass: 26, present: 17 },
    { email, code: "SWE 3104", title: "Software Requirement Engineering Lab", totalClass: 22, present: 21 },
  ]);

  const calendarEvents = [
    { title: "Fall 2026 কোর্স রেজিস্ট্রেশন শুরু", category: "Registration", date: "2026-07-25" },
    { title: "রেজিস্ট্রেশনের শেষ তারিখ (লেট ফি ছাড়া)", category: "Deadline", date: "2026-08-05" },
    { title: "ক্লাস শুরু", category: "Event", date: "2026-08-10" },
    { title: "মিড-টার্ম পরীক্ষা শুরু", category: "Exam", date: "2026-09-20" },
    { title: "মিড-টার্ম পরীক্ষা শেষ", category: "Exam", date: "2026-09-27" },
    { title: "জাতীয় ছুটি — বিজয় দিবস", category: "Holiday", date: "2026-12-16" },
    { title: "ফাইনাল পরীক্ষা শুরু", category: "Exam", date: "2026-12-20" },
    { title: "ফাইনাল পরীক্ষা শেষ", category: "Exam", date: "2026-12-30" },
    { title: "সেমিস্টার রেজাল্ট প্রকাশ", category: "Result", date: "2027-01-15" },
  ];

  const notices = [
    {
      title: "Fall 2026 সেমিস্টার রেজিস্ট্রেশন শুরু",
      category: "Academic",
      date: "2026-07-20",
      pinned: true,
      details: "Fall 2026 সেমিস্টারের কোর্স রেজিস্ট্রেশন আগামী ২৫ জুলাই থেকে শুরু হবে। নির্ধারিত সময়ের মধ্যে রেজিস্ট্রেশন সম্পন্ন করুন।",
    },
  ];

  const availableCourses = [
    { code: "CSE401", title: "Compiler Design", credit: 3, semester: "4th", seatTotal: 40, seatFilled: 32, prerequisite: "CSE301" },
    { code: "CSE403", title: "Computer Networks", credit: 3, semester: "4th", seatTotal: 40, seatFilled: 40, prerequisite: null },
    { code: "CSE405", title: "Artificial Intelligence", credit: 3, semester: "4th", seatTotal: 35, seatFilled: 20, prerequisite: "CSE201" },
    { code: "MAT301", title: "Numerical Methods", credit: 3, semester: "3rd", seatTotal: 50, seatFilled: 45, prerequisite: null },
    { code: "CSE407", title: "Software Engineering", credit: 3, semester: "4th", seatTotal: 40, seatFilled: 15, prerequisite: null },
  ];

  const availableScholarships = [
    { name: "Merit Scholarship (Renewal)", criteria: "CGPA 3.80+ maintained across all semesters", coverage: "50% tuition waiver", deadline: "2026-08-15" },
    { name: "Financial Hardship Grant", criteria: "Demonstrated financial need, family income below threshold", coverage: "Up to 30% tuition waiver", deadline: "2026-08-20" },
  ];

  const certificateDocumentTypes = [
    { name: "Official Transcript", fee: 500 },
    { name: "Provisional Certificate", fee: 800 },
    { name: "Enrollment Certificate", fee: 300 },
    { name: "CGPA Certificate", fee: 300 },
  ];

  const learningResources = [
    { course: "SWE 3103", title: "Requirements Elicitation Techniques", type: "slide", format: "PDF", uploadedOn: "2026-07-01" },
    { course: "SWE 3201", title: "Design Patterns Overview", type: "video", format: "MP4", uploadedOn: "2026-07-03" },
    { course: "CSE 3255", title: "TCP/IP Fundamentals", type: "document", format: "DOCX", uploadedOn: "2026-07-05" },
    { course: "GED 3101", title: "Bangladesh Studies Reading List", type: "link", format: "URL", uploadedOn: "2026-07-02" },
  ];

  const transportRoutes = [
    { name: "Mirpur - DSC", fee: 4500, pickupPoints: ["Mirpur 10", "Mirpur 1", "Kazipara"] },
    { name: "Uttara - DSC", fee: 5000, pickupPoints: ["Uttara Sector 7", "Airport", "Khilkhet"] },
    { name: "Dhanmondi - DSC", fee: 3500, pickupPoints: ["Dhanmondi 27", "Science Lab", "Jigatola"] },
  ];

  async function reseed(name, docs) {
    const coll = db.collection(name);
    await coll.deleteMany({});
    if (docs.length) await coll.insertMany(docs);
    console.log(`Seeded ${docs.length} docs into "${name}"`);
  }

  await reseed("students", students);
  await reseed("transactions", transactions);
  await reseed("waivers", waivers);
  await reseed("examClearance", examClearance);
  await reseed("registeredCourses", registeredCourses);
  await reseed("academicResult", academicResult);
  await reseed("classRoutine", classRoutine);
  await reseed("liveResults", liveResults);
  await reseed("teachingEvaluation", teachingEvaluation);
  await reseed("convocation", convocation);
  await reseed("notifications", notifications);
  await reseed("attendance", attendance);
  await reseed("calendarEvents", calendarEvents);
  await reseed("notices", notices);
  await reseed("availableCourses", availableCourses);
  await reseed("availableScholarships", availableScholarships);
  await reseed("certificateDocumentTypes", certificateDocumentTypes);
  await reseed("learningResources", learningResources);
  await reseed("transportRoutes", transportRoutes);

  await reseed("courseCart", []);
  await reseed("scholarshipApplications", []);
  await reseed("certificateRequests", []);
  await reseed("helpDeskTickets", []);
  await reseed("transportApplications", []);

  console.log("Seeding complete.");
  await client.close();
}

seed().catch((err) => {
  alert(err);
  process.exit(1);
});
