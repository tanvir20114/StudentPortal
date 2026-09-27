import React, { useState, useEffect, useMemo, use } from "react";
import { CheckCircle2, Loader2, Clock, RefreshCcw } from "lucide-react";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

const statusConfig = {
  published: { label: "Published", icon: CheckCircle2, badge: "success" },
  processing: { label: "Processing", icon: Loader2, badge: "warning" },
  not_published: { label: "Not Published", icon: Clock, badge: "secondary" },
};

export default function LiveResult() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(new Date());

  const fetchResults = () => {
    if (!user?.email) return;
    axiosSecure.get(`/live-results?email=${user.email}`)
      .then(res => setResults(res.data))
      .catch(alert)
      .finally(() => {
        setLoading(false);
        setLastChecked(new Date());
      });
  };

  useEffect(() => {
    fetchResults();
  }, [user]);

  const pendingCount = useMemo(
    () => results.filter((r) => r.status !== "published").length,
    [results]
  );

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
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div>
          <h2 className='fw-bold m-0'>Live Result</h2>
          <p className="text-muted small m-0">
            {pendingCount > 0 ? `${pendingCount} টা রেজাল্ট এখনো বাকি` : "সব রেজাল্ট প্রকাশিত"}
          </p>
        </div>
        <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" onClick={fetchResults}>
          <RefreshCcw size={13} /> রিফ্রেশ
        </button>
      </div>

      <p className="text-muted" style={{ fontSize: "0.8rem" }}>
        সর্বশেষ চেক করা হয়েছে: {lastChecked.toLocaleTimeString('en-GB')}
      </p>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Semester</th><th>Exam Type</th><th>Status</th><th>Published On</th><th className="text-end">SGPA</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                  const conf = statusConfig[r.status];
                  const StatusIcon = conf.icon;
                  return (
                    <tr key={i}>
                      <td className="fw-semibold">{r.semester}</td>
                      <td>{r.examType}</td>
                      <td>
                        <span className={`badge bg-${conf.badge} ${conf.badge === 'warning' || conf.badge === 'secondary' ? 'text-dark' : ''} rounded-pill d-inline-flex align-items-center gap-1`}>
                          <StatusIcon size={12} /> {conf.label}
                        </span>
                      </td>
                      <td className="text-muted small">{r.publishedOn || '—'}</td>
                      <td className="text-end">{r.sgpa ?? '—'}</td>
                    </tr>
                  );
                })}
                {results.length === 0 && (
                  <tr><td colSpan={5} className="text-center text-muted py-4">কোনো রেজাল্ট পাওয়া যায়নি।</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
