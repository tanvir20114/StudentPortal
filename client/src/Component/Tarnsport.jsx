import React, { useState, useMemo, useEffect, use } from "react";
import { Bus, MapPin, CheckCircle2, Clock, XCircle, Wallet, CalendarClock, CreditCard } from "lucide-react";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

const applicationStatuses = {
  none: { label: "No Application", icon: XCircle, cls: "secondary" },
  pending: { label: "Under Review", icon: Clock, cls: "warning" },
  approved: { label: "Approved", icon: CheckCircle2, cls: "success" },
};

export default function TransportCardApply() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [routes, setRoutes] = useState([]);
  const [pickupPoints, setPickupPoints] = useState({});
  const [currentStatus, setCurrentStatus] = useState("none");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ route: "", pickup: "", semester: "", paymentMethod: "bKash" });

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get(`/transport-card?email=${user.email}`)
      .then(res => {
        if (cancelled) return;
        const data = res.data;
        setRoutes(data.routes || []);
        setPickupPoints(data.pickupPoints || {});
        setCurrentStatus(data.currentStatus || "none");
        const defaultRoute = data.defaultForm?.route || data.routes?.[0]?.name || "";
        setForm({
          route: defaultRoute,
          pickup: data.defaultForm?.pickup || data.pickupPoints?.[defaultRoute]?.[0] || "",
          semester: data.defaultForm?.semester || "",
          paymentMethod: data.defaultForm?.paymentMethod || "bKash",
        });
      })
      .catch(alert)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const selectedRoute = useMemo(() => routes.find((r) => r.name === form.route), [form.route, routes]);

  if (!user || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  function handleRouteChange(routeName) {
    setForm({ ...form, route: routeName, pickup: pickupPoints[routeName]?.[0] || "" });
  }

  function handleSubmit() {
    axiosSecure.post('/transport-card/apply', form).then(() => {
      setCurrentStatus("pending");
    }).catch(err => {
      alert(err.response?.data?.message || 'আবেদন জমা দেওয়া যায়নি।');
    });
  }

  const statusConf = applicationStatuses[currentStatus];
  const StatusIcon = statusConf.icon;

  return (
    <div className="bg-light min-vh-100">
      <div className="container-fluid p-3 p-md-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <div><h2 className='fw-bold m-0'>Transport Card Application</h2></div>
          <span className={`badge bg-${statusConf.cls} ${currentStatus === "pending" ? "text-dark" : ""} rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2`}>
            <StatusIcon size={14} />
            {statusConf.label}
          </span>
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                    <CreditCard size={20} className="text-primary" />
                  </div>
                  <h6 className="fw-bold mb-0">Card Details</h6>
                </div>

                {currentStatus === "none" && (
                  <p className="text-muted small">You don't have an active transport card application for this semester. Fill out the form to apply.</p>
                )}
                {currentStatus === "pending" && (
                  <>
                    <p className="text-muted small mb-2">Your application is under review by the Transport Office. You'll be notified once it's approved.</p>
                    <ul className="list-unstyled small mb-0">
                      <li className="d-flex align-items-center gap-2 py-1"><MapPin size={14} className="text-muted" />{form.route}</li>
                      <li className="d-flex align-items-center gap-2 py-1"><MapPin size={14} className="text-muted" />Pickup: {form.pickup}</li>
                      <li className="d-flex align-items-center gap-2 py-1"><Wallet size={14} className="text-muted" />৳{" "}{selectedRoute?.fee?.toLocaleString("en-BD")} /semester</li>
                    </ul>
                  </>
                )}
                {currentStatus === "approved" && (
                  <>
                    <p className="text-muted small mb-2">Your transport card is active for {form.semester}.</p>
                    <ul className="list-unstyled small mb-0">
                      <li className="d-flex align-items-center gap-2 py-1"><MapPin size={14} className="text-muted" />{form.route}</li>
                      <li className="d-flex align-items-center gap-2 py-1"><MapPin size={14} className="text-muted" />Pickup: {form.pickup}</li>
                      <li className="d-flex align-items-center gap-2 py-1"><CalendarClock size={14} className="text-muted" />Valid for {form.semester}</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Bus size={20} className="text-primary" />
                  <h6 className="fw-bold mb-0">Application Form</h6>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small text-muted">Route</label>
                    <select className="form-select form-select-sm" value={form.route} onChange={(e) => handleRouteChange(e.target.value)} disabled={currentStatus !== "none"}>
                      {routes.map((r) => (<option key={r.name} value={r.name}>{r.name} — ৳{r.fee}</option>))}
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small text-muted">Pickup Point</label>
                    <select className="form-select form-select-sm" value={form.pickup} onChange={(e) => setForm({ ...form, pickup: e.target.value })} disabled={currentStatus !== "none"}>
                      {(pickupPoints[form.route] || []).map((p) => (<option key={p} value={p}>{p}</option>))}
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small text-muted">Semester</label>
                    <input type="text" className="form-control form-control-sm" placeholder="e.g. Fall 2026" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} disabled={currentStatus !== "none"} />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small text-muted">Payment Method</label>
                    <select className="form-select form-select-sm" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} disabled={currentStatus !== "none"}>
                      <option>bKash</option>
                      <option>Nagad</option>
                      <option>Bank</option>
                    </select>
                  </div>
                </div>

                {currentStatus === "none" && (
                  <button className="btn btn-primary btn-sm mt-3" onClick={handleSubmit}>Submit Application</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
