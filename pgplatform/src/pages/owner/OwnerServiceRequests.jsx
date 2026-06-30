import { useState } from 'react';
import { Wrench, Search, User, CheckCircle2, Clock, AlertCircle, ChevronDown, X } from 'lucide-react';
import { serviceRequests, properties } from '../../data/mockData';

const statusFlow = ['Open','Assigned','In Progress','Completed'];
const staff = ['Ramesh (Electrician)','Suresh (Plumber)','IT Support','Housekeeping Team','AC Technician'];

export default function OwnerServiceRequests() {
  const myProps = properties.filter(p => p.ownerId === 'o1');
  const [reqs, setReqs] = useState(serviceRequests.filter(s => myProps.map(p=>p.id).includes(s.propId)));
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const updateReq = (id, updates) => {
    setReqs(r => r.map(x => x.id===id ? {...x,...updates} : x));
    if (selected?.id===id) setSelected(s => ({...s,...updates}));
  };

  const filtered = reqs.filter(r => {
    const ms = r.title.toLowerCase().includes(search.toLowerCase()) || r.tenantName.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'All' || r.status === filter;
    return ms && mf;
  });

  const counts = { All:reqs.length, Open:reqs.filter(r=>r.status==='Open').length, 'In Progress':reqs.filter(r=>r.status==='In Progress').length, Completed:reqs.filter(r=>r.status==='Completed').length };

  const priorityColor = { High:'badge-red', Medium:'badge-yellow', Low:'badge-gray' };
  const statusColor = { Open:'badge-yellow', Assigned:'badge-gray', 'In Progress':'badge-blue', Completed:'badge-green' };

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h2 className="section-title">Service Request Management</h2>
        <p className="text-sm text-slate-500 mt-0.5">Assign and track all maintenance requests</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['All','Open','In Progress','Completed'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${filter===f?'bg-blue-600 text-white border-blue-600':'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
            {f} <span className={`ml-1 text-xs ${filter===f?'text-blue-200':'text-slate-400'}`}>({counts[f]||0})</span>
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
          <input className="input pl-9 w-52" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>

      {/* Requests table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="table-th">Issue</th><th className="table-th">Tenant / Room</th>
                <th className="table-th">Category</th><th className="table-th">Priority</th>
                <th className="table-th">Status</th><th className="table-th">Assigned To</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="table-td font-medium text-slate-900">{r.title}</td>
                  <td className="table-td">
                    <div className="text-sm">{r.tenantName}</div>
                    <div className="text-xs text-slate-400">Room {r.roomNo}</div>
                  </td>
                  <td className="table-td"><span className="badge-gray">{r.category}</span></td>
                  <td className="table-td"><span className={priorityColor[r.priority]}>{r.priority}</span></td>
                  <td className="table-td"><span className={statusColor[r.status]}>{r.status}</span></td>
                  <td className="table-td text-slate-500 text-xs">{r.assigned || <span className="text-slate-300">Unassigned</span>}</td>
                  <td className="table-td">
                    <button onClick={()=>setSelected(r)} className="text-blue-600 text-xs font-medium hover:underline">Manage</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center text-slate-400 py-10 text-sm">No requests found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">Manage Request</h3>
              <button onClick={()=>setSelected(null)}><X className="w-5 h-5 text-slate-400"/></button>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <div className="font-semibold text-slate-900 mb-1">{selected.title}</div>
              <div className="text-sm text-slate-500 mb-2">{selected.desc}</div>
              <div className="flex gap-2 flex-wrap">
                <span className="badge-gray">{selected.category}</span>
                <span className={priorityColor[selected.priority]}>{selected.priority}</span>
                <span className="text-xs text-slate-400">{selected.created}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Assign To</label>
                <select className="input" value={selected.assigned || ''} onChange={e=>updateReq(selected.id,{assigned:e.target.value})}>
                  <option value="">-- Select Staff --</option>
                  {staff.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Update Status</label>
                <div className="flex gap-2 flex-wrap">
                  {statusFlow.map(st=>(
                    <button key={st} onClick={()=>updateReq(selected.id,{status:st})}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${selected.status===st?'bg-blue-600 text-white border-blue-600':'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={()=>setSelected(null)} className="btn-primary w-full justify-center mt-5">Save & Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
