import React, { useContext } from 'react'
import './NavBarStudentPortal.css'
import { FaUniversity } from "react-icons/fa";
import { MdCampaign, MdDashboard, MdOutlineCalendarMonth, MdOutlineFactCheck } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { MdOutlinePayment } from "react-icons/md";
import { TbCashRegister } from "react-icons/tb";
import { SiCoursera } from "react-icons/si";
import { PiExam } from "react-icons/pi";
import { BsFileRuled } from "react-icons/bs";
import { MdLiveTv } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { TbChalkboardTeacher } from "react-icons/tb";
import { MdEmojiTransportation } from "react-icons/md";
import { FaGoogleScholar } from "react-icons/fa6";
import { PiCertificate } from "react-icons/pi";
import { MdCastForEducation } from "react-icons/md";
import { MdMedicalServices } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { NavLink, useNavigate } from 'react-router';
import { AuthContext } from '../AuthContext';
import { IoNotificationsOutline } from 'react-icons/io5';


export default function NavBarStudentPortal({ isOpen, onClose }) {
  const { signOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("আপনি কি লগ আউট করতে চান?")) {
      signOutUser()
        .then(() => {
          navigate('/');
        })
        .catch(() => {
          alert("Logout failed. Please try again.");
        });
    }
  };

  const closeSidebar = () => onClose?.();

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop d-md-none"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`nav-sidebar ${isOpen ? "nav-sidebar-open" : ""}`}
        aria-label="Student portal navigation"
      >
        <div className="nav-sidebar-header d-flex align-items-center justify-content-center py-4 gap-2">
          <FaUniversity className="nav-sidebar-logo-icon" />
          <b className="text-white nav-sidebar-title">XYZ UNIVERSITY</b>
        </div>

        <div className="d-flex flex-column gap-0 pb-5">
          <NavLink end onClick={closeSidebar} to={'/student-portal'}><div className="nav-item-link"><MdDashboard />Dashboard</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/StudentProfile'}><div className="nav-item-link"><CgProfile />Student Profile</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/PaymentLedger'}><div className="nav-item-link"><MdOutlinePayment />Payment Ledger</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/Waiver'}><div className="nav-item-link"><MdOutlinePayment />Waiver</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/ExamClearance'}><div className="nav-item-link"><TbCashRegister />Registration/Exam Clearance</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/RegisteredCourse'}><div className="nav-item-link"><SiCoursera />Registered Course</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/Result'}><div className="nav-item-link"><PiExam />Result</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/Routine'}><div className="nav-item-link"><BsFileRuled />Routine</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/LiveResult'}><div className="nav-item-link"><MdLiveTv />Live Result</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/TeachingEvaluation'}><div className="nav-item-link"><TbChalkboardTeacher />Teaching Evaluation</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/Convocation'}><div className="nav-item-link"><PiStudent />Convocation Apply</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/TransportCardApply'}><div className="nav-item-link"><MdEmojiTransportation />Transport Card Apply</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/Scholarship'}><div className="nav-item-link"><FaGoogleScholar />Scholarship</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/CertificateTranscript'}><div className="nav-item-link"><PiCertificate />Certificate & Transcript</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/LearningResources'}><div className="nav-item-link"><MdCastForEducation />Learning Resources</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/StudentServices'}><div className="nav-item-link"><MdMedicalServices />Student Services</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/Notice'}><div className="nav-item-link"><MdCampaign />Notice / Announcement</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/CourseRegistration'}><div className="nav-item-link"><SiCoursera />Course Registration</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/Attendance'}><div className="nav-item-link"><MdOutlineFactCheck />Attendance</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/AcademicCalendar'}><div className="nav-item-link"><MdOutlineCalendarMonth />Academic Calendar</div></NavLink>
          <NavLink onClick={closeSidebar} to={'/student-portal/NotificationCenter'}><div className="nav-item-link"><IoNotificationsOutline />Notifications</div></NavLink>
          <div
            onClick={() => { handleLogout(); closeSidebar(); }}
            className="nav-item-link"
            style={{ cursor: "pointer" }}
          >
            <CiLogout />Logout
          </div>
        </div>
      </aside>
    </>
  )
}