import React, { useEffect, useState, use } from 'react'
import { MdOutlineFactCheck } from "react-icons/md";
import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

export default function Attendance() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const MIN_REQUIRED_PERCENT = 75;

  useEffect(() => {
    if (!user?.email) return;

    let cancelled = false;
    setLoading(true);

    axiosSecure
      .get(`/attendance?email=${user.email}`)
      .then((res) => {
        if (!cancelled) setAttendanceData(res.data);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const getPercent = (present, total) => total === 0 ? 0 : Math.round((present / total) * 100);

  const overallTotal = attendanceData.reduce((sum, c) => sum + c.totalClass, 0);
  const overallPresent = attendanceData.reduce((sum, c) => sum + c.present, 0);
  const overallPercent = getPercent(overallPresent, overallTotal);

  const getStatusColor = (percent) => {
    if (percent >= MIN_REQUIRED_PERCENT) return "#198754";
    if (percent >= MIN_REQUIRED_PERCENT - 10) return "#ffc107";
    return "#dc3545";
  };

  return (
    <div className="p-4" style={{ minHeight: "100vh", backgroundColor: "#F4F6FB" }}>

      <div className="d-flex align-items-center gap-2 mb-4">
        <MdOutlineFactCheck className="h2 m-0" style={{ color: "#182444" }} />
        <h3 className="m-0 fw-bold" style={{ color: "#182444" }}>Attendance</h3>
      </div>

      {loading ? (
        <p className="text-muted">লোড হচ্ছে...</p>
      ) : (
        <>
          <div className="bg-white rounded shadow-sm p-4 mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <p className="m-0 text-muted" style={{ fontSize: "0.9rem" }}>মোট উপস্থিতি (সব কোর্স মিলিয়ে)</p>
                <h2 className="m-0 fw-bold" style={{ color: getStatusColor(overallPercent) }}>
                  {overallPercent}%
                </h2>
                <p className="m-0 text-muted" style={{ fontSize: "0.85rem" }}>{overallPresent} / {overallTotal} ক্লাস উপস্থিত</p>
              </div>

              <div style={{ width: "120px", height: "120px", position: "relative" }}>
                <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%" }}>
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E9ECF5"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={getStatusColor(overallPercent)}
                    strokeWidth="3"
                    strokeDasharray={`${overallPercent}, 100`}
                  />
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                  <b style={{ color: "#182444" }}>{overallPercent}%</b>
                </div>
              </div>
            </div>

            {overallPercent < MIN_REQUIRED_PERCENT && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mt-3 mb-0">
                <FaExclamationTriangle />
                আপনার সামগ্রিক উপস্থিতি ন্যূনতম {MIN_REQUIRED_PERCENT}% এর নিচে। এক্সাম ক্লিয়ারেন্সে সমস্যা হতে পারে।
              </div>
            )}
          </div>

          <h5 className="fw-bold mb-3" style={{ color: "#182444" }}>কোর্সভিত্তিক উপস্থিতি</h5>

          <div className="bg-white rounded shadow-sm p-3">
            <div className="table-responsive">
              <table className="table align-middle m-0">
                <thead>
                  <tr style={{ color: "#182444" }}>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th className="text-center">Total Class</th>
                    <th className="text-center">Present</th>
                    <th className="text-center">Percentage</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map(course => {
                    const percent = getPercent(course.present, course.totalClass);
                    const isOk = percent >= MIN_REQUIRED_PERCENT;
                    return (
                      <tr key={course._id || course.code}>
                        <td className="fw-bold">{course.code}</td>
                        <td>{course.title}</td>
                        <td className="text-center">{course.totalClass}</td>
                        <td className="text-center">{course.present}</td>
                        <td className="text-center">
                          <div className="d-flex align-items-center gap-2 justify-content-center">
                            <div className="progress" style={{ width: "80px", height: "8px" }}>
                              <div
                                className="progress-bar"
                                style={{ width: `${percent}%`, backgroundColor: getStatusColor(percent) }}
                              />
                            </div>
                            <span style={{ color: getStatusColor(percent), fontWeight: 600, minWidth: "36px" }}>
                              {percent}%
                            </span>
                          </div>
                        </td>
                        <td className="text-center">
                          {isOk ? (
                            <span className="badge d-inline-flex align-items-center gap-1" style={{ backgroundColor: "#E7F6EC", color: "#198754" }}>
                              <FaCheckCircle /> OK
                            </span>
                          ) : (
                            <span className="badge d-inline-flex align-items-center gap-1" style={{ backgroundColor: "#FDE8E8", color: "#dc3545" }}>
                              <FaExclamationTriangle /> Short
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {attendanceData.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">
                        কোনো অ্যাটেন্ডেন্স ডেটা পাওয়া যায়নি।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-muted mt-3" style={{ fontSize: "0.8rem" }}>
            * ন্যূনতম {MIN_REQUIRED_PERCENT}% উপস্থিতি এক্সাম ক্লিয়ারেন্সের জন্য বাধ্যতামূলক।
          </p>
        </>
      )}
    </div>
  )
}
