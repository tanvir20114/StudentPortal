import React, { use, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext'
import useAxiosSecure from '../hooks/useAxiosSecure'
import { Award, CheckCircle2, Clock, Wallet, PlusCircle, X, Percent } from "lucide-react";

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)

export default function Waiver() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [showForm, setShowForm] = useState(false);
  const [waivers, setWaivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    semester: "",
    type: "Merit Scholarship",
    percentage: "",
    remarks: "",
  });

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get(`/waivers?email=${user.email}`)
      .then(res => { if (!cancelled) setWaivers(res.data); })
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
    )
  }

  const summary = {
    totalApplications: waivers.length,
    approvedCount: waivers.filter((w) => w.status === "approved").length,
    pendingCount: waivers.filter((w) => w.status === "pending").length,
    totalWaivedAmount: waivers
      .filter((w) => w.status === "approved")
      .reduce((s, w) => s + (w.amountOn * w.percentage) / 100, 0),
  };

  function handleSubmit() {
    if (!form.semester || !form.percentage) return;
    axiosSecure.post('/waivers', {
      semester: form.semester,
      type: form.type,
      percentage: Number(form.percentage),
      amountOn: 45000,
      remarks: form.remarks || undefined,
    }).then(res => {
      setWaivers(prev => [res.data, ...prev]);
      setForm({ semester: "", type: "Merit Scholarship", percentage: "", remarks: "" });
      setShowForm(false);
    }).catch(err => {
      alert(err.response?.data?.message || 'আবেদন জমা দেওয়া যায়নি।');
    });
  }

  return (
    <div className="p-4 d-flex flex-column gap-4" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="d-flex justify-content-between align-items-center">
        <div><h2 className='fw-bold m-0'>Waiver Information</h2></div>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={() => setShowForm(true)}>
          <PlusCircle size={14} /> Apply for Waiver
        </button>
      </div>

      <div className="row g-3 ">
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, }} className='d-flex bg-primary justify-content-center align-items-center'><Award size={20} /></div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Total Applications</h6>
              <h5 className='fw-bold m-0'>{summary.totalApplications}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, }} className='d-flex bg-success justify-content-center align-items-center'><CheckCircle2 size={20} /></div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Approved</h6>
              <h5 className='fw-bold m-0'>{summary.approvedCount}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, }} className='d-flex bg-warning justify-content-center align-items-center'><Clock size={20} /></div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Pending</h6>
              <h5 className='fw-bold m-0'>{summary.pendingCount}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, }} className='d-flex bg-info justify-content-center align-items-center'><Wallet size={20} /></div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Total Waived</h6>
              <h5 className='fw-bold m-0'>{formatCurrency(summary.totalWaivedAmount)}</h5>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">New Waiver Application</h6>
              <button className="btn btn-sm btn-link text-muted p-0" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <div>
              <div className="row g-3">
                <div className="col-12 col-md-3">
                  <label className="form-label small text-muted">Semester</label>
                  <input type="text" className="form-control form-control-sm" placeholder="e.g. Fall 2026" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} required />
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label small text-muted">Waiver Type</label>
                  <select className="form-select form-select-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option>Merit Scholarship</option>
                    <option>Sibling Waiver</option>
                    <option>Financial Hardship</option>
                    <option>Staff / Faculty Waiver</option>
                    <option>Sports / Cultural Quota</option>
                  </select>
                </div>
                <div className="col-12 col-md-2">
                  <label className="form-label small text-muted">Percentage (%)</label>
                  <div className="input-group input-group-sm">
                    <input type="number" min="0" max="100" className="form-control" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: e.target.value })} required />
                    <span className="input-group-text"><Percent size={12} /></span>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small text-muted">Remarks / Justification</label>
                  <input type="text" className="form-control form-control-sm" placeholder="Optional note" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
                </div>
              </div>
              <div className="mt-3 d-flex gap-2">
                <button type="button" onClick={handleSubmit} className="btn btn-primary btn-sm">Submit Application</button>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="shadow shadow-sm rounded bg-white p-3">
        <div className="d-flex justify-content-between"><h3 className='fw-bold'>Waiver History</h3></div>
        <table style={{ width: "100%" }} className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th><th>Semester</th><th>Waiver Type</th><th>Percentage</th><th>Waived Amount</th>
              <th className='text-end'>Applied On</th><th className='text-end'>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {waivers.map((row, index) => {
              const waivedAmount = (row.amountOn * row.percentage) / 100;
              return (
                <tr key={row._id || index} className='py-1 border-bottom'>
                  <td>{index + 1}</td>
                  <td>{row.semester}</td>
                  <td><div className="badge rounded-pill bg-secondary">{row.type}</div></td>
                  <td>{row.percentage}%</td>
                  <td>{formatCurrency(waivedAmount)}</td>
                  <td className='text-end'>{row.appliedOn}</td>
                  <td className='text-end'>{row.remarks}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
