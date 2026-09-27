import React, { useState, useMemo, useEffect, use } from "react";
import { ClipboardList, CheckCircle2, Clock, Star, Send, X, CalendarClock, User2 } from "lucide-react";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

function StarRating({ value, onChange }) {
  return (
    <div className="d-flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={20} className={n <= value ? "text-warning" : "text-secondary"} fill={n <= value ? "currentColor" : "none"} style={{ cursor: "pointer" }} onClick={() => onChange(n)} />
      ))}
    </div>
  );
}

export default function TeachingEvaluation() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [courses, setCourses] = useState([]);
  const [evaluationQuestions, setEvaluationQuestions] = useState([]);
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCourse, setActiveCourse] = useState(null);
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get(`/teaching-evaluation?email=${user.email}`)
      .then(res => {
        if (cancelled) return;
        setCourses(res.data.courses || []);
        setEvaluationQuestions(res.data.questions || []);
        setDeadline(res.data.deadline || "");
      })
      .catch(alert)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const summary = useMemo(() => {
    const submitted = courses.filter((c) => c.status === "submitted").length;
    return { submitted, pending: courses.length - submitted, total: courses.length };
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

  function openForm(course) {
    setActiveCourse(course);
    setRatings(Object.fromEntries(evaluationQuestions.map((_, i) => [i, 0])));
    setComment("");
  }

  function closeForm() {
    setActiveCourse(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const allRated = evaluationQuestions.every((_, i) => ratings[i] > 0);
    if (!allRated) return;

    axiosSecure.post(`/teaching-evaluation/${activeCourse._id}/submit`, { ratings, comment })
      .then(() => {
        setCourses((prev) => prev.map((c) => c._id === activeCourse._id ? { ...c, status: "submitted" } : c));
        closeForm();
      }).catch(err => {
        alert(err.response?.data?.message || 'জমা দেওয়া যায়নি।');
      });
  }

  return (
    <div className="container-fluid p-3 p-md-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div><h2 className='fw-bold m-0'>Teaching Evaluation</h2></div>
        <span className="badge bg-secondary bg-opacity-10 text-secondary border d-flex align-items-center gap-1">
          <CalendarClock size={13} /> Deadline: {deadline}
        </span>
      </div>

      <div className="alert alert-info d-flex align-items-center gap-2">
        <ClipboardList size={18} />
        <div className="small">
          Your responses are <strong>anonymous</strong> and used only to improve teaching quality. You must submit an evaluation for every course before final result publication.
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                <ClipboardList size={20} className="text-primary" />
              </div>
              <div>
                <div className="text-muted small">Total Courses</div>
                <div className="fw-bold">{summary.total}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                <CheckCircle2 size={20} className="text-success" />
              </div>
              <div>
                <div className="text-muted small">Submitted</div>
                <div className="fw-bold">{summary.submitted}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                <Clock size={20} className="text-warning" />
              </div>
              <div>
                <div className="text-muted small">Pending</div>
                <div className="fw-bold">{summary.pending}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <h6 className="fw-bold mb-0">Evaluation Progress</h6>
            <span className="text-muted small">{summary.submitted} / {summary.total} completed</span>
          </div>
          <div className="progress" style={{ height: 8 }}>
            <div className="progress-bar bg-success" style={{ width: `${summary.total ? (summary.submitted / summary.total) * 100 : 0}%` }}></div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="fw-bold mb-3">Courses This Semester</h6>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Course Code</th><th>Course Title</th><th>Faculty</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id}>
                    <td className="fw-semibold">{c.code}</td>
                    <td>{c.title}</td>
                    <td><div className="d-flex align-items-center gap-1 text-muted small"><User2 size={13} />{c.faculty}</div></td>
                    <td>
                      {c.status === "submitted" ? (
                        <span className="badge bg-success rounded-pill d-inline-flex align-items-center gap-1"><CheckCircle2 size={12} /> Submitted</span>
                      ) : (
                        <span className="badge bg-warning text-dark rounded-pill d-inline-flex align-items-center gap-1"><Clock size={12} /> Pending</span>
                      )}
                    </td>
                    <td>
                      {c.status === "pending" && (
                        <button className="btn btn-primary btn-sm" onClick={() => openForm(c)}>Evaluate</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {activeCourse && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ background: "rgba(0,0,0,.5)", zIndex: 1050 }}>
          <div className="card border-0 shadow-lg" style={{ maxWidth: 560, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="fw-bold mb-0">{activeCourse.code}</h6>
                  <div className="text-muted small">{activeCourse.title} &middot; {activeCourse.faculty}</div>
                </div>
                <button className="btn btn-sm btn-link text-muted p-0" onClick={closeForm}><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit}>
                {evaluationQuestions.map((q, i) => (
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom" key={i}>
                    <div className="small me-3">{q}</div>
                    <StarRating value={ratings[i] || 0} onChange={(v) => setRatings((prev) => ({ ...prev, [i]: v }))} />
                  </div>
                ))}
                <div className="mb-3">
                  <label className="form-label small text-muted">Additional Comments (optional)</label>
                  <textarea className="form-control form-control-sm" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share any additional feedback..."></textarea>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary btn-sm d-flex align-items-center gap-1"><Send size={14} /> Submit Evaluation</button>
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeForm}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
