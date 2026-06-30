import { useState } from 'react';
import { Plus, X, CheckCircle2, Edit3, Trash2, User } from 'lucide-react';

const staffData = [
  { id:'s1', name:'Ramesh Kumar', role:'Manager', phone:'9876501234', salary:25000, attendance:96, status:'Active', joined:'2023-01-10' },
  { id:'s2', name:'Suresh Patel', role:'Electrician', phone:'9876501235', salary:18000, attendance:92, status:'Active', joined:'2023-06-15' },
  { id:'s3', name:'Meena Devi', role:'Cook', phone:'9876501236', salary:15000, attendance:98, status:'Active', joined:'2022-11-01' },
  { id:'s4', name:'Ravi Shankar', role:'Security', phone:'9876501237', salary:16000, attendance:88, status:'Active', joined:'2024-01-20' },
  { id:'s5', name:'Lakshmi Bai', role:'Cleaner', phone:'9876501238', salary:12000, attendance:94, status:'On Leave', joined:'2023-08-05' },
];
const roles = ['Manager','Warden','Cleaner','Cook','Security','Electrician','Plumber'];
const roleColors = { Manager:'#a78bfa', Warden:'#60a5fa', Cleaner:'#34d399', Cook:'#fbbf24', Security:'#f43f5e', Electrician:'#fb923c', Plumber:'#22d3ee' };

export default function StaffManagement() {
  const [staff, setStaff] = useState(staffData);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:'', role:'Manager', phone:'', salary:'' });
  const [tab, setTab] = useState('list');

  const handleAdd = () => {
    setStaff(s=>[...s,{ id:`s${Date.now()}`, ...form, attendance:100, status:'Active', joined:new Date().toISOString().split('T')[0] }]);
    setShowAdd(false); setForm({ name:'', role:'Manager', phone:'', salary:'' });
  };

  return (
    <div style={{ maxWidth:1000 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:800, color:'#fff' }}>Staff Management</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:3 }}>{staff.length} staff members · {staff.filter(s=>s.status==='Active').length} active</div>
        </div>
        <button onClick={()=>setShowAdd(true)} className="btn-primary"><Plus size={14}/> Add Staff</button>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[['Total Staff',staff.length,'#a78bfa'],['Active',staff.filter(s=>s.status==='Active').length,'#34d399'],['On Leave',staff.filter(s=>s.status==='On Leave').length,'#fbbf24'],['Total Salary',`₹${staff.reduce((a,b)=>a+parseInt(b.salary),0).toLocaleString()}`,'#f472b6']].map(([l,v,c])=>(
          <div key={l} className="card" style={{ padding:'16px' }}>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:700, color:c }}>{v}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {[{k:'list',l:'Staff List'},{k:'attendance',l:'Attendance'},{k:'salary',l:'Salary'}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{ padding:'8px 16px',borderRadius:8,border:'none',fontSize:13,fontWeight:600,fontFamily:'inherit',cursor:'pointer',background:tab===t.k?'linear-gradient(135deg,#6366f1,#a855f7)':'rgba(255,255,255,0.04)',color:tab===t.k?'#fff':'rgba(255,255,255,0.4)',border:tab===t.k?'none':'1px solid rgba(255,255,255,0.07)' }}>
            {t.l}
          </button>
        ))}
      </div>

      {tab==='list' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
          {staff.map(s=>(
            <div key={s.id} className="card" style={{ padding:'18px', transition:'all 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(167,139,250,0.3)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:44,height:44,borderRadius:'50%',background:`${roleColors[s.role]||'#a78bfa'}22`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:roleColors[s.role]||'#a78bfa',flexShrink:0 }}>{s.name[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>{s.name}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{s.phone}</div>
                </div>
                <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:10, background:`${roleColors[s.role]||'#a78bfa'}22`, color:roleColors[s.role]||'#a78bfa', border:`1px solid ${roleColors[s.role]||'#a78bfa'}44` }}>{s.role}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:12 }}>
                {[['Salary',`₹${parseInt(s.salary).toLocaleString()}`],['Attendance',`${s.attendance}%`],['Status',s.status]].map(([l,v])=>(
                  <div key={l} style={{ background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'8px',textAlign:'center' }}>
                    <div style={{ fontSize:12, fontWeight:700, color: l==='Status'?(s.status==='Active'?'#34d399':'#fbbf24'):'rgba(255,255,255,0.75)' }}>{v}</div>
                    <div style={{ fontSize:9, color:'rgba(255,255,255,0.25)', marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn-secondary" style={{ flex:1, justifyContent:'center', fontSize:12 }}><Edit3 size={12}/>Edit</button>
                <button style={{ flex:1, justifyContent:'center', fontSize:12, background:'transparent', border:'1px solid rgba(248,113,113,0.25)', color:'rgba(248,113,113,0.7)', borderRadius:8, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:6, padding:'8px' }}><Trash2 size={12}/>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='attendance' && (
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontWeight:700,color:'#fff',fontSize:14 }}>This Month Attendance</span>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>{['Staff','Role','Present Days','Absent','Attendance %','Status'].map(h=><th key={h} className="table-th">{h}</th>)}</tr></thead>
              <tbody>
                {staff.map(s=>{
                  const present = Math.round(s.attendance*26/100);
                  return (
                    <tr key={s.id} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td className="table-td" style={{ fontWeight:500,color:'rgba(255,255,255,0.75)' }}>{s.name}</td>
                      <td className="table-td"><span style={{ fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:10,background:`${roleColors[s.role]||'#a78bfa'}20`,color:roleColors[s.role]||'#a78bfa' }}>{s.role}</span></td>
                      <td className="table-td">{present}/26</td>
                      <td className="table-td" style={{ color:'#f87171' }}>{26-present}</td>
                      <td className="table-td">
                        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                          <div style={{ flex:1,height:4,borderRadius:2,background:'rgba(255,255,255,0.07)',overflow:'hidden' }}>
                            <div style={{ height:'100%',width:`${s.attendance}%`,background:s.attendance>=90?'#34d399':'#fbbf24',borderRadius:2 }}/>
                          </div>
                          <span style={{ fontSize:11,fontWeight:700,color:s.attendance>=90?'#34d399':'#fbbf24',width:30 }}>{s.attendance}%</span>
                        </div>
                      </td>
                      <td className="table-td"><span className={s.status==='Active'?'badge-green':'badge-yellow'}>{s.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='salary' && (
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontWeight:700,color:'#fff',fontSize:14 }}>Salary Management — June 2026</span>
            <span style={{ fontFamily:"'Orbitron',monospace",fontSize:14,fontWeight:700,color:'#e879f9' }}>Total: ₹{staff.reduce((a,b)=>a+parseInt(b.salary),0).toLocaleString()}</span>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>{['Staff','Role','Base Salary','Deductions','Net Pay','Action'].map(h=><th key={h} className="table-th">{h}</th>)}</tr></thead>
              <tbody>
                {staff.map(s=>{
                  const deduction = Math.round(parseInt(s.salary)*(100-s.attendance)/100);
                  const net = parseInt(s.salary)-deduction;
                  return (
                    <tr key={s.id} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td className="table-td" style={{ fontWeight:500,color:'rgba(255,255,255,0.75)' }}>{s.name}</td>
                      <td className="table-td" style={{ color:'rgba(255,255,255,0.4)' }}>{s.role}</td>
                      <td className="table-td">₹{parseInt(s.salary).toLocaleString()}</td>
                      <td className="table-td" style={{ color:'#f87171' }}>- ₹{deduction.toLocaleString()}</td>
                      <td className="table-td" style={{ fontWeight:700,color:'#34d399' }}>₹{net.toLocaleString()}</td>
                      <td className="table-td"><button className="btn-primary" style={{ fontSize:11,padding:'5px 12px' }}>Pay Now</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:20,backdropFilter:'blur(8px)' }}>
          <div style={{ background:'rgba(8,4,22,0.99)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:20,width:'100%',maxWidth:440,padding:24 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
              <span style={{ fontWeight:700,color:'#fff',fontSize:16 }}>Add Staff Member</span>
              <button onClick={()=>setShowAdd(false)} style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.4)' }}><X size={18}/></button>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
              {[['Full Name','name','Ramesh Kumar'],['Phone','phone','9876501234']].map(([l,k,ph])=>(
                <div key={k}>
                  <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>{l}</div>
                  <input className="input" placeholder={ph} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}/>
                </div>
              ))}
              <div>
                <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>Role</div>
                <select className="input" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
                  {roles.map(r=><option key={r} style={{background:'#0a0520'}}>{r}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>Monthly Salary (₹)</div>
                <input className="input" type="number" placeholder="15000" value={form.salary} onChange={e=>setForm(f=>({...f,salary:e.target.value}))}/>
              </div>
              <div style={{ display:'flex',gap:10,marginTop:4 }}>
                <button onClick={()=>setShowAdd(false)} className="btn-secondary" style={{ flex:1,justifyContent:'center' }}>Cancel</button>
                <button onClick={handleAdd} className="btn-primary" style={{ flex:1,justifyContent:'center' }} disabled={!form.name}>Add Staff</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
