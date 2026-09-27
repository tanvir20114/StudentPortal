import React, { useState, useMemo, useEffect, use } from "react";
import {
  LifeBuoy, Plus, Clock, CheckCircle2, Loader2, X, Send,
  MessageSquare, CreditCard, Home, Stethoscope, KeyRound, FileWarning,
} from "lucide-react";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

const serviceCategories = [
  { id: "id_card", name: "Lost / Damaged ID Card", icon: CreditCard },
  { id: "hostel", name: "Hostel & Accommodation", icon: Home },
  { id: "medical", name: "Medical Appointment", icon: Stethoscope },
  { id: "locker", name: "Locker / Property Issue", icon: KeyRound },
  { id: "complaint", name: "General Complaint", icon: FileWarning },
  { id: "other", name: "Other Request", icon: MessageSquare },
];

const priorities = ["Low", "Normal", "High"];

const statusMap = {
  open: { label: "Open", icon: Clock, cls: "secondary" },
  in_progress: { label: "In Progress", icon: Loader2, cls: "warning" },
  resolved: { label: "Resolved", icon: CheckCircle2, cls: "success" },
};

export default function StudentServicesHelpDesk() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState(serviceCategories[0].id);
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [priority, setPriority] = useState("Normal");

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get(`/student-services?email=${user.email}`)
      .then(res => { if (!cancelled) setTickets(res.data.tickets || []); })
      .catch(alert)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const summary = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status !== "resolved").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
    };
  }, [tickets]);

  if (!user || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  function openForm() {
    setCategory(serviceCategories[0].id);
    setSubject("");
    setDetails("");
    setPriority("Normal");
    setShowForm(true);
  }

  function submitTicket() {
    if (!subject.trim()) return;
    const catName = serviceCategories.find((c) => c.id === category).name;

    axiosSecure.post('/student-services', {
      category: catName,
      subject: subject.trim(),
      details,
      priority,
    }).then(res => {
      setTickets(prev => [res.data, ...prev]);
      setShowForm(false);
    }).catch(err => {
      alert(err.response?.data?.message || 'টিকেট জমা দেওয়া যায়নি।');
    });
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container-fluid p-3 p-md-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <div>
            <h2 className='fw-bold m-0'>Student Services</h2>
            <div className="text-muted small">Raise a request or track your service tickets</div>
          </div>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={openForm}>
            <Plus size={14} /> New Request
          </button>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  <LifeBuoy size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-muted small">Total Tickets</div>
                  <div className="fw-bold">{summary.total}</div>
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
                  <div className="text-muted small">Open / In Progress</div>
                  <div className="fw-bold">{summary.open}</div>
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
                  <div className="text-muted small">Resolved</div>
                  <div className="fw-bold">{summary.resolved}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body">
            <h6 className="fw-bold mb-3">Quick Request</h6>
            <div className="row g-2">
              {serviceCategories.map((c) => {
                const Icon = c.icon;
                return (
                  <div className="col-6 col-md-4 col-lg-2" key={c.id}>
                    <div
                      className="border rounded p-2 text-center h-100 d-flex flex-column align-items-center justify-content-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setCategory(c.id);
                        setSubject("");
                        setDetails("");
                        setPriority("Normal");
                        setShowForm(true);
                      }}
                    >
                      <Icon size={20} className="text-primary mb-1" />
                      <span className="small">{c.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h6 className="fw-bold mb-3">My Tickets</h6>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Ticket ID</th><th>Category</th><th>Subject</th><th>Priority</th>
                    <th>Created</th><th>Status</th><th>Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => {
                    const conf = statusMap[t.status];
                    const StatusIcon = conf.icon;
                    return (
                      <tr key={t._id || t.ticketRef}>
                        <td className="fw-semibold">{t.ticketRef}</td>
                        <td className="text-muted small">{t.category}</td>
                        <td>{t.subject}</td>
                        <td>
                          <span className={`badge rounded-pill ${t.priority === "High" ? "bg-danger bg-opacity-10 text-danger border border-danger" : t.priority === "Normal" ? "bg-primary bg-opacity-10 text-primary border border-primary" : "bg-secondary bg-opacity-10 text-secondary border"}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="text-muted small">{t.createdOn}</td>
                        <td>
                          <span className={`badge bg-${conf.cls} ${conf.cls === "warning" || conf.cls === "secondary" ? "text-dark" : ""} rounded-pill d-inline-flex align-items-center gap-1`}>
                            <StatusIcon size={12} />
                            {conf.label}
                          </span>
                        </td>
                        <td className="text-muted small">{t.lastUpdate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {tickets.length === 0 && (
              <div className="text-center text-muted py-4">You haven't raised any service requests yet.</div>
            )}
          </div>
        </div>

        {showForm && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="card border-0 shadow-lg" style={{ maxWidth: 480, width: "100%" }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h6 className="fw-bold mb-0">New Service Request</h6>
                  <button className="btn btn-sm btn-link text-muted p-0" onClick={() => setShowForm(false)}><X size={18} /></button>
                </div>

                <div className="mb-3">
                  <label className="form-label small text-muted">Category</label>
                  <select className="form-select form-select-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {serviceCategories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small text-muted">Subject</label>
                  <input type="text" className="form-control form-control-sm" placeholder="Brief summary of your request" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label small text-muted">Details</label>
                  <textarea className="form-control form-control-sm" rows={3} placeholder="Describe your request in detail..." value={details} onChange={(e) => setDetails(e.target.value)}></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label small text-muted">Priority</label>
                  <div className="d-flex gap-2">
                    {priorities.map((p) => (
                      <button key={p} type="button" className={`btn btn-sm ${priority === p ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setPriority(p)}>{p}</button>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={submitTicket}><Send size={14} /> Submit Request</button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
