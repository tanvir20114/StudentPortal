import React, { useEffect, useState, use } from 'react'
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

import { SiCoursera } from "react-icons/si";
import { FaPlus, FaTrash, FaUsers } from "react-icons/fa";
import { MdOutlinePending } from "react-icons/md";


export default function CourseRegistration() {

  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [availableCourses, setAvailableCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [message, setMessage] = useState(null);

  const CREDIT_LIMIT = 15;
  const isRegistrationOpen = true;

  const loadData = () => {
    if (!user?.email) return;
    setLoading(true);
    Promise.all([
      axiosSecure.get('/course-registration/available'),
      axiosSecure.get(`/course-registration/cart?email=${user.email}`),
    ]).then(([availableRes, cartRes]) => {
      setAvailableCourses(availableRes.data);
      setRegisteredCourses(cartRes.data);
    }).catch(alert).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const totalCredit = registeredCourses.reduce((sum, c) => sum + c.credit, 0);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddCourse = (course) => {
    axiosSecure.post('/course-registration/cart', { courseId: course._id })
      .then(res => {
        setRegisteredCourses(prev => [...prev, res.data]);
        setAvailableCourses(prev => prev.map(c => c._id === course._id ? { ...c, seatFilled: c.seatFilled + 1 } : c));
        showMessage('success', `${course.code} সফলভাবে যোগ হয়েছে।`);
      })
      .catch(err => {
        showMessage('error', err.response?.data?.message || 'কোর্স যোগ করা যায়নি।');
      });
  };

  const handleDropCourse = (course) => {
    if (!window.confirm(`আপনি কি ${course.code} কোর্সটি ড্রপ করতে চান?`)) return;

    axiosSecure.delete(`/course-registration/cart/${course._id}`)
      .then(() => {
        setRegisteredCourses(prev => prev.filter(c => c._id !== course._id));
        setAvailableCourses(prev => prev.map(c => c.code === course.code ? { ...c, seatFilled: c.seatFilled - 1 } : c));
        showMessage('success', `${course.code} ড্রপ করা হয়েছে।`);
      })
      .catch(err => {
        showMessage('error', err.response?.data?.message || 'কোর্স ড্রপ করা যায়নি।');
      });
  };

  const semesters = ['All', ...new Set(availableCourses.map(c => c.semester))];

  const filteredAvailable = availableCourses
    .filter(c => semesterFilter === 'All' || c.semester === semesterFilter)
    .filter(c =>
      c.title.toLowerCase().includes(searchText.toLowerCase()) ||
      c.code.toLowerCase().includes(searchText.toLowerCase())
    );

  if (!user || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4" style={{ minHeight: "100vh", backgroundColor: "#F4F6FB" }}>

      <div className="d-flex align-items-center gap-2 mb-3">
        <SiCoursera className="h2 m-0" style={{ color: "#182444" }} />
        <h3 className="m-0 fw-bold" style={{ color: "#182444" }}>Course Registration (Add/Drop)</h3>
      </div>

      {!isRegistrationOpen && (
        <div className="alert alert-warning d-flex align-items-center gap-2">
          <MdOutlinePending />
          বর্তমানে রেজিস্ট্রেশন উইন্ডো বন্ধ আছে। নির্ধারিত সময়ে আবার চেষ্টা করুন।
        </div>
      )}

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded shadow-sm p-3 mb-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <span className="fw-bold" style={{ color: "#182444" }}>মোট রেজিস্টার্ড ক্রেডিট: </span>
          <span style={{ color: totalCredit > CREDIT_LIMIT ? "red" : "#182444" }}>
            {totalCredit} / {CREDIT_LIMIT}
          </span>
        </div>
        <div className="progress" style={{ width: "220px", height: "10px" }}>
          <div className="progress-bar" style={{ width: `${Math.min((totalCredit / CREDIT_LIMIT) * 100, 100)}%`, backgroundColor: totalCredit > CREDIT_LIMIT ? "#dc3545" : "#182444" }} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <h5 className="fw-bold mb-3" style={{ color: "#182444" }}>রেজিস্টার্ড কোর্স ({registeredCourses.length})</h5>

          {registeredCourses.length === 0 ? (
            <p className="text-muted">এখনো কোনো কোর্স রেজিস্টার্ড হয়নি।</p>
          ) : (
            <div className="d-flex flex-column gap-2">
              {registeredCourses.map(course => (
                <div key={course._id} className="bg-white rounded shadow-sm p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <p className="m-0 fw-bold" style={{ color: "#182444" }}>{course.code}</p>
                    <p className="m-0 text-muted" style={{ fontSize: "0.85rem" }}>{course.title} • {course.credit} Credit</p>
                  </div>
                  <button onClick={() => handleDropCourse(course)} className="btn btn-sm" style={{ backgroundColor: "#FDE8E8", color: "#dc3545", border: "none" }} disabled={!isRegistrationOpen}>
                    <FaTrash className="me-1" />Drop
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-lg-7">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h5 className="fw-bold m-0" style={{ color: "#182444" }}>উপলব্ধ কোর্স</h5>
            <div className="d-flex gap-2">
              <select className="form-select form-select-sm" value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)}>
                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input type="text" placeholder="কোর্স খুঁজুন..." value={searchText} onChange={(e) => setSearchText(e.target.value)} className="form-control form-control-sm" style={{ maxWidth: "180px" }} />
            </div>
          </div>

          {filteredAvailable.length === 0 ? (
            <p className="text-muted">কোনো কোর্স পাওয়া যায়নি।</p>
          ) : (
            <div className="d-flex flex-column gap-2">
              {filteredAvailable.map(course => {
                const isFull = course.seatFilled >= course.seatTotal;
                const alreadyRegistered = registeredCourses.some(c => c.code === course.code);
                return (
                  <div key={course._id} className="bg-white rounded shadow-sm p-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                      <p className="m-0 fw-bold" style={{ color: "#182444" }}>{course.code} — {course.title}</p>
                      <div className="d-flex flex-wrap gap-3 text-muted" style={{ fontSize: "0.85rem" }}>
                        <span>{course.credit} Credit</span>
                        <span>{course.semester} Semester</span>
                        <span className="d-flex align-items-center gap-1"><FaUsers /> {course.seatFilled}/{course.seatTotal} {isFull && <span className="text-danger">(Full)</span>}</span>
                        {course.prerequisite && <span>Prerequisite: {course.prerequisite}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddCourse(course)}
                      className="btn btn-sm"
                      style={{ backgroundColor: alreadyRegistered ? "#E9ECF5" : "#182444", color: alreadyRegistered ? "#182444" : "#fff", border: "none" }}
                      disabled={isFull || alreadyRegistered || !isRegistrationOpen}
                    >
                      <FaPlus className="me-1" />
                      {alreadyRegistered ? "Added" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
