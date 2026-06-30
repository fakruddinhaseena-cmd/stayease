import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, User, Shield, ChevronRight, Star, MapPin, Users } from 'lucide-react';

const roles = [
  { key:'tenant', label:'I am a Tenant', sub:'Search & book rooms, pay rent, request services', icon:User, color:'bg-blue-50 border-blue-200 text-blue-700', accent:'bg-blue-600' },
  { key:'owner',  label:'I am a Property Owner', sub:'Manage properties, track tenants & revenue', icon:Building2, color:'bg-emerald-50 border-emerald-200 text-emerald-700', accent:'bg-emerald-600' },
  { key:'admin',  label:'Super Admin', sub:'Platform control, approvals & analytics', icon:Shield, color:'bg-purple-50 border-purple-200 text-purple-700', accent:'bg-purple-600' },
];

const stats = [
  { label:'Properties', value:'2,400+' },
  { label:'Happy Tenants', value:'18,000+' },
  { label:'Cities', value:'12' },
];

export default function Login() {
  const { login } = useApp();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!selected) return;
    setLoading(true);
    setTimeout(() => login(selected), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Left panel */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">StayEase</span>
            </div>
            <h1 className="text-white text-3xl font-bold leading-tight mb-4">
              Your Complete<br />PG & Co-Living<br />Platform
            </h1>
            <p className="text-blue-200 text-sm leading-relaxed mb-8">
              Find the perfect room, manage your stay, and build community — all in one place.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {stats.map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-white font-bold text-xl">{s.value}</div>
                  <div className="text-blue-200 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex gap-3 flex-wrap">
            {['Koramangala','HSR Layout','Madhapur','Baner'].map(l => (
              <span key={l} className="flex items-center gap-1 bg-white/10 text-blue-200 text-xs px-3 py-1.5 rounded-full">
                <MapPin className="w-3 h-3" />{l}
              </span>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="bg-white p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Select your role to continue</p>

          <div className="space-y-3 mb-8">
            {roles.map(r => {
              const Icon = r.icon;
              const isSelected = selected === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => setSelected(r.key)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected ? `${r.color} border-current` : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? r.accent : 'bg-slate-200'}`}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold text-sm ${isSelected ? '' : 'text-slate-800'}`}>{r.label}</div>
                    <div className={`text-xs mt-0.5 ${isSelected ? 'opacity-70' : 'text-slate-500'}`}>{r.sub}</div>
                  </div>
                  {isSelected && <ChevronRight className="w-4 h-4 opacity-60" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleLogin}
            disabled={!selected || loading}
            className="btn-primary w-full justify-center py-3 text-base"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Signing in...
              </span>
            ) : 'Continue →'}
          </button>

          <p className="text-center text-xs text-slate-400 mt-6">
            Demo mode — no real credentials needed
          </p>
        </div>
      </div>
    </div>
  );
}
