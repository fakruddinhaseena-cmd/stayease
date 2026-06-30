import { useState } from 'react';
import { User, Shield, CheckCircle2, Clock, Upload, Camera, Edit3, Phone, Mail, Briefcase, Building2 } from 'lucide-react';
import { tenants } from '../../data/mockData';

const me = tenants[0];

export default function TenantProfile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ name:me.name, phone:me.phone, email:me.email, occupation:me.occupation, company:me.company });

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile card */}
      <div className="card p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {me.name.split(' ').map(x=>x[0]).join('')}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50">
              <Camera className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{me.name}</h2>
              {me.kyc === 'Verified'
                ? <span className="badge-green"><CheckCircle2 className="w-3 h-3 mr-1" />KYC Verified</span>
                : <span className="badge-yellow"><Clock className="w-3 h-3 mr-1" />KYC Pending</span>}
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-sm text-slate-500"><Mail className="w-4 h-4"/>{me.email}</span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500"><Phone className="w-4 h-4"/>+91 {me.phone}</span>
            </div>
            <div className="flex flex-wrap gap-4 mt-1.5">
              <span className="flex items-center gap-1.5 text-sm text-slate-500"><Briefcase className="w-4 h-4"/>{me.occupation}</span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500"><Building2 className="w-4 h-4"/>{me.company}</span>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="btn-secondary">
            <Edit3 className="w-4 h-4" />{editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editing && (
          <div className="mt-6 border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {key:'name',label:'Full Name'},
              {key:'phone',label:'Phone'},
              {key:'email',label:'Email'},
              {key:'occupation',label:'Occupation'},
              {key:'company',label:'Company'},
            ].map(f => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <input className="input" value={profile[f.key]} onChange={e=>setProfile(p=>({...p,[f.key]:e.target.value}))} />
              </div>
            ))}
            <div className="sm:col-span-2 flex gap-3">
              <button className="btn-primary">Save Changes</button>
              <button className="btn-secondary" onClick={()=>setEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Stay details */}
      <div className="card p-6">
        <h3 className="section-title mb-5">Stay Details</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:'Property', value:'Harmony PG' },
            { label:'Room', value:'101 (Single)' },
            { label:'Check-in', value:me.checkIn },
            { label:'Check-out', value:me.checkOut },
          ].map(d => (
            <div key={d.label} className="bg-slate-50 rounded-xl p-4">
              <div className="text-xs text-slate-500 font-medium mb-1">{d.label}</div>
              <div className="text-sm font-semibold text-slate-800">{d.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KYC section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="section-title">KYC Verification</h3>
          {me.kyc === 'Verified'
            ? <span className="badge-green"><CheckCircle2 className="w-3 h-3 mr-1"/>Verified</span>
            : <span className="badge-yellow"><Clock className="w-3 h-3 mr-1"/>Under Review</span>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { doc:'Aadhaar Card', status: me.kyc, no:'XXXX XXXX 4512' },
            { doc:'PAN Card', status:'Pending', no:'—' },
          ].map(k => (
            <div key={k.doc} className={`border-2 rounded-xl p-4 ${k.status==='Verified' ? 'border-emerald-200 bg-emerald-50' : 'border-dashed border-slate-300 bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-slate-800">{k.doc}</span>
                {k.status==='Verified'
                  ? <span className="badge-green">Verified</span>
                  : <span className="badge-yellow">Pending</span>}
              </div>
              <div className="text-xs text-slate-500 mb-3">{k.no}</div>
              {k.status !== 'Verified' && (
                <button className="btn-secondary w-full justify-center text-xs">
                  <Upload className="w-3.5 h-3.5" />Upload {k.doc}
                </button>
              )}
            </div>
          ))}
        </div>
        {me.kyc !== 'Verified' && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
            <strong>Action Required:</strong> Please upload your Aadhaar and PAN to complete KYC verification. This is required for your stay.
          </div>
        )}
      </div>
    </div>
  );
}
