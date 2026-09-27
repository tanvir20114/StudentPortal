import React, { useState, useMemo, useEffect, use } from "react";
import { Award, CheckCircle2, Clock, XCircle, GraduationCap, Wallet, Send, X, Percent, Info } from "lucide-react";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

const statusMap = {
  approved: { icon: CheckCircle2, cls: "success", label: "Approved" },
  pending: { icon: Clock, cls: "warning", label: "Pending" },
  rejected: { icon: XCircle, cls: "danger", label: "Rejected" },
};

export default function Scholarship() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [cgpa, setCgpa] = useState(null);
  const [history, setHistory] = useState([]);
  const [availableScholarships, setAvailableScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingFor, setApplyingFor] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get(`/scholarship?email=${user.email}`)
      .then(res => {
        if (cancelled) return;
        setCgpa(res.data.cgpa);
        setHistory(res.data.applicationHistory || []);
        setAvailableScholarships(res.data.availableScholarships || []);
      })
      .catch(alert)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const summary = useMemo(() => {
    const approved = history.filter((h) => h.status === "approved");
    return {
      total: history.length,
      approved: approved.length,
      pending: history.filter((h) => h.status === "pending").length,
    };
  }, [history]);

  if (!user || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  function openApply(sch) {
    setApplyingFor(sch);
    setNote("");
  }

  function closeApply() {
    setApplyingFor(null);
  }

  function submitApplication() {
    if (!applyingFor) return;

    axiosSecure.post('/scholarship/apply', {
      name: applyingFor.name,
      semester: "Summer 2026",
      note,
    }).then(res => {
      setHistory(prev => [res.data, ...prev]);
      closeApply();
    }).catch(err => {
      alert(err.response?.data?.message || 'আবেদন জমা দেওয়া যায়নি।');
    });
  }

  const alreadyApplied = (name) =>
    history.some((h) => h.name === name && h.status === "pending");

  return (
    <div className="bg-light min-vh-100">
      <div className="container-fluid p-3 p-md-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <div>
            <h2 className='fw-bold m-0'>Scholarship</h2>
            <div className="text-muted small">
              Current CGPA: {cgpa != null ? cgpa.toFixed(2) : '—'}
            </div>
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  <Award size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-muted small">Total Applications</div>
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
                  <div className="text-muted small">Approved</div>
                  <div className="fw-bold">{summary.approved}</div>
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
            <h6 className="fw-bold mb-3">Available Scholarships</h6>
            <div className="row g-3">
              {availableScholarships.map((sch) => (
                <div className="col-12 col-md-6" key={sch._id || sch.name}>
                  <div className="border rounded p-3 h-100 d-flex flex-column">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <GraduationCap size={18} className="text-primary" />
                      <span className="fw-semibold small">{sch.name}</span>
                    </div>
                    <div className="text-muted small mb-1 d-flex align-items-start gap-1">
                      <Info size={13} className="mt-1 flex-shrink-0" />
                      {sch.criteria}
                    </div>
                    <div className="text-muted small mb-2 d-flex align-items-center gap-1">
                      <Percent size={13} />
                      {sch.coverage}
                    </div>
                    <div className="text-muted small mb-3">Deadline: {sch.deadline}</div>
                    <button className="btn btn-primary btn-sm mt-auto" disabled={alreadyApplied(sch.name)} onClick={() => openApply(sch)}>
                      {alreadyApplied(sch.name) ? "Application Pending" : "Apply Now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h6 className="fw-bold mb-3">Application History</h6>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th><th>Scholarship</th><th>Semester</th><th>Coverage</th><th>Applied On</th><th>Remarks</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => {
                    const StatusIcon = statusMap[h.status].icon;
                    return (
                      <tr key={h._id || i}>
                        <td className="text-muted">{i + 1}</td>
                        <td className="fw-semibold">{h.name}</td>
                        <td><span className="badge bg-secondary bg-opacity-10 text-secondary border">{h.semester}</span></td>
                        <td>{h.coverage}</td>
                        <td>{h.appliedOn}</td>
                        <td className="text-muted small">{h.remarks || "—"}</td>
                        <td>
                          <span className={`badge bg-${statusMap[h.status].cls} ${h.status === "pending" ? "text-dark" : ""} rounded-pill d-inline-flex align-items-center gap-1`}>
                            <StatusIcon size={12} />
                            {statusMap[h.status].label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {history.length === 0 && (
              <div className="text-center text-muted py-4">No scholarship applications yet.</div>
            )}
          </div>
        </div>

        {applyingFor && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="card border-0 shadow-lg" style={{ maxWidth: 480, width: "100%" }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h6 className="fw-bold mb-0">Apply: {applyingFor.name}</h6>
                  <button className="btn btn-sm btn-link text-muted p-0" onClick={closeApply}><X size={18} /></button>
                </div>
                <div className="text-muted small mb-3">
                  <div className="d-flex align-items-center gap-1 mb-1"><Info size={13} /> {applyingFor.criteria}</div>
                  <div className="d-flex align-items-center gap-1"><Wallet size={13} /> {applyingFor.coverage}</div>
                </div>
                <label className="form-label small text-muted">Note to Scholarship Committee (optional)</label>
                <textarea className="form-control form-control-sm mb-3" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Any additional information supporting your application..."></textarea>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={submitApplication}><Send size={14} /> Submit Application</button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={closeApply}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
