import React, { use, useEffect, useState } from 'react'
import { RiBillFill } from "react-icons/ri";
import { FcPaid } from "react-icons/fc";
import { TbCalendarDue } from "react-icons/tb";
import { GrTransaction } from "react-icons/gr";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';
import './PaymentLedger.css'

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)

export default function PaymentLedger() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [semester, setSemester] = useState("All semester");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get(`/transactions?email=${user.email}`)
      .then(res => { if (!cancelled) setTransactions(res.data); })
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
    )
  }

  const filterSemester = transactions.filter((row) => semester === "All semester" || row.semester === semester)
  const semesters = ["All semester", ...new Set(transactions.map((row) => row.semester))]

  const totalPayable = filterSemester.reduce((s, r) => s + r.debit, 0);
  const totalPaid = filterSemester.reduce((s, r) => s + r.credit, 0);
  const totalDue = totalPayable - totalPaid;

  return (
    <div className='p-4 d-flex flex-column gap-4' style={{ minHeight: "100vh", width: "100%", backgroundColor: "#F8F9FA" }}>
      <div><h2 className='fw-bold m-0'>Payment Ledger</h2></div>

      <div className="row g-3 ">
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#E6F0FF" }} className='d-flex justify-content-center align-items-center'><RiBillFill size={20} /></div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Total Payable</h6>
              <h5 className='fw-bold m-0'>{formatCurrency(totalPayable)}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#E8F3EE" }} className='d-flex justify-content-center align-items-center'><FcPaid size={20} /></div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Total Paid</h6>
              <h5 className='fw-bold m-0'>{formatCurrency(totalPaid)}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#FBEAEC" }} className='d-flex justify-content-center align-items-center'><TbCalendarDue size={20} /></div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Total Due</h6>
              <h5 className='fw-bold m-0'>{formatCurrency(totalDue)}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="d-flex gap-3 bg-white rounded p-3 align-items-center shadow-sm shadow">
            <div style={{ borderRadius: "50%", height: "7vh", aspectRatio: 1, backgroundColor: "#FFF9E6" }} className='d-flex justify-content-center align-items-center'><GrTransaction size={20} /></div>
            <div className="d-flex flex-column gap-1">
              <h6 className='m-0'>Total Transactions</h6>
              <h5 className='fw-bold m-0'>{filterSemester.length}</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm p-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h6 className="fw-bold m-0">Transaction History</h6>
          <div className="dropdown">
            <select value={semester} onChange={(e) => setSemester(e.target.value)}>
              {semesters.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
       
       <div className="table-responsive">
  <table className="table" style={{ width: "100%" }}>
    <thead className="table-light">
      <tr>
        <th>#</th>
        <th>Date</th>
        <th>Semester</th>
        <th>Particulars</th>
        <th className="text-end">Debit</th>
        <th className="text-end">Credit</th>
        <th>Method</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {filterSemester.map((row, index) => (
        <tr key={row._id || index}>
          <td>{index + 1}</td>
          <td>{row.date}</td>
          <td>{row.semester}</td>
          <td>{row.particulars}</td>
          <td className="text-end">{row.debit ? formatCurrency(row.debit) : '—'}</td>
          <td className="text-end">{row.credit ? formatCurrency(row.credit) : '—'}</td>
          <td>{row.method}</td>
          <td>
            <span className={`badge ${row.status === 'posted' ? 'bg-success' : 'bg-warning text-dark'}`}>
              {row.status}
            </span>
          </td>
        </tr>
      ))}
      {filterSemester.length === 0 && (
        <tr><td colSpan={8} className="text-center text-muted py-4">কোনো লেনদেন পাওয়া যায়নি।</td></tr>
      )}
    </tbody>
  </table>
</div>


      </div>
    </div>
  )
}