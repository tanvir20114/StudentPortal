import React, { useState, useEffect, use } from "react";
import { GraduationCap, CheckCircle2, XCircle, CalendarDays, MapPin, Wallet, Send } from "lucide-react";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

export default function Convocation() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [convocation, setConvocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get(`/convocation?email=${user.email}`)
      .then(res => { if (!cancelled) setConvocation(res.data); })
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
    );
  }

  const eligibility = convocation?.eligibility || {};
  const info = convocation?.info || {};
  const isEligible = eligibility.isEligible;

  return (
    <div className="container-fluid p-3 p-md-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div>
          <h2 className='fw-bold m-0'>Convocation</h2>
          <div className="text-muted small">{info.title}</div>
        </div>
        <span className={`badge ${isEligible ? 'bg-success' : 'bg-danger'} d-inline-flex align-items-center gap-1 px-3 py-2`}>
          {isEligible ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          {isEligible ? "Eligible" : "Not Eligible"}
        </span>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <GraduationCap size={20} className="text-primary" />
              <div>
                <div className="text-muted small">CGPA Cleared</div>
                <div className="fw-bold">{eligibility.cgpaCleared ? "হ্যাঁ" : "না"}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <Wallet size={20} className="text-success" />
              <div>
                <div className="text-muted small">Dues Cleared</div>
                <div className="fw-bold">{eligibility.duesCleared ? "হ্যাঁ" : "না"}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <CheckCircle2 size={20} className="text-info" />
              <div>
                <div className="text-muted small">Thesis Submitted</div>
                <div className="fw-bold">{eligibility.thesisSubmitted ? "হ্যাঁ" : "না"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="fw-bold mb-3">{info.title}</h6>
          <ul className="list-unstyled small mb-3">
            <li className="d-flex align-items-center gap-2 py-1"><CalendarDays size={14} className="text-muted" /> {info.date}, {info.reportingTime}</li>
            <li className="d-flex align-items-center gap-2 py-1"><MapPin size={14} className="text-muted" /> {info.venue}</li>
            <li className="d-flex align-items-center gap-2 py-1"><Wallet size={14} className="text-muted" /> ফি: ৳{info.fee}</li>
            <li className="d-flex align-items-center gap-2 py-1"><CalendarDays size={14} className="text-muted" /> রেজিস্ট্রেশনের শেষ তারিখ: {info.registrationDeadline}</li>
          </ul>

          {isEligible ? (
            <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" disabled={applied} onClick={() => setApplied(true)}>
              <Send size={14} /> {applied ? "আবেদন করা হয়েছে" : "কনভোকেশনের জন্য আবেদন করুন"}
            </button>
          ) : (
            <p className="text-danger small mb-0">আপনি এখনো কনভোকেশনের জন্য যোগ্য নন। উপরের শর্তগুলো পূরণ করুন।</p>
          )}
        </div>
      </div>
    </div>
  );
}
