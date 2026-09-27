import React, { useEffect, useState, use } from 'react'
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlinePayment, MdOutlineGrade, MdOutlineCampaign, MdOutlineSettings } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

export default function NotificationCenter() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const typeMeta = {
    Payment: { icon: <MdOutlinePayment />, color: "#dc3545" },
    Result: { icon: <MdOutlineGrade />, color: "#6f42c1" },
    Notice: { icon: <MdOutlineCampaign />, color: "#0d6efd" },
    System: { icon: <MdOutlineSettings />, color: "#6c757d" },
  };

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get(`/notifications?email=${user.email}`)
      .then(res => { if (!cancelled) setNotifications(res.data); })
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

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    axiosSecure.patch(`/notifications/${id}/read`).then(() => {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    }).catch(alert);
  };

  const markAllAsRead = () => {
    axiosSecure.patch(`/notifications/read-all`).then(() => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }).catch(alert);
  };

  const filteredNotifications = notifications
    .filter(n => {
      if (filter === 'All') return true;
      if (filter === 'Unread') return !n.read;
      return n.type === filter;
    })
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  const timeAgo = (dateStr) => {
    const diffMs = new Date() - new Date(dateStr);
    const diffHr = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHr < 1) return "কিছুক্ষণ আগে";
    if (diffHr < 24) return `${diffHr} ঘণ্টা আগে`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} দিন আগে`;
  };

  const filters = ['All', 'Unread', 'Payment', 'Result', 'Notice', 'System'];

  return (
    <div className="p-4" style={{ minHeight: "100vh", backgroundColor: "#F4F6FB" }}>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div className="d-flex align-items-center gap-2">
          <IoNotificationsOutline className="h2 m-0" style={{ color: "#182444" }} />
          <h3 className="m-0 fw-bold" style={{ color: "#182444" }}>Notification Center</h3>
          {unreadCount > 0 && (
            <span className="badge rounded-pill" style={{ backgroundColor: "#dc3545" }}>{unreadCount} নতুন</span>
          )}
        </div>

        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn btn-sm" style={{ backgroundColor: "#182444", color: "#fff", border: "none" }}>
            Mark as read
          </button>
        )}
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="btn btn-sm"
            style={{
              backgroundColor: filter === f ? "#182444" : "#E9ECF5",
              color: filter === f ? "#fff" : "#182444",
              border: "none",
              borderRadius: "20px",
              padding: "6px 16px"
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredNotifications.length === 0 ? (
        <p className="text-muted">কোনো নোটিফিকেশন পাওয়া যায়নি।</p>
      ) : (
        <div className="d-flex flex-column gap-2">
          {filteredNotifications.map(n => {
            const meta = typeMeta[n.type] || typeMeta.System;
            return (
              <div
                key={n._id}
                onClick={() => !n.read && markAsRead(n._id)}
                className="bg-white rounded shadow-sm p-3 d-flex align-items-start gap-3"
                style={{
                  cursor: n.read ? "default" : "pointer",
                  borderLeft: n.read ? "4px solid transparent" : `4px solid ${meta.color}`,
                  backgroundColor: n.read ? "#fff" : "#FAFBFF"
                }}
              >
                <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "40px", height: "40px", backgroundColor: `${meta.color}20`, color: meta.color, fontSize: "1.2rem" }}>
                  {meta.icon}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-1">
                    <p className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: "#182444" }}>
                      {!n.read && <FaCircle size={8} style={{ color: "#dc3545" }} />}
                      {n.title}
                    </p>
                    <span className="text-muted" style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}>{timeAgo(n.time)}</span>
                  </div>
                  <p className="m-0 text-muted mt-1" style={{ fontSize: "0.9rem" }}>{n.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}
