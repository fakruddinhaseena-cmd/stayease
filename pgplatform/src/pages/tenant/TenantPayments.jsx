import { useState } from 'react';
import { CreditCard, Download, CheckCircle2, Clock, AlertTriangle, Smartphone, Building, X } from 'lucide-react';
import { payments, tenants } from '../../data/mockData';

const me = tenants[0];

export default function TenantPayments() {
  const myPay = payments.filter(p => p.tenantId === me.id);
  const [showModal, setShowModal] = useState(false);
  const [method, setMethod] = useState('UPI');
  const [paid, setPaid] = useState(false);
  const pending = myPay.find(p => p.status === 'Pending' || p.status === 'Overdue');

  const handlePay = () => {
    setTimeout(() => { setPaid(true); setTimeout(() => { setShowModal(false); setPaid(false); }, 1500); }, 1200);
  };

  const total = myPay.filter(p=>p.status==='Paid').reduce((a,b)=>a+b.amount,0);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Total Paid</div>
          <div className="text-2xl font-bold text-slate-900">₹{total.toLocaleString()}</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">↑ All transactions</div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Current Month</div>
          <div className="text-2xl font-bold text-slate-900">
            {pending ? <span className="text-red-600">₹{pending.amount.toLocaleString()}</span> : <span className="text-emerald-600">Paid ✓</span>}
          </div>
          <div className={`text-xs mt-1 font-medium ${pending ? 'text-red-500' : 'text-emerald-600'}`}>
            {pending ? 'Due June 2026' : 'No dues'}
          </div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Security Deposit</div>
          <div className="text-2xl font-bold text-slate-900">₹{me.advance.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Refundable on check-out</div>
        </div>
      </div>

      {/* Pay Now Banner */}
      {pending && (
        <div className="card p-5 bg-gradient-to-r from-red-50 to-orange-50 border-red-200 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">Rent Due — {pending.month}</div>
              <div className="text-sm text-slate-500">Please pay before 10th to avoid late fee</div>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-danger">
            <CreditCard className="w-4 h-4" /> Pay ₹{pending.amount.toLocaleString()}
          </button>
        </div>
      )}

      {/* Transaction history */}
      <div className="card">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="section-title">Transaction History</h3>
          <button className="btn-secondary text-xs"><Download className="w-3.5 h-3.5" /> Export</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Month</th>
                <th className="table-th">Amount</th>
                <th className="table-th">Method</th>
                <th className="table-th">Date</th>
                <th className="table-th">Status</th>
                <th className="table-th">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {myPay.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="table-td font-medium text-slate-800">{p.month}</td>
                  <td className="table-td font-semibold">₹{p.amount.toLocaleString()}</td>
                  <td className="table-td text-slate-500">{p.method || '—'}</td>
                  <td className="table-td text-slate-400">{p.date || '—'}</td>
                  <td className="table-td">
                    {p.status==='Paid'    && <span className="badge-green"><CheckCircle2 className="w-3 h-3 mr-1"/>Paid</span>}
                    {p.status==='Pending' && <span className="badge-yellow"><Clock className="w-3 h-3 mr-1"/>Pending</span>}
                    {p.status==='Overdue' && <span className="badge-red"><AlertTriangle className="w-3 h-3 mr-1"/>Overdue</span>}
                  </td>
                  <td className="table-td">
                    {p.invoice
                      ? <button className="text-blue-600 text-xs font-medium hover:underline flex items-center gap-1"><Download className="w-3 h-3"/>{p.invoice}</button>
                      : <span className="text-slate-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            {paid ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
                <p className="text-slate-500 text-sm mt-2">₹{pending?.amount?.toLocaleString()} paid for {pending?.month}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Pay Rent</h3>
                  <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 mb-5">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Month</span><span className="font-medium">{pending?.month}</span></div>
                  <div className="flex justify-between text-sm mt-2"><span className="text-slate-500">Amount</span><span className="font-bold text-lg">₹{pending?.amount?.toLocaleString()}</span></div>
                </div>
                <div className="mb-5">
                  <label className="label">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{k:'UPI',icon:Smartphone},{k:'Card',icon:CreditCard},{k:'Net Banking',icon:Building}].map(m => (
                      <button key={m.k} onClick={()=>setMethod(m.k)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-xs font-medium transition-all ${method===m.k ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                        <m.icon className="w-5 h-5" />{m.k}
                      </button>
                    ))}
                  </div>
                </div>
                {method==='UPI' && (
                  <div className="mb-5">
                    <label className="label">UPI ID</label>
                    <input className="input" placeholder="yourname@upi" />
                  </div>
                )}
                <button onClick={handlePay} className="btn-primary w-full justify-center py-3 text-base">
                  <CreditCard className="w-4 h-4" /> Confirm Payment — ₹{pending?.amount?.toLocaleString()}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
