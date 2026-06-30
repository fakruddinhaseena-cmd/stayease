import { useState } from 'react';
import { IndianRupee, Download, Search, AlertTriangle, CheckCircle2, Clock, Send } from 'lucide-react';
import { payments, properties } from '../../data/mockData';

export default function OwnerPayments() {
  const myProps = properties.filter(p => p.ownerId === 'o1');
  const myPay = payments.filter(p => myProps.map(x=>x.id).includes(p.propId));
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = myPay.filter(p => {
    const ms = p.tenantName.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'All' || p.status === filter;
    return ms && mf;
  });

  const totalCollected = myPay.filter(p=>p.status==='Paid').reduce((a,b)=>a+b.amount,0);
  const totalPending   = myPay.filter(p=>p.status==='Pending').reduce((a,b)=>a+b.amount,0);
  const totalOverdue   = myPay.filter(p=>p.status==='Overdue').reduce((a,b)=>a+b.amount,0);

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="section-title">Payments & Revenue</h2>
          <p className="text-sm text-slate-500 mt-0.5">Track rent collections across all properties</p>
        </div>
        <button className="btn-secondary"><Download className="w-4 h-4"/>Export Report</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 border-l-4 border-emerald-500">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Collected</div>
          <div className="text-2xl font-bold text-emerald-700">₹{totalCollected.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-0.5">{myPay.filter(p=>p.status==='Paid').length} payments</div>
        </div>
        <div className="card p-5 border-l-4 border-amber-400">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Pending</div>
          <div className="text-2xl font-bold text-amber-700">₹{totalPending.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-0.5">{myPay.filter(p=>p.status==='Pending').length} payments</div>
        </div>
        <div className="card p-5 border-l-4 border-red-500">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Overdue</div>
          <div className="text-2xl font-bold text-red-700">₹{totalOverdue.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-0.5">{myPay.filter(p=>p.status==='Overdue').length} payments</div>
        </div>
      </div>

      {/* Search & filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
          <input className="input pl-9" placeholder="Search by tenant..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {['All','Paid','Pending','Overdue'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${filter===f?'bg-blue-600 text-white border-blue-600':'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="table-th">Tenant</th>
                <th className="table-th">Property</th>
                <th className="table-th">Month</th>
                <th className="table-th">Amount</th>
                <th className="table-th">Status</th>
                <th className="table-th">Date</th>
                <th className="table-th">Method</th>
                <th className="table-th">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const propName = properties.find(x=>x.id===p.propId)?.name || '—';
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="table-td font-medium">{p.tenantName}</td>
                    <td className="table-td text-slate-500 text-xs">{propName}</td>
                    <td className="table-td text-slate-500">{p.month}</td>
                    <td className="table-td font-semibold">₹{p.amount.toLocaleString()}</td>
                    <td className="table-td">
                      {p.status==='Paid'    && <span className="badge-green"><CheckCircle2 className="w-3 h-3 mr-1"/>Paid</span>}
                      {p.status==='Pending' && <span className="badge-yellow"><Clock className="w-3 h-3 mr-1"/>Pending</span>}
                      {p.status==='Overdue' && <span className="badge-red"><AlertTriangle className="w-3 h-3 mr-1"/>Overdue</span>}
                    </td>
                    <td className="table-td text-slate-400">{p.date || '—'}</td>
                    <td className="table-td text-slate-500">{p.method || '—'}</td>
                    <td className="table-td">
                      {p.status !== 'Paid' ? (
                        <button className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                          <Send className="w-3.5 h-3.5"/>Remind
                        </button>
                      ) : (
                        <button className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors">
                          <Download className="w-3.5 h-3.5"/>Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
