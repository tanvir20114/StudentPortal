import "./Component.css"

import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaMale, FaFemale } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaPen } from "react-icons/fa";
import { useState, useEffect, use } from "react";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

function StudentProfile() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get(`/students/profile?email=${user.email}`)
      .then(res => { if (!cancelled) setStudent(res.data); })
      .catch(alert)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  if (!user || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!student) {
    return <p className="p-4">শিক্ষার্থীর তথ্য পাওয়া যায়নি।</p>;
  }

  const studentInfo = [
    { label: "Student Id", value: student.studentId },
    { label: "Registration ID", value: student.registrationId },
    { label: "Batch", value: student.batch },
    { label: "Shift", value: student.shift },
    { label: "Campus", value: student.campus },
    { label: "Program", value: student.program },
    { label: "Department", value: student.department },
    { label: "Faculty", value: student.faculty },
    { label: "Issue Date", value: student.issueDate },
    { label: "Expire Date", value: student.expireDate },
  ];

  const hasAddress = student.addressInfo && Object.keys(student.addressInfo).length > 0;

  const fieldLabelMap = {
    fullName: "Full Name",
    fatherName: "Father's Name",
    motherName: "Mother's Name",
    dateOfBirth: "Date of Birth",
    gender: "Gender",
    bloodGroup: "Blood Group",
    nationality: "Nationality",
    religion: "Religion",
    program: "Program",
    department: "Department",
    batch: "Batch",
    shift: "Shift",
    campus: "Campus",
    presentAddress: "Present Address",
    permanentAddress: "Permanent Address",
    district: "District",
    division: "Division",
    postalCode: "Postal Code",
  };

  const toFields = (obj) =>
    Object.entries(obj || {}).map(([key, value]) => ({
      label: fieldLabelMap[key] || key,
      value,
    }));

  const profileStatus = [
    { label: "Personal Information", fields: toFields(student.personalInfo) },
    { label: "Academic Information", fields: toFields(student.academicInfo) },
    { label: "Address Information", fields: hasAddress ? toFields(student.addressInfo) : [] },
  ];

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="p-4 d-flex flex-column gap-4" style={{ backgroundColor: "#F8F9FA" }}>

      <h3 className="fw-bold">Student Profile</h3>

      <div className="p-3 border bg-white shadow-sm d-flex gap-3 rounded position-relative">
        <div className="border rounded bg-secondary d-flex justify-content-center align-items-center position-relative" style={{ height: "20vh", aspectRatio: 1 }}>
          <CgProfile size={90} />
          <div className="position-absolute bottom-0 end-0 me-1 mb-1 bg-primary d-flex justify-content-center align-items-center " style={{ borderRadius: "50%", height: "4vh", aspectRatio: 1 }}>
            <FaPen size={15} />
          </div>
        </div>
        <div className="">
          <h4 className="fw-bold">{student.name}</h4>
          <p className="m-0"><FaPhone />   {student.phone}</p>
          {student.emails?.map((email, i) => (
            <p className="m-0" key={i}><MdEmail />   {email}</p>
          ))}
          <div className="d-flex gap-5">
            <div className="">
              {student.gender === "Female" ? <FaFemale /> : <FaMale />}   {student.gender?.toLowerCase()}
            </div>
            <div className="ps-3"><MdBloodtype />   {student.bloodGroup}</div>
          </div>
        </div>

        <div className="badge rounded-pill bg-success position-absolute end-0 p-2 px-3 top-0 mt-3 me-3">{student.status}</div>
      </div>

      <div className="d-flex g-4 row">
        <div className="col-12 col-md-6">
          <div className="p-3 rounded border bg-white shadow-sm h-100">
            <h4 className="fw-bold m-0">Profile Status</h4>
            <div className="d-flex flex-column gap-2 mt-3">
              {profileStatus.map((section, index) => (
                <div key={section.label} className="border rounded">
                  <div className="p-2 d-flex justify-content-between align-items-center" role="button" onClick={() => toggleSection(index)}>
                    <span className="fw-semibold">{section.label}</span>
                    <span>{openIndex === index ? "▲" : "▼"}</span>
                  </div>
                  {openIndex === index && section.fields.length > 0 && (
                    <div className="p-2 border-top">
                      {section.fields.map((f) => (
                        <div key={f.label} className="d-flex justify-content-between py-1 small">
                          <span className="text-muted">{f.label}</span>
                          <span className="fw-semibold">{f.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="p-3 rounded border bg-white shadow-sm h-100">
            <h4 className="fw-bold m-0">Student Information</h4>
            <div className="d-flex flex-column gap-1 mt-3">
              {studentInfo.map((row) => (
                <div key={row.label} className="d-flex justify-content-between small py-1 border-bottom">
                  <span className="text-muted">{row.label}</span>
                  <span className="fw-semibold">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile;
