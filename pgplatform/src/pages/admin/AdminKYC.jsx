import { useState } from 'react';
import { ShieldCheck, CheckCircle2, X, Clock, Eye, FileText, User } from 'lucide-react';
import { kycQueue, users } from '../../data/mockData';

export default function AdminKYC() {
  const [queue, setQueue] = useState(kycQueue);
  const [selected, setSelected] = useState(null);

  const approve = (id) => {
    setQueue(q => q.map(k => k.id===id ? {...k, status:'Approved'} : k));
    setSelected(s => s?.id===id ? {...s, status:'Approved'} : s);
  };
  const reject = (id) => {
    setQueue(q => q.map(k => k.id===id ? {...k, status:'Rejected'} : k));
    setSelected(s => s?.id===id ? {...s, status:'Rejected'} : s);
  };

  const pending  = queue.filter(k=>k.status==='Pending').length;
  const approved = queue.filter(k=>k.status==='Approved').length;
  const rejected = queue.filter(k=>k.status==='Rejected').length;

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h2 className="section-title">KYC Verification</h2>
        <p className="text-sm text-slate-500 mt-0.5">Review and verify tenant identity documents</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Pending', value:pending, color:'bg-amber-50 text-amber-700 border-amber-200' },
          { label:'Approved', value:approved, color:'bg-emerald-50 text-emerald-700 border-emerald-200' },
          { label:'Rejected', value:rejected, color:'bg-red-50 text-red-700 border-red-200' },
        ].map(s=>(
          <div key={s.label} className={`card p-5 border ${s.color}`}>
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-sm font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {pending > 0 && (
        <div className="card p-4 bg-amber-50 border-amber-200 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0"/>
          <span className="text-amber-700 text-sm font-medium">{pending} document{pending>1?'s':''} awaiting your review</span>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="table-th">Applicant</th><th className="table-th">Document Type</th>
                <th className="table-th">Document No.</th><th className="table-th">Submitted</th>
                <th className="table-th">Status</th><th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queue.map(k => (
                <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                        {k.name.split(' ').map(x=>x[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-900">{k.name}</span>
                    </div>
                  </td>
                  <td className="table-td"><span className="badge-blue">{k.type}</span></td>
                  <td className="table-td font-mono text-sm text-slate-600">{k.doc}</td>
                  <td className="table-td text-slate-400">{k.submitted}</td>
                  <td className="table-td">
                    {k.status==='Pending'  && <span className="badge-yellow"><Clock className="w-3 h-3 mr-1"/>Pending</span>}
                    {k.status==='Approved' && <span className="badge-green"><CheckCircle2 className="w-3 h-3 mr-1"/>Approved</span>}
                    {k.status==='Rejected' && <span className="badge-red"><X className="w-3 h-3 mr-1"/>Rejected</span>}
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <button onClick={()=>setSelected(k)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"><Eye className="w-4 h-4"/></button>
                      {k.status==='Pending' && (
                        <>
                          <button onClick={()=>approve(k.id)} className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"><CheckCircle2 className="w-4 h-4"/></button>
                          <button onClick={()=>reject(k.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"><X className="w-4 h-4"/></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">KYC Review</h3>
              <button onClick={()=>setSelected(null)}><X className="w-5 h-5 text-slate-400"/></button>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl">
                {selected.name.split(' ').map(x=>x[0]).join('')}
              </div>
              <div>
                <div className="font-bold text-slate-900">{selected.name}</div>
                <div className="text-sm text-slate-500">{selected.type} Verification</div>
              </div>
            </div>
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center mb-5">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2"/>
              <div className="font-mono text-sm font-semibold text-slate-800">{selected.doc}</div>
              <div className="text-xs text-slate-400 mt-1">Submitted: {selected.submitted}</div>
              <button className="mt-3 text-blue-600 text-sm font-medium hover:underline">View Document →</button>
            </div>
            {selected.status === 'Pending' ? (
              <div className="flex gap-3">
                <button onClick={()=>approve(selected.id)} className="btn-primary flex-1 justify-center"><CheckCircle2 className="w-4 h-4"/>Approve</button>
                <button onClick={()=>reject(selected.id)} className="btn-danger flex-1 justify-center"><X className="w-4 h-4"/>Reject</button>
              </div>
            ) : (
              <div className={`text-center py-3 rounded-xl font-semibold ${selected.status==='Approved'?'bg-emerald-50 text-emerald-700':'bg-red-50 text-red-700'}`}>
                {selected.status==='Approved' ? '✓ Document Approved' : '✗ Document Rejected'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
