import React, { useState, useMemo, useEffect, use } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Library,
  Wallet,
  Building2,
  FlaskConical,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

const iconMap = {
  wallet: Wallet,
  library: Library,
  building: Building2,
  flask: FlaskConical,
  shield: ShieldCheck,
};

const statusMap = {
  cleared: { icon: CheckCircle2, cls: "success", label: "Cleared" },
  pending: { icon: Clock, cls: "warning", label: "Pending" },
  rejected: { icon: XCircle, cls: "danger", label: "Not Cleared" },
};

export default function ExamClearance() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [examClearance, setExamClearance] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get(`/exam-clearance?email=${user.email}`)
      .then(res => {
        if (cancelled) return;
        setExamClearance(res.data);
        setDepartments(res.data?.departments || []);
      })
      .catch(alert)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const summary = useMemo(() => {
    const cleared = departments.filter((d) => d.status === "cleared").length;
    const pending = departments.filter((d) => d.status === "pending").length;
    const rejected = departments.filter((d) => d.status === "rejected").length;
    const allCleared = cleared === departments.length && departments.length > 0;
    return { cleared, pending, rejected, allCleared, total: departments.length };
  }, [departments]);

  if (!user || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  function refreshStatus(id) {
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === id && d.status === "pending"
          ? { ...d, status: "cleared", remarks: "Confirmed by office", updatedOn: "Today" }
          : d
      )
    );
  }

  return (
    <div className='p-4 d-flex flex-column gap-4' style={{ minHeight: "100vh", width: "100%", backgroundColor: "#F8F9FA" }}>
      <div><h2 className='fw-bold m-0'>Registration / Exam Clearance</h2>
        <p className="m-0">{examClearance?.semester}</p></div>

      <div className="row g-3 ">
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#E6F0FF" }} className='d-flex justify-content-center align-items-center'>
              <ClipboardCheck size={20} className="text-primary" />
            </div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Total Checkpoints</h6>
              <h5 className='fw-bold m-0'>{summary.total}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#E8F3EE" }} className='d-flex justify-content-center align-items-center'>
              <CheckCircle2 size={20} className="text-success" />
            </div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Cleared</h6>
              <h5 className='fw-bold m-0'>{summary.cleared}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#FBEAEC" }} className='d-flex justify-content-center align-items-center'>
              <Clock size={20} className="text-warning" />
            </div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Pending</h6>
              <h5 className='fw-bold m-0'>{summary.pending}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#FFF9E6" }} className='d-flex justify-content-center align-items-center'>
              <XCircle size={20} className="text-danger" />
            </div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Not Cleared</h6>
              <h5 className='fw-bold m-0'>{summary.rejected}</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <h6 className="fw-bold mb-0">Clearance Progress</h6>
            <span className="text-muted small">{summary.cleared} / {summary.total} completed</span>
          </div>
          <div className="progress" style={{ height: 8 }}>
            <div className="progress-bar bg-success" style={{ width: `${summary.total ? (summary.cleared / summary.total) * 100 : 0}%` }}></div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="fw-bold mb-3">Department-wise Clearance Status</h6>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Department / Office</th>
                  <th>Remarks</th>
                  <th>Updated On</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d) => {
                  const Icon = iconMap[d.iconKey] || Building2;
                  const StatusIcon = statusMap[d.status].icon;
                  return (
                    <tr key={d.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Icon size={16} className="text-secondary" />
                          <span className="fw-semibold">{d.name}</span>
                        </div>
                      </td>
                      <td className="text-muted small">{d.remarks}</td>
                      <td className="text-muted small">{d.updatedOn}</td>
                      <td>
                        <span className={`badge bg-${statusMap[d.status].cls} ${d.status === "pending" ? "text-dark" : ""} rounded-pill d-inline-flex align-items-center gap-1`}>
                          <StatusIcon size={12} />
                          {statusMap[d.status].label}
                        </span>
                      </td>
                      <td>
                        {d.status === "pending" && (
                          <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" onClick={() => refreshStatus(d.id)}>
                            <RefreshCcw size={12} /> Check Again
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
