import React, { useEffect, useState, use } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';


const randomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r},${g},${b},1)`;
};

const SemesterWiseResult = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [semesterResults, setSemesterResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get(`/academic-result?email=${user.email}`)
      .then(res => {
        if (cancelled) return;
        const completed = (res.data || []).filter(s => !s.ongoing);
        let totalPoints = 0;
        let totalCredits = 0;
        const cumulative = completed.map(sem => {
          sem.courses.forEach(c => {
            if (c.point !== null) {
              totalPoints += c.point * c.credit;
              totalCredits += c.credit;
            }
          });
          return {
            semester: sem.semester,
            cgpa: totalCredits ? Number((totalPoints / totalCredits).toFixed(2)) : 0,
          };
        });
        setSemesterResults(cumulative);
      })
      .catch(alert)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  if (!user || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const chartData = semesterResults.map((item) => ({
    name: item.semester,
    CGPA: item.cgpa,
    color: randomColor(),
  }));

  if (chartData.length === 0) {
    return (
      <p className="text-center text-secondary pt-5">No semester result available.</p>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '900px', height: '460px' }}>
      <h5 style={{ textAlign: 'center', marginBottom: '8px' }}>
        Semester-wise CGPA Performance
      </h5>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 4]} ticks={["00", "01", "02", "03", "04"]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="CGPA" barSize={45} radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
            <LabelList dataKey="CGPA" position="inside" fill="#333" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SemesterWiseResult;
