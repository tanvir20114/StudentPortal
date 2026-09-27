import React, { useEffect, useState, use } from 'react'
import { AuthContext } from '../AuthContext'
import useAxiosSecure from '../hooks/useAxiosSecure'

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)

export default function Dash() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

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
    return <p>লোড হচ্ছে...</p>;
  }

  const totalPayable = transactions.reduce((s, r) => s + r.debit, 0);
  const totalPaid = transactions.reduce((s, r) => s + r.credit, 0);
  const totalDue = totalPayable - totalPaid;
  const totalOthers = 0;

  return (
    <div>
      <div className="row g-3 px-0">
        <div className="col-md-3">
          <div className="rounded-3 text-white text-center d-flex flex-column bg-primary">
            <h4 className="p-4 m-0">Total Payable</h4>
            <div className="border-bottom border-white w-100"></div>
            <h4 className="m-0 p-4">{formatCurrency(totalPayable)}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="rounded-3 text-white text-center d-flex flex-column bg-primary">
            <h4 className="p-4 m-0">Total Paid</h4>
            <div className="border-bottom border-white w-100"></div>
            <h4 className="m-0 p-4">{formatCurrency(totalPaid)}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="rounded-3 text-white text-center d-flex flex-column bg-primary">
            <h4 className="p-4 m-0">Total Due</h4>
            <div className="border-bottom border-white w-100"></div>
            <h4 className="m-0 p-4">{formatCurrency(totalDue)}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="rounded-3 text-white text-center d-flex flex-column bg-primary">
            <h4 className="p-4 m-0">Total Others</h4>
            <div className="border-bottom border-white w-100"></div>
            <h4 className="m-0 p-4">{formatCurrency(totalOthers)}</h4>
          </div>
        </div>
      </div>
    </div>
  )
}
