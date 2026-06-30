import { useState } from 'react';
import { BedDouble, Plus, Edit3, User, CheckCircle2, X, Building2, Filter } from 'lucide-react';
import { rooms, tenants, properties } from '../../data/mockData';

export default function RoomManagement() {
  const myProps = properties.filter(p => p.ownerId === 'o1');
  const myRooms = rooms.filter(r => myProps.map(p=>p.id).includes(r.propId));
  const [selectedProp, setSelectedProp] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ number:'', floor:'1', type:'Single', price:'' });

  const filtered = selectedProp === 'All' ? myRooms : myRooms.filter(r => r.propId === selectedProp);

  const getTenant = (tid) => tenants.find(t => t.id === tid);
  const getPropName = (pid) => properties.find(p=>p.id===pid)?.name || pid;

  const occupied = filtered.filter(r=>r.status==='Occupied').length;
  const available = filtered.filter(r=>r.status==='Available').length;

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="section-title">Room & Bed Management</h2>
          <p className="text-sm text-slate-500 mt-0.5">{occupied} occupied • {available} available</p>
        </div>
        <button onClick={()=>setShowAdd(true)} className="btn-primary"><Plus className="w-4 h-4"/>Add Room</button>
      </div>

      {/* Property filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={()=>setSelectedProp('All')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selectedProp==='All'?'bg-blue-600 text-white border-blue-600':'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
          All Properties
        </button>
        {myProps.map(p=>(
          <button key={p.id} onClick={()=>setSelectedProp(p.id)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selectedProp===p.id?'bg-blue-600 text-white border-blue-600':'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
            {p.name}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Total Rooms', value:filtered.length, color:'bg-slate-100 text-slate-700' },
          { label:'Occupied', value:occupied, color:'bg-red-50 text-red-700' },
          { label:'Available', value:available, color:'bg-emerald-50 text-emerald-700' },
        ].map(s=>(
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Rooms grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(r => {
          const tenant = r.tenantId ? getTenant(r.tenantId) : null;
          const isOccupied = r.status === 'Occupied';
          return (
            <div key={r.id} className={`card p-5 border-2 transition-all hover:shadow-md ${isOccupied ? 'border-slate-200' : 'border-emerald-200 bg-emerald-50/30'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOccupied?'bg-slate-100':'bg-emerald-100'}`}>
                    <BedDouble className={`w-5 h-5 ${isOccupied?'text-slate-600':'text-emerald-600'}`} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Room {r.number}</div>
                    <div className="text-xs text-slate-500">Floor {r.floor} • {r.type}</div>
                  </div>
                </div>
                <span className={isOccupied ? 'badge-gray' : 'badge-green'}>
                  {r.status}
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-slate-900">₹{r.price.toLocaleString()}</span>
                <span className="text-xs text-slate-400">/month</span>
              </div>

              {tenant ? (
                <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                    {tenant.name.split(' ').map(x=>x[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">{tenant.name}</div>
                    <div className="text-xs text-slate-400 truncate">{tenant.occupation}</div>
                  </div>
                  <div className="ml-auto">
                    {tenant.rentStatus==='Paid'    && <span className="badge-green text-xs">Paid</span>}
                    {tenant.rentStatus==='Pending' && <span className="badge-yellow text-xs">Pending</span>}
                    {tenant.rentStatus==='Overdue' && <span className="badge-red text-xs">Overdue</span>}
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-emerald-300 rounded-xl p-3 text-center">
                  <User className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <div className="text-xs text-emerald-600 font-medium">Available for booking</div>
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <button className="btn-secondary flex-1 justify-center text-xs">
                  <Edit3 className="w-3.5 h-3.5" />Edit
                </button>
                {!isOccupied && <button className="btn-primary flex-1 justify-center text-xs">Assign</button>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Room Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">Add New Room</h3>
              <button onClick={()=>setShowAdd(false)}><X className="w-5 h-5 text-slate-400"/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Property</label>
                <select className="input">
                  {myProps.map(p=><option key={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Room Number</label><input className="input" placeholder="e.g. 203" value={form.number} onChange={e=>setForm(f=>({...f,number:e.target.value}))}/></div>
                <div><label className="label">Floor</label><input className="input" type="number" min="1" value={form.floor} onChange={e=>setForm(f=>({...f,floor:e.target.value}))}/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Room Type</label>
                  <select className="input" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                    <option>Single</option><option>Double</option><option>Triple</option>
                  </select>
                </div>
                <div><label className="label">Monthly Rent (₹)</label><input className="input" type="number" placeholder="8500" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}/></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={()=>setShowAdd(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button className="btn-primary flex-1 justify-center">Add Room</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
