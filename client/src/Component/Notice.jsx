import React, { useEffect, useState, use } from 'react'
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { MdCampaign } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { BsPinAngleFill } from "react-icons/bs";

export default function Notice() {

  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get('/notices')
      .then(res => { if (!cancelled) setNotices(res.data); })
      .catch(alert)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const categories = ['All', 'Academic', 'Exam', 'Payment', 'General'];

  const filteredNotices = notices
    .filter(n => filter === 'All' || n.category === filter)
    .filter(n => n.title.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => (b.pinned - a.pinned) || (new Date(b.date) - new Date(a.date)));

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4" style={{ minHeight: "100vh", backgroundColor: "#F4F6FB" }}>

      <div className="d-flex align-items-center gap-2 mb-4">
        <MdCampaign className="h2 m-0" style={{ color: "#182444" }} />
        <h3 className="m-0 fw-bold" style={{ color: "#182444" }}>Notice / Announcement</h3>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div className="d-flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="btn btn-sm"
              style={{ backgroundColor: filter === cat ? "#182444" : "#E9ECF5", color: filter === cat ? "#fff" : "#182444", border: "none", borderRadius: "20px", padding: "6px 16px" }}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="নোটিশ খুঁজুন..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="form-control"
          style={{ maxWidth: "260px" }}
        />
      </div>

      {loading ? (
        <p className="text-muted">লোড হচ্ছে...</p>
      ) : filteredNotices.length === 0 ? (
        <p className="text-muted">কোনো নোটিশ পাওয়া যায়নি।</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredNotices.map(notice => (
            <div
              key={notice._id}
              className="p-3 rounded shadow-sm bg-white"
              style={{ borderLeft: notice.pinned ? "5px solid #182444" : "5px solid #C7CEDE" }}
            >
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2">
                  {notice.pinned && <BsPinAngleFill style={{ color: "#182444" }} />}
                  <h6 className="m-0 fw-bold" style={{ color: "#182444" }}>{notice.title}</h6>
                </div>
                <span className="badge" style={{ backgroundColor: "#E9ECF5", color: "#182444", fontWeight: 500 }}>
                  {notice.category}
                </span>
              </div>

              <p className="text-muted mt-2 mb-1" style={{ fontSize: "0.95rem" }}>{notice.details}</p>

              <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: "0.8rem" }}>
                <FaRegClock />
                <span>{new Date(notice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
