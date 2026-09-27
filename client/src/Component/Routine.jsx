import React, { useState, useEffect, use } from "react";
import { CalendarDays, Clock3, MapPin, User2 } from "lucide-react";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

export default function ClassRoutine() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [view, setView] = useState("grid");
  const [classRoutine, setClassRoutine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get(`/routine?email=${user.email}`)
      .then(res => { if (!cancelled) setClassRoutine(res.data); })
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

  const days = classRoutine?.days || [];
  const timeSlots = classRoutine?.timeSlots || [];
  const routine = classRoutine?.routine || {};
  const courseDetails = classRoutine?.courseDetails || {};

  const flatSchedule = days
    .flatMap((day) =>
      Object.entries(routine[day] || {}).map(([time, info]) => ({ day, time, ...info }))
    )
    .sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));

  return (
    <div className='p-4 d-flex flex-column gap-4' style={{ minHeight: "100vh", width: "100%", backgroundColor: "#F8F9FA" }}>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div><h2 className='fw-bold m-0'>Class Routine</h2>
          <p className="m-0">Section {classRoutine?.section}</p></div>

        <div className="btn-group">
          <button className={`btn btn-sm ${view === "grid" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setView("grid")}>Grid</button>
          <button className={`btn btn-sm ${view === "list" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setView("list")}>List</button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered align-middle text-center mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ minWidth: 90 }}><CalendarDays size={14} className="me-1" />Day</th>
                    {timeSlots.map((t) => (<th key={t} className="small" style={{ minWidth: 120 }}>{t}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) => (
                    <tr key={day}>
                      <td className="fw-semibold bg-light">{day}</td>
                      {timeSlots.map((t) => {
                        const cls = routine[day]?.[t];
                        return (
                          <td key={t} className="p-1">
                            {cls ? (
                              <div className={`rounded p-2 text-start ${cls.type === "Lab" ? "bg-info bg-opacity-10 border border-info" : "bg-primary bg-opacity-10 border border-primary"}`}>
                                <div className="fw-bold small">{cls.code}</div>
                                <div className="text-muted" style={{ fontSize: 11 }}>Room {cls.room}</div>
                              </div>
                            ) : (<span className="text-muted">—</span>)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Day</th><th>Time</th><th>Course Code</th><th>Course Title</th><th>Faculty</th><th>Room</th><th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {flatSchedule.map((item, i) => (
                    <tr key={i}>
                      <td className="fw-semibold">{item.day}</td>
                      <td><div className="d-flex align-items-center gap-1 text-muted small"><Clock3 size={13} />{item.time}</div></td>
                      <td className="fw-semibold">{item.code}</td>
                      <td>{courseDetails[item.code]?.title}</td>
                      <td><div className="d-flex align-items-center gap-1 text-muted small"><User2 size={13} />{courseDetails[item.code]?.faculty}</div></td>
                      <td><div className="d-flex align-items-center gap-1 text-muted small"><MapPin size={13} />{item.room}</div></td>
                      <td>{item.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
