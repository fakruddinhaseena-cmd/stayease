import { useState } from 'react';
import { Building2, CheckCircle2, X, Eye, MapPin, Star, Clock } from 'lucide-react';
import { properties } from '../../data/mockData';

export default function AdminProperties() {
  const [propList, setPropList] = useState(
    properties.map((p,i) => ({ ...p, approval: i < 2 ? 'Approved' : 'Pending' }))
  );
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');

  const approve = (id) => {
    setPropList(p => p.map(x => x.id===id ? {...x, approval:'Approved'} : x));
    setSelected(s => s?.id===id ? {...s, approval:'Approved'} : s);
  };
  const reject = (id) => {
    setPropList(p => p.map(x => x.id===id ? {...x, approval:'Rejected'} : x));
    setSelected(s => s?.id===id ? {...s, approval:'Rejected'} : s);
  };

  const filtered = propList.filter(p => filter === 'All' || p.approval === filter);

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h2 className="section-title">Property Approvals</h2>
        <p className="text-sm text-slate-500 mt-0.5">Review and approve property listings</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Pending Review', value:propList.filter(p=>p.approval==='Pending').length, color:'bg-amber-50 text-amber-700' },
          { label:'Approved', value:propList.filter(p=>p.approval==='Approved').length, color:'bg-emerald-50 text-emerald-700' },
          { label:'Rejected', value:propList.filter(p=>p.approval==='Rejected').length, color:'bg-red-50 text-red-700' },
        ].map(s=>(
          <div key={s.label} className={`card p-4 ${s.color}`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {['All','Pending','Approved','Rejected'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${filter===f?'bg-purple-600 text-white border-purple-600':'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="card overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-36 bg-slate-200">
              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover"/>
              <div className="absolute top-3 right-3">
                {p.approval==='Approved' && <span className="badge-green bg-white/90">Approved</span>}
                {p.approval==='Pending'  && <span className="badge-yellow bg-white/90">Pending</span>}
                {p.approval==='Rejected' && <span className="badge-red bg-white/90">Rejected</span>}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-bold text-slate-900">{p.name}</h3>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current"/>
                  <span className="text-xs text-slate-700 font-semibold">{p.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
                <MapPin className="w-3 h-3"/>{p.locality}, {p.city}
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-900">₹{p.price.toLocaleString()}/mo</span>
                <span className="text-xs text-slate-500">Owner: {p.owner}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>setSelected(p)} className="btn-secondary flex-1 justify-center text-xs"><Eye className="w-3.5 h-3.5"/>View</button>
                {p.approval==='Pending' && (
                  <>
                    <button onClick={()=>approve(p.id)} className="btn-primary flex-1 justify-center text-xs"><CheckCircle2 className="w-3.5 h-3.5"/>Approve</button>
                    <button onClick={()=>reject(p.id)} className="btn-danger flex-1 justify-center text-xs"><X className="w-3.5 h-3.5"/>Reject</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{selected.name}</h3>
              <button onClick={()=>setSelected(null)}><X className="w-5 h-5 text-slate-400"/></button>
            </div>
            <img src={selected.images[0]} className="w-full h-48 object-cover rounded-xl mb-4" alt={selected.name}/>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[{l:'City',v:selected.city},{l:'Locality',v:selected.locality},{l:'Type',v:selected.type},{l:'Gender',v:selected.gender},{l:'Price',v:`₹${selected.price.toLocaleString()}/mo`},{l:'Owner',v:selected.owner}].map(f=>(
                <div key={f.l} className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500">{f.l}</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">{f.v}</div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Amenities</div>
              <div className="flex flex-wrap gap-1.5">
                {selected.amenities.map(a=><span key={a} className="badge-gray">{a}</span>)}
              </div>
            </div>
            {selected.approval === 'Pending' && (
              <div className="flex gap-3">
                <button onClick={()=>approve(selected.id)} className="btn-primary flex-1 justify-center"><CheckCircle2 className="w-4 h-4"/>Approve</button>
                <button onClick={()=>reject(selected.id)} className="btn-danger flex-1 justify-center"><X className="w-4 h-4"/>Reject</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
