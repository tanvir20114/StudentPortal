import React, { useState, useMemo, useEffect, use } from "react";
import {
  GraduationCap,
  TrendingUp,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

function gradeColor(grade) {
  if (grade === "—") return "secondary";
  if (grade.startsWith("A")) return "success";
  if (grade.startsWith("B")) return "primary";
  if (grade.startsWith("C")) return "warning";
  return "danger";
}

export default function AcademicResult() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [semesterResults, setSemesterResults] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get(`/academic-result?email=${user.email}`)
      .then(res => {
        if (cancelled) return;
        setSemesterResults(res.data);
        setExpanded(Object.fromEntries(res.data.map((s) => [s.semester, true])));
      })
      .catch(alert)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const completed = semesterResults.filter((s) => !s.ongoing);

  const summary = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    completed.forEach((s) =>
      s.courses.forEach((c) => {
        if (c.point !== null) {
          totalPoints += c.point * c.credit;
          totalCredits += c.credit;
        }
      })
    );
    const cgpa = totalCredits ? totalPoints / totalCredits : 0;
    return {
      cgpa: cgpa.toFixed(2),
      totalCredits,
      completedSemesters: completed.length,
    };
  }, [completed]);

  if (!user || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  function toggle(semester) {
    setExpanded((prev) => ({ ...prev, [semester]: !prev[semester] }));
  }

  return (
    <div className='p-4 d-flex flex-column gap-4' style={{ minHeight: "100vh", width: "100%", backgroundColor: "#F8F9FA" }}>
      <div><h2 className='fw-bold m-0'>Academic Result</h2></div>

      <div className="row g-3 ">
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#E6F0FF" }} className='d-flex justify-content-center align-items-center'>
              <BookOpen size={20} className="text-primary" />
            </div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>CGPA</h6>
              <h5 className='fw-bold m-0'>{summary.cgpa}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#E8F3EE" }} className='d-flex justify-content-center align-items-center'>
              <GraduationCap size={20} className="text-success" />
            </div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Credits Completed</h6>
              <h5 className='fw-bold m-0'>{summary.totalCredits.toFixed(1)}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#FBEAEC" }} className='d-flex justify-content-center align-items-center'>
              <BookOpen size={20} className="text-info" />
            </div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0' style={{ fontSize: ".91rem" }}>Semesters Completed</h6>
              <h5 className='fw-bold m-0'>{summary.completedSemesters}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#FFF9E6" }} className='d-flex justify-content-center align-items-center'>
              <TrendingUp size={20} className="text-warning" />
            </div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Last SGPA</h6>
              <h5 className='fw-bold m-0'> {completed[completed.length - 1]?.sgpa ?? "—"}</h5>
            </div>
          </div>
        </div>
      </div>

      {semesterResults.map((sem) => (
        <div className="card border-0 shadow-sm mb-3" key={sem.semester}>
          <div className="card-header bg-white d-flex justify-content-between align-items-center" role="button" onClick={() => toggle(sem.semester)}>
            <div className="d-flex align-items-center gap-2">
              <h6 className="fw-bold mb-0">{sem.semester}</h6>
              {sem.ongoing ? (
                <span className="badge bg-warning text-dark rounded-pill">Ongoing</span>
              ) : (
                <span className="badge bg-light text-dark border">SGPA: {sem.sgpa.toFixed(2)}</span>
              )}
            </div>
            {expanded[sem.semester] ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
          </div>

          {expanded[sem.semester] && (
            <div className="card-body pt-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Course Code</th>
                      <th>Course Title</th>
                      <th className="text-end">Credit</th>
                      <th className="text-center">Grade</th>
                      <th className="text-end">Grade Point</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem.courses.map((c) => (
                      <tr key={c.code}>
                        <td className="fw-semibold">{c.code}</td>
                        <td>{c.title}</td>
                        <td className="text-end">{c.credit.toFixed(1)}</td>
                        <td className="text-center">
                          <span className={`badge bg-${gradeColor(c.grade)} rounded-pill`}>{c.grade}</span>
                        </td>
                        <td className="text-end">{c.point !== null ? c.point.toFixed(1) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
