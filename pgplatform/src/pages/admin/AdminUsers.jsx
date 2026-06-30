import { useState } from 'react';
import { Users, Search, CheckCircle2, Clock, Shield, Ban, Eye, X, Filter } from 'lucide-react';
import { users } from '../../data/mockData';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [userList, setUserList] = useState(users);
  const [selected, setSelected] = useState(null);

  const filtered = userList.filter(u => {
    const ms = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const mr = roleFilter === 'All' || u.role === roleFilter;
    return ms && mr;
  });

  const toggleStatus = (id) => {
    setUserList(u => u.map(x => x.id===id ? {...x, status: x.status==='Active'?'Suspended':'Active'} : x));
    if (selected?.id===id) setSelected(s => ({...s, status: s.status==='Active'?'Suspended':'Active'}));
  };

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h2 className="section-title">User Management</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage all tenants, owners, and staff</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total Users', value:users.length, color:'text-slate-900 bg-slate-50' },
          { label:'Tenants', value:users.filter(u=>u.role==='tenant').length, color:'text-blue-700 bg-blue-50' },
          { label:'Owners', value:users.filter(u=>u.role==='owner').length, color:'text-emerald-700 bg-emerald-50' },
          { label:'Pending', value:users.filter(u=>u.status==='Pending').length, color:'text-amber-700 bg-amber-50' },
        ].map(s=>(
          <div key={s.label} className={`card p-4 ${s.color}`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs font-medium mt-0.5 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
          <input className="input pl-9" placeholder="Search users..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="flex gap-2">
          {['All','tenant','owner'].map(r=>(
            <button key={r} onClick={()=>setRoleFilter(r)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${roleFilter===r?'bg-purple-600 text-white border-purple-600':'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="table-th">User</th><th className="table-th">Role</th><th className="table-th">Joined</th>
                <th className="table-th">KYC</th><th className="table-th">Status</th><th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${u.role==='owner'?'bg-emerald-100 text-emerald-700':u.role==='admin'?'bg-purple-100 text-purple-700':'bg-blue-100 text-blue-700'}`}>
                        {u.name.split(' ').map(x=>x[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{u.name}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-td capitalize">
                    <span className={`badge-${u.role==='owner'?'green':u.role==='admin'?'blue':'gray'}`}>{u.role}</span>
                  </td>
                  <td className="table-td text-slate-400">{u.joined}</td>
                  <td className="table-td">
                    {u.kyc==='Verified' ? <span className="badge-green"><CheckCircle2 className="w-3 h-3 mr-1"/>Verified</span> : <span className="badge-yellow"><Clock className="w-3 h-3 mr-1"/>Pending</span>}
                  </td>
                  <td className="table-td">
                    {u.status==='Active'    && <span className="badge-green">Active</span>}
                    {u.status==='Pending'   && <span className="badge-yellow">Pending</span>}
                    {u.status==='Suspended' && <span className="badge-red">Suspended</span>}
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <button onClick={()=>setSelected(u)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"><Eye className="w-4 h-4"/></button>
                      <button onClick={()=>toggleStatus(u.id)} className={`p-1.5 rounded-lg transition-colors ${u.status==='Active'?'hover:bg-red-50 text-red-500':'hover:bg-emerald-50 text-emerald-500'}`}>
                        {u.status==='Active' ? <Ban className="w-4 h-4"/> : <CheckCircle2 className="w-4 h-4"/>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">User Profile</h3>
              <button onClick={()=>setSelected(null)}><X className="w-5 h-5 text-slate-400"/></button>
            </div>
            <div className="text-center mb-5">
              <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center font-bold text-2xl mb-3 ${selected.role==='owner'?'bg-emerald-100 text-emerald-700':'bg-blue-100 text-blue-700'}`}>
                {selected.name.split(' ').map(x=>x[0]).join('').slice(0,2)}
              </div>
              <h4 className="font-bold text-slate-900">{selected.name}</h4>
              <p className="text-sm text-slate-500">{selected.email}</p>
            </div>
            <div className="space-y-2 mb-5">
              {[{l:'Role',v:selected.role},{l:'Phone',v:selected.phone},{l:'Joined',v:selected.joined},{l:'KYC',v:selected.kyc},{l:'Status',v:selected.status}].map(f=>(
                <div key={f.l} className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-sm text-slate-500 capitalize">{f.l}</span>
                  <span className="text-sm font-semibold text-slate-800 capitalize">{f.v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary flex-1 justify-center text-xs">Send Email</button>
              <button onClick={()=>toggleStatus(selected.id)} className={`flex-1 justify-center text-xs ${selected.status==='Active'?'btn-danger':'btn-primary'} flex items-center gap-1`}>
                {selected.status==='Active' ? <><Ban className="w-3.5 h-3.5"/>Suspend</> : <><CheckCircle2 className="w-3.5 h-3.5"/>Activate</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
