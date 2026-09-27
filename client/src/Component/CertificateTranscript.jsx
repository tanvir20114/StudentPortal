import React, { useState, useMemo, useEffect, use } from "react";
import { FileText, CheckCircle2, Clock, XCircle, Send, X, Wallet, Truck, Download, Plus, Minus } from "lucide-react";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

const statusMap = {
  ready: { icon: CheckCircle2, cls: "success", label: "Ready" },
  processing: { icon: Clock, cls: "warning", label: "Processing" },
  rejected: { icon: XCircle, cls: "danger", label: "Rejected" },
};

export default function CertificateTranscript() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [documentTypes, setDocumentTypes] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [delivery, setDelivery] = useState("Pickup");

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get(`/certificate-transcript?email=${user.email}`)
      .then(res => {
        if (cancelled) return;
        setDocumentTypes(res.data.documentTypes || []);
        setRequests(res.data.requests || []);
        setSelectedType(res.data.documentTypes?.[0]?._id || "");
      })
      .catch(alert)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const selectedDoc = useMemo(
    () => documentTypes.find((d) => d._id === selectedType),
    [selectedType, documentTypes]
  );

  const estimatedFee = useMemo(() => {
    if (!selectedDoc) return 0;
    const base = selectedDoc.fee * quantity;
    return delivery === "Courier" ? base + 150 : base;
  }, [selectedDoc, quantity, delivery]);

  const summary = useMemo(() => {
    return {
      total: requests.length,
      ready: requests.filter((r) => r.status === "ready").length,
      processing: requests.filter((r) => r.status === "processing").length,
    };
  }, [requests]);

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
    setSelectedType(documentTypes[0]?._id || "");
    setQuantity(1);
    setDelivery("Pickup");
    setShowForm(true);
  }

  function submitRequest() {
    if (!selectedDoc) return;
    axiosSecure.post('/certificate-transcript', {
      documentTypeId: selectedDoc._id,
      quantity,
      delivery,
    }).then(res => {
      setRequests(prev => [res.data, ...prev]);
      setShowForm(false);
    }).catch(err => {
      alert(err.response?.data?.message || 'অনুরোধ জমা দেওয়া যায়নি।');
    });
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container-fluid p-3 p-md-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <div><h2 className='fw-bold m-0'>Certificate & Transcript</h2></div>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={openForm}>
            <Plus size={14} /> New Request
          </button>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  <FileText size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-muted small">Total Requests</div>
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
                  <div className="text-muted small">Ready for Pickup</div>
                  <div className="fw-bold">{summary.ready}</div>
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
                  <div className="text-muted small">Processing</div>
                  <div className="fw-bold">{summary.processing}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h6 className="fw-bold mb-3">Request History</h6>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th><th>Document Type</th><th className="text-center">Qty</th><th>Delivery</th>
                    <th className="text-end">Fee (৳)</th><th>Requested On</th><th>Status</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r, i) => {
                    const StatusIcon = statusMap[r.status].icon;
                    return (
                      <tr key={r._id || i}>
                        <td className="text-muted">{i + 1}</td>
                        <td className="fw-semibold">{r.type}</td>
                        <td className="text-center">{r.quantity}</td>
                        <td><div className="d-flex align-items-center gap-1 text-muted small"><Truck size={13} />{r.delivery}</div></td>
                        <td className="text-end">{r.fee.toLocaleString("en-BD")}</td>
                        <td>{r.requestedOn}</td>
                        <td>
                          <span className={`badge bg-${statusMap[r.status].cls} ${r.status === "processing" ? "text-dark" : ""} rounded-pill d-inline-flex align-items-center gap-1`}>
                            <StatusIcon size={12} />
                            {statusMap[r.status].label}
                          </span>
                        </td>
                        <td>
                          {r.status === "ready" && (
                            <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"><Download size={12} /> Download</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {requests.length === 0 && (
              <div className="text-center text-muted py-4">No document requests yet.</div>
            )}
          </div>
        </div>

        {showForm && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="card border-0 shadow-lg" style={{ maxWidth: 480, width: "100%" }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h6 className="fw-bold mb-0">New Document Request</h6>
                  <button className="btn btn-sm btn-link text-muted p-0" onClick={() => setShowForm(false)}><X size={18} /></button>
                </div>

                <div className="mb-3">
                  <label className="form-label small text-muted">Document Type</label>
                  <select className="form-select form-select-sm" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    {documentTypes.map((d) => (
                      <option key={d._id} value={d._id}>{d.name} — ৳{d.fee}/copy</option>
                    ))}
                  </select>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label small text-muted">Quantity</label>
                    <div className="input-group input-group-sm">
                      <button className="btn btn-outline-secondary" type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}><Minus size={12} /></button>
                      <input type="text" className="form-control text-center" value={quantity} readOnly />
                      <button className="btn btn-outline-secondary" type="button" onClick={() => setQuantity((q) => q + 1)}><Plus size={12} /></button>
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="form-label small text-muted">Delivery Method</label>
                    <select className="form-select form-select-sm" value={delivery} onChange={(e) => setDelivery(e.target.value)}>
                      <option>Pickup</option>
                      <option>Courier</option>
                    </select>
                  </div>
                </div>

                <div className="alert alert-light border d-flex justify-content-between align-items-center py-2 mb-3">
                  <span className="small text-muted d-flex align-items-center gap-1"><Wallet size={13} /> Estimated Fee</span>
                  <span className="fw-bold">৳ {estimatedFee.toLocaleString("en-BD")}</span>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={submitRequest}><Send size={14} /> Submit Request</button>
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
