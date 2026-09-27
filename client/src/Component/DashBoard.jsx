import React, { useEffect, useState, use } from 'react'
import Dash from './Dash';
import SemesterWiseResult from './SemesterWiseResult';
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { Clock3, MapPin, User2 } from "lucide-react";

export default function DashBoard() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [student, setStudent] = useState(null);
  const [classRoutine, setClassRoutine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([
      axiosSecure.get(`/students/profile?email=${user.email}`),
      axiosSecure.get(`/routine?email=${user.email}`),
    ])
      .then(([profileRes, routineRes]) => {
        if (cancelled) return;
        setStudent(profileRes.data);
        setClassRoutine(routineRes.data);
      })
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

  const routine = classRoutine?.routine || {};
  const courseDetails = classRoutine?.courseDetails || {};

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[new Date().getDay()];

  const todaysClasses = Object.entries(routine[todayName] || {})
    .map(([time, info]) => ({ time, ...info }))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div>
      <main className='p-4' style={{ backgroundColor: "#F9F9F9" }}>
        <span className='h2 m-0 fw-bold'>Dashboard</span>
        <p className="text-secondary">Student Portal{student ? ` · ${student.name}` : ''}</p>

        <Dash></Dash>

        <section className="rounded card bg-white p-4 mt-5">
          <span className="h2">Today's Routine - {todayName}</span>

          {todaysClasses.length > 0 ? (
            <div className="mt-3 d-flex flex-column gap-2">
              {todaysClasses.map((cls, i) => (
                <div
                  key={i}
                  className={`d-flex flex-wrap justify-content-between align-items-center rounded p-3 ${
                    cls.type === "Lab"
                      ? "bg-info bg-opacity-10 border border-info"
                      : "bg-primary bg-opacity-10 border border-primary"
                  }`}
                >
                  <div>
                    <div className="fw-bold">
                      {cls.code} — {courseDetails[cls.code]?.title}
                    </div>
                    <div className="text-secondary small d-flex flex-wrap gap-3 mt-1">
                      <span className="d-flex align-items-center gap-1">
                        <User2 size={13} /> {courseDetails[cls.code]?.faculty}
                      </span>
                      <span className="d-flex align-items-center gap-1">
                        <MapPin size={13} /> Room {cls.room}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-1 text-secondary small">
                    <Clock3 size={13} />
                    {cls.time}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-center text-secondary pt-5 d-block">
              No routine available for today.
            </span>
          )}
        </section>

        <section className="rounded card bg-white p-4 mt-5">
          <span className="h2">Semester Wise Result</span>
          <SemesterWiseResult></SemesterWiseResult>
        </section>
      </main>
    </div>
  )
}
