import React, { useState, useMemo, useEffect, use } from "react";
import { BookOpen, GraduationCap, Clock3, User2, MapPin, Layers } from "lucide-react";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

export default function RegisteredCourses() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get(`/registered-courses?email=${user.email}`)
      .then(res => { if (!cancelled) setCourses(res.data); })
      .catch(alert)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const summary = useMemo(() => {
    const totalCredit = courses.reduce((s, c) => s + c.credit, 0);
    const theoryCount = courses.filter((c) => c.type === "Theory").length;
    const labCount = courses.filter((c) => c.type === "Lab").length;
    return { totalCredit, theoryCount, labCount, total: courses.length };
  }, [courses]);

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
    <div className='p-4 d-flex flex-column gap-4' style={{ minHeight: "100vh", width: "100%", backgroundColor: "#F8F9FA" }}>
      <div><h2 className='fw-bold m-0'>Registered Courses</h2></div>

      <div className="row g-3 ">
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#E6F0FF" }} className='d-flex justify-content-center align-items-center'>
              <BookOpen size={20} className="text-primary" />
            </div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Total Courses</h6>
              <h5 className='fw-bold m-0'>{summary.total}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#E8F3EE" }} className='d-flex justify-content-center align-items-center'>
              <GraduationCap size={20} className="text-success" />
            </div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Total Credit Hours</h6>
              <h5 className='fw-bold m-0'>{summary.totalCredit.toFixed(1)}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#FBEAEC" }} className='d-flex justify-content-center align-items-center'>
              <Layers size={20} className="text-info" />
            </div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Theory Courses</h6>
              <h5 className='fw-bold m-0'>{summary.theoryCount}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#FFF9E6" }} className='d-flex justify-content-center align-items-center'>
              <Clock3 size={20} className="text-warning" />
            </div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Lab Courses</h6>
              <h5 className='fw-bold m-0'>{summary.labCount}</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="fw-bold mb-3">Course List</h6>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th><th>Course Code</th><th>Course Title</th><th>Type</th>
                  <th className="text-end">Credit</th><th>Section</th><th>Faculty</th><th>Schedule</th><th>Room</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, i) => (
                  <tr key={c._id || c.code}>
                    <td className="text-muted">{i + 1}</td>
                    <td className="fw-semibold">{c.code}</td>
                    <td>{c.title}</td>
                    <td>
                      <span className={`badge rounded-pill ${c.type === "Lab" ? "bg-info bg-opacity-10 text-info border border-info" : "bg-primary bg-opacity-10 text-primary border border-primary"}`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="text-end">{c.credit.toFixed(1)}</td>
                    <td>{c.section}</td>
                    <td><div className="d-flex align-items-center gap-1 text-muted small"><User2 size={13} />{c.faculty}</div></td>
                    <td className="text-muted small"><div className="d-flex align-items-center gap-1"><Clock3 size={13} />{c.schedule}</div></td>
                    <td className="text-muted small"><div className="d-flex align-items-center gap-1"><MapPin size={13} />{c.room}</div></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-light fw-bold">
                  <td colSpan={4} className="text-end">Total Credit Hours</td>
                  <td className="text-end">{summary.totalCredit.toFixed(1)}</td>
                  <td colSpan={4}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
