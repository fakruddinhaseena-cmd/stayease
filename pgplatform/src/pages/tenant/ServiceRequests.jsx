import { useState } from 'react';
import { Wrench, Plus, X, Upload, Zap, Droplets, Wifi, Wind, Sparkles, Package, Utensils, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { serviceRequests } from '../../data/mockData';

const categories = [
  { k:'Electrical', icon:Zap,       color:'text-yellow-600 bg-yellow-50' },
  { k:'Plumbing',   icon:Droplets,  color:'text-blue-600 bg-blue-50' },
  { k:'WiFi',       icon:Wifi,      color:'text-purple-600 bg-purple-50' },
  { k:'AC',         icon:Wind,      color:'text-cyan-600 bg-cyan-50' },
  { k:'Cleaning',   icon:Sparkles,  color:'text-pink-600 bg-pink-50' },
  { k:'Laundry',    icon:Package,   color:'text-orange-600 bg-orange-50' },
  { k:'Food',       icon:Utensils,  color:'text-emerald-600 bg-emerald-50' },
];

const statusConfig = {
  'Open':        { badge:'badge-yellow', icon:Clock,        label:'Open' },
  'Assigned':    { badge:'badge-gray',   icon:Package,       label:'Assigned' },
  'In Progress': { badge:'badge-blue',   icon:Wrench,        label:'In Progress' },
  'Completed':   { badge:'badge-green',  icon:CheckCircle2, label:'Completed' },
};

export default function ServiceRequests() {
  const [myReqs, setMyReqs] = useState(serviceRequests.filter(s => s.tenantId === 't1'));
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ category:'', title:'', desc:'', priority:'Medium' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.category || !form.title) return;
    const newReq = { id:`sr${Date.now()}`, tenantId:'t1', tenantName:'Arjun Mehta', propId:'p1', roomNo:'101', ...form, status:'Open', created: new Date().toISOString().split('T')[0], assigned:null, photo:null };
    setMyReqs(r => [newReq, ...r]);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowForm(false); setForm({ category:'', title:'', desc:'', priority:'Medium' }); }, 1500);
  };

  const filters = ['All', 'Open', 'In Progress', 'Completed'];
  const filtered = filter === 'All' ? myReqs : myReqs.filter(r => r.status === filter);

  const counts = {
    All: myReqs.length,
    Open: myReqs.filter(r=>r.status==='Open').length,
    'In Progress': myReqs.filter(r=>r.status==='In Progress').length,
    Completed: myReqs.filter(r=>r.status==='Completed').length,
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="section-title">Service Requests</h2>
          <p className="text-sm text-slate-500 mt-0.5">Track maintenance, repairs, and facility requests</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${filter===f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
            {f} <span className={`ml-1 text-xs ${filter===f?'text-blue-200':'text-slate-400'}`}>({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* Requests list */}
      <div className="space-y-3">
        {filtered.map(r => {
          const cat = categories.find(c => c.k === r.category);
          const Icon = cat?.icon || Wrench;
          const st = statusConfig[r.status] || statusConfig['Open'];
          const StIcon = st.icon;
          return (
            <div key={r.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cat?.color || 'bg-slate-100 text-slate-600'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h4 className="font-semibold text-slate-900">{r.title}</h4>
                    <span className={st.badge}>
                      <StIcon className="w-3 h-3 mr-1" />{st.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{r.desc}</p>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <span className="badge-gray">{r.category}</span>
                    <span className={`text-xs font-medium ${r.priority==='High'?'text-red-600':r.priority==='Medium'?'text-amber-600':'text-slate-500'}`}>
                      {r.priority} Priority
                    </span>
                    {r.assigned && <span className="text-xs text-slate-400">Assigned: {r.assigned}</span>}
                    <span className="text-xs text-slate-400 ml-auto">{r.created}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card p-12 text-center text-slate-400">
            <Wrench className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No requests here</p>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Request Submitted!</h3>
                <p className="text-slate-500 text-sm mt-2">We'll assign a technician shortly</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">New Service Request</h3>
                  <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="label">Category *</label>
                    <div className="grid grid-cols-4 gap-2">
                      {categories.map(c => (
                        <button key={c.k} onClick={() => setForm(f=>({...f,category:c.k}))}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all ${form.category===c.k ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                          <c.icon className={`w-5 h-5 ${form.category===c.k?'text-blue-600':''}`} />
                          {c.k}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">Title *</label>
                    <input className="input" placeholder="Brief description of the issue" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
                  </div>
                  <div>
                    <label className="label">Details</label>
                    <textarea className="input resize-none" rows={3} placeholder="Describe the issue in detail..." value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} />
                  </div>
                  <div>
                    <label className="label">Priority</label>
                    <select className="input" value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
                      <option>Low</option><option>Medium</option><option>High</option>
                    </select>
                  </div>
                  <button className="btn-secondary w-full justify-center border-dashed">
                    <Upload className="w-4 h-4" /> Attach Photo (optional)
                  </button>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                  <button onClick={handleSubmit} className="btn-primary flex-1 justify-center" disabled={!form.category || !form.title}>Submit Request</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
