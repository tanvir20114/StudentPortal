import React, { use, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext'
import useAxiosSecure from '../hooks/useAxiosSecure'
import { HiMenu } from 'react-icons/hi'

export default function Nav({ onToggleSidebar }) {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    axiosSecure.get(`/students/profile?email=${user.email}`)
      .then(res => { if (!cancelled) setStudent(res.data); })
      .catch(alert);
    return () => { cancelled = true; };
  }, [user]);

  return (
    <nav
      className='d-flex container-fluid justify-content-between align-items-center px-3 px-md-4'
      style={{ height: "12vh", minHeight: "64px" }}
    >
      <button
        type="button"
        className="btn d-md-none p-0 border-0 nav-toggle-btn"
        onClick={onToggleSidebar}
        aria-label="Toggle navigation menu"
      >
        <HiMenu />
      </button>

      <span className="d-none d-md-block" />

      <div className="d-flex flex-column gap-1 text-end text-md-start">
        <h6 className="p-0 m-0 fw-bold nav-student-name" style={{ transform: "scaleY(1.2)" }}>
          {student?.name}
        </h6>
        <p className="m-0 p-0 nav-student-id">{student?.studentId}</p>
      </div>
    </nav>
  )
}