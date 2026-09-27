import React, { useEffect, useState, use } from 'react'
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaCircle } from "react-icons/fa";

export default function AcademicCalendar() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const categoryColors = {
    Registration: "#0d6efd",
    Exam: "#dc3545",
    Holiday: "#198754",
    Deadline: "#fd7e14",
    Result: "#6f42c1",
    Event: "#20c997",
  };

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get('/academic-calendar')
      .then(res => { if (!cancelled) setEvents(res.data); })
      .catch(alert)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const categories = ['All', ...Object.keys(categoryColors)];
  const today = new Date();

  const filteredEvents = events
    .filter(e => filter === 'All' || e.category === filter)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const groupedByMonth = filteredEvents.reduce((acc, event) => {
    const monthKey = new Date(event.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(event);
    return acc;
  }, {});

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
    <div className="p-2 p-md-4" style={{ minHeight: "100vh", backgroundColor: "#F4F6FB" }}>

      <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
        <MdOutlineCalendarMonth className="h2 m-0" style={{ color: "#182444" }} />
        <h3 className="m-0 fw-bold" style={{ color: "#182444" }}>Academic Calendar</h3>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="btn btn-sm d-flex align-items-center gap-1 flex-shrink-0"
            style={{ backgroundColor: filter === cat ? "#182444" : "#E9ECF5", color: filter === cat ? "#fff" : "#182444", border: "none", borderRadius: "20px", padding: "6px 14px" }}
          >
            {cat !== 'All' && <FaCircle size={8} style={{ color: filter === cat ? "#fff" : categoryColors[cat] }} />}
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted">লোড হচ্ছে...</p>
      ) : filteredEvents.length === 0 ? (
        <p className="text-muted">কোনো ইভেন্ট পাওয়া যায়নি।</p>
      ) : (
        Object.entries(groupedByMonth).map(([month, monthEvents]) => (
          <div key={month} className="mb-4">
            <h6 className="fw-bold mb-3" style={{ color: "#182444" }}>{month}</h6>
            <div className="d-flex flex-column gap-2 ps-2" style={{ borderLeft: "2px solid #E9ECF5" }}>
              {monthEvents.map(event => {
                const eventDate = new Date(event.date);
                const isPast = eventDate < today;
                return (
                  <div
                    key={event._id}
                    className="bg-white rounded shadow-sm p-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2"
                    style={{ opacity: isPast ? 0.6 : 1, borderLeft: `4px solid ${categoryColors[event.category] || "#ccc"}` }}
                  >
                    <div>
                      <p className="m-0 fw-bold" style={{ color: "#182444" }}>{event.title}</p>
                      <span className="badge mt-1" style={{ backgroundColor: `${categoryColors[event.category]}20`, color: categoryColors[event.category] }}>
                        {event.category}
                      </span>
                    </div>
                    <div className="text-start text-md-end w-100 w-md-auto">
                      <p className="m-0 fw-bold" style={{ color: "#182444" }}>
                        {eventDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      {isPast && <span className="text-muted" style={{ fontSize: "0.75rem" }}>সম্পন্ন</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
