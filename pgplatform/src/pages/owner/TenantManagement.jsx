import { useState } from 'react';
import { Users, Search, CheckCircle2, Clock, AlertTriangle, Phone, Mail, Eye, X, UserCheck, UserX } from 'lucide-react';
import { tenants, properties, rooms } from '../../data/mockData';

export default function TenantManagement() {
  const myProps = properties.filter(p => p.ownerId === 'o1');
  const myTenants = tenants.filter(t => myProps.map(p=>p.id).includes(t.propId));
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = myTenants.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || t.rentStatus === filter || t.kyc === filter;
    return matchSearch && matchFilter;
  });

  const getRoom = (rid) => rooms.find(r=>r.id===rid);
  const getProp = (pid) => properties.find(p=>p.id===pid);

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="section-title">Tenant Management</h2>
          <p className="text-sm text-slate-500 mt-0.5">{myTenants.length} active tenants across {myProps.length} properties</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total Tenants', value:myTenants.length, color:'text-slate-900', bg:'bg-slate-50' },
          { label:'Rent Paid', value:myTenants.filter(t=>t.rentStatus==='Paid').length, color:'text-emerald-700', bg:'bg-emerald-50' },
          { label:'Pending', value:myTenants.filter(t=>t.rentStatus==='Pending').length, color:'text-amber-700', bg:'bg-amber-50' },
          { label:'Overdue', value:myTenants.filter(t=>t.rentStatus==='Overdue').length, color:'text-red-700', bg:'bg-red-50' },
        ].map(s=>(
          <div key={s.label} className={`card p-4 ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search & filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input pl-9" placeholder="Search tenants..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="input w-40" value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Paid">Rent Paid</option>
          <option value="Pending">Rent Pending</option>
          <option value="Overdue">Overdue</option>
          <option value="Verified">KYC Verified</option>
          <option value="Pending">KYC Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="table-th">Tenant</th>
                <th className="table-th">Property / Room</th>
                <th className="table-th">Check-in</th>
                <th className="table-th">Check-out</th>
                <th className="table-th">KYC</th>
                <th className="table-th">Rent Status</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const room = getRoom(t.roomId);
                const prop = getProp(t.propId);
                return (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                          {t.name.split(' ').map(x=>x[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{t.name}</div>
                          <div className="text-xs text-slate-400">{t.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <div className="text-sm">{prop?.name}</div>
                      <div className="text-xs text-slate-400">Room {room?.number} • {room?.type}</div>
                    </td>
                    <td className="table-td text-slate-500">{t.checkIn}</td>
                    <td className="table-td text-slate-500">{t.checkOut}</td>
                    <td className="table-td">
                      {t.kyc==='Verified' ? <span className="badge-green"><CheckCircle2 className="w-3 h-3 mr-1"/>Verified</span> : <span className="badge-yellow"><Clock className="w-3 h-3 mr-1"/>Pending</span>}
                    </td>
                    <td className="table-td">
                      {t.rentStatus==='Paid'    && <span className="badge-green">Paid</span>}
                      {t.rentStatus==='Pending' && <span className="badge-yellow">Pending</span>}
                      {t.rentStatus==='Overdue' && <span className="badge-red">Overdue</span>}
                    </td>
                    <td className="table-td">
                      <button onClick={()=>setSelected(t)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                        <Eye className="w-4 h-4"/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tenant Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">Tenant Details</h3>
              <button onClick={()=>setSelected(null)}><X className="w-5 h-5 text-slate-400"/></button>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                {selected.name.split(' ').map(x=>x[0]).join('')}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-lg">{selected.name}</div>
                <div className="text-sm text-slate-500">{selected.occupation} @ {selected.company}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label:'Email', value:selected.email, icon:Mail },
                { label:'Phone', value:selected.phone, icon:Phone },
                { label:'Check-in', value:selected.checkIn, icon:CheckCircle2 },
                { label:'Check-out', value:selected.checkOut, icon:CheckCircle2 },
                { label:'Advance Paid', value:`₹${selected.advance.toLocaleString()}`, icon:CheckCircle2 },
                { label:'KYC', value:selected.kyc, icon:CheckCircle2 },
              ].map(f=>(
                <div key={f.label} className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-0.5">{f.label}</div>
                  <div className="text-sm font-semibold text-slate-800">{f.value}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary flex-1 justify-center text-xs">
                <Mail className="w-3.5 h-3.5"/>Send Notice
              </button>
              <button className="btn-danger flex-1 justify-center text-xs">
                <UserX className="w-3.5 h-3.5"/>Initiate Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
