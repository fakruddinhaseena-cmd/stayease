import { useState } from 'react';
import { UserCheck, UserX, CheckCircle2, X, Plus, FileText, CreditCard, Home } from 'lucide-react';
import { tenants, rooms, properties } from '../../data/mockData';

const checkinSteps = ['Personal Info','Room & Bed','Deposit & Agreement','Confirmation'];

export default function CheckInOut() {
  const [tab, setTab] = useState('checkin');
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', email:'', aadhaar:'', pan:'', room:'', deposit:'', period:'11' });

  const myRooms = rooms.filter(r => r.status==='Available');
  const myTenants = tenants;

  const handleFinish = () => { setDone(true); setTimeout(()=>{ setDone(false); setShowForm(false); setStep(0); },2000); };

  return (
    <div style={{ maxWidth:1000 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:800, color:'#fff' }}>Check-In / Check-Out</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:3 }}>Manage tenant arrivals and departures</div>
        </div>
        <button onClick={()=>setShowForm(true)} className="btn-primary"><Plus size={14}/> New Check-In</button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {[{k:'checkin',l:'✅ Check-Ins'},{k:'checkout',l:'🚶 Check-Outs'},{k:'history',l:'📋 History'}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)}
            style={{ padding:'9px 18px', borderRadius:8, border:'none', fontSize:13, fontWeight:600, fontFamily:'inherit', cursor:'pointer', background: tab===t.k?'linear-gradient(135deg,#6366f1,#a855f7)':'rgba(255,255,255,0.04)', color: tab===t.k?'#fff':'rgba(255,255,255,0.4)', border: tab===t.k?'none':'1px solid rgba(255,255,255,0.07)' }}>
            {t.l}
          </button>
        ))}
      </div>

      {tab==='checkin' && (
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontWeight:700, color:'#fff', fontSize:14 }}>Today's Check-Ins</span>
          </div>
          <div style={{ padding:20 }}>
            {[
              { name:'Rohan Gupta', room:'103', time:'10:00 AM', deposit:'₹16,000', period:'11 months' },
              { name:'Priya Singh', room:'201', time:'2:00 PM', deposit:'₹18,000', period:'6 months' },
            ].map((c,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px', background:'rgba(52,211,153,0.05)', border:'1px solid rgba(52,211,153,0.15)', borderRadius:12, marginBottom:10 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(52,211,153,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:'#34d399', flexShrink:0 }}>{c.name[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:'#fff' }}>{c.name}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>Room {c.room} · {c.time} · Deposit: {c.deposit} · Period: {c.period}</div>
                </div>
                <span style={{ background:'rgba(52,211,153,0.15)', border:'1px solid rgba(52,211,153,0.3)', color:'#34d399', fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:20 }}>Checked In</span>
              </div>
            ))}
            <div style={{ textAlign:'center', padding:'20px', color:'rgba(255,255,255,0.2)', fontSize:13 }}>2 check-ins today</div>
          </div>
        </div>
      )}

      {tab==='checkout' && (
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontWeight:700, color:'#fff', fontSize:14 }}>Pending Check-Outs</span>
          </div>
          <div style={{ padding:20 }}>
            {myTenants.filter(t=>new Date(t.checkOut)<new Date(Date.now()+30*86400000)).map(t=>{
              const room = rooms.find(r=>r.id===t.roomId);
              return (
                <div key={t.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px', background:'rgba(248,113,113,0.05)', border:'1px solid rgba(248,113,113,0.15)', borderRadius:12, marginBottom:10 }}>
                  <div style={{ width:44,height:44,borderRadius:'50%',background:'rgba(248,113,113,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:'#f87171',flexShrink:0 }}>{t.name[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:'#fff' }}>{t.name}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>Room {room?.number} · Checkout: {t.checkOut} · Deposit: ₹{t.advance?.toLocaleString()}</div>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button className="btn-secondary" style={{ fontSize:12, padding:'6px 12px' }}>Calculate Dues</button>
                    <button className="btn-danger" style={{ fontSize:12, padding:'6px 12px' }}><UserX size={13}/>Checkout</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab==='history' && (
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontWeight:700, color:'#fff', fontSize:14 }}>Check-In/Out History</span>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>{['Tenant','Room','Type','Date','Deposit','Status'].map(h=><th key={h} className="table-th">{h}</th>)}</tr></thead>
              <tbody>
                {myTenants.map(t=>{
                  const room=rooms.find(r=>r.id===t.roomId);
                  return (
                    <tr key={t.id} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td className="table-td" style={{ fontWeight:500,color:'rgba(255,255,255,0.75)' }}>{t.name}</td>
                      <td className="table-td">{room?.number||'—'}</td>
                      <td className="table-td"><span className="badge-green">Check-In</span></td>
                      <td className="table-td" style={{ color:'rgba(255,255,255,0.4)' }}>{t.checkIn}</td>
                      <td className="table-td" style={{ fontWeight:600 }}>₹{t.advance?.toLocaleString()}</td>
                      <td className="table-td"><span className="badge-green">Active</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Check-In Modal */}
      {showForm && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:20,backdropFilter:'blur(8px)' }}>
          <div style={{ background:'rgba(8,4,22,0.99)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:20,width:'100%',maxWidth:560,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 64px rgba(0,0,0,0.8)' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontWeight:700, color:'#fff', fontSize:16 }}>New Check-In</div>
              <button onClick={()=>{setShowForm(false);setStep(0);}} style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.4)' }}><X size={18}/></button>
            </div>

            {done ? (
              <div style={{ padding:'40px', textAlign:'center' }}>
                <div style={{ width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,#10b981,#34d399)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 0 24px rgba(52,211,153,0.4)' }}>
                  <CheckCircle2 size={28} style={{ color:'#fff' }}/>
                </div>
                <div style={{ fontSize:18,fontWeight:700,color:'#fff' }}>Check-In Successful! 🎉</div>
                <div style={{ fontSize:13,color:'rgba(255,255,255,0.4)',marginTop:6 }}>Welcome message sent · Room assigned · Agreement created</div>
              </div>
            ) : (
              <div style={{ padding:24 }}>
                {/* Step indicator */}
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24, position:'relative' }}>
                  <div style={{ position:'absolute', top:13, left:'10%', right:'10%', height:2, background:'rgba(255,255,255,0.07)' }}/>
                  <div style={{ position:'absolute', top:13, left:'10%', width:`${(step/3)*80}%`, height:2, background:'linear-gradient(90deg,#6366f1,#a855f7)', transition:'width 0.4s' }}/>
                  {checkinSteps.map((s,i)=>(
                    <div key={i} style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:6,zIndex:1 }}>
                      <div style={{ width:28,height:28,borderRadius:'50%',background:step>i?'linear-gradient(135deg,#6366f1,#a855f7)':step===i?'linear-gradient(135deg,#6366f1,#a855f7)':'rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff',border:step===i?'2px solid #a78bfa':'none' }}>
                        {step>i?<CheckCircle2 size={13}/>:i+1}
                      </div>
                      <div style={{ fontSize:9,color:step>=i?'rgba(167,139,250,0.8)':'rgba(255,255,255,0.2)',whiteSpace:'nowrap',textAlign:'center' }}>{s}</div>
                    </div>
                  ))}
                </div>

                {step===0 && (
                  <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                    <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
                      {[['Full Name','name','Arjun Mehta'],['Phone','phone','9876543210'],['Email','email','arjun@email.com'],['Aadhaar','aadhaar','XXXX-XXXX-4512']].map(([l,k,ph])=>(
                        <div key={k}>
                          <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>{l}</div>
                          <input className="input" placeholder={ph} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}/>
                        </div>
                      ))}
                    </div>
                    <button onClick={()=>setStep(1)} className="btn-primary" style={{ width:'100%',justifyContent:'center' }}>Next →</button>
                  </div>
                )}
                {step===1 && (
                  <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                    <div>
                      <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>Select Room</div>
                      <select className="input" value={form.room} onChange={e=>setForm(f=>({...f,room:e.target.value}))}>
                        <option value="">-- Available Rooms --</option>
                        {myRooms.map(r=><option key={r.id} value={r.id} style={{background:'#0a0520'}}>Room {r.number} · {r.type} · ₹{r.price?.toLocaleString()}/mo</option>)}
                      </select>
                    </div>
                    <div>
                      <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>Check-In Date</div>
                      <input className="input" type="date" defaultValue={new Date().toISOString().split('T')[0]}/>
                    </div>
                    <div style={{ display:'flex',gap:8 }}>
                      <button onClick={()=>setStep(0)} className="btn-secondary" style={{ flex:1,justifyContent:'center' }}>← Back</button>
                      <button onClick={()=>setStep(2)} className="btn-primary" style={{ flex:1,justifyContent:'center' }}>Next →</button>
                    </div>
                  </div>
                )}
                {step===2 && (
                  <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                    <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
                      <div>
                        <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>Security Deposit (₹)</div>
                        <input className="input" type="number" placeholder="16000" value={form.deposit} onChange={e=>setForm(f=>({...f,deposit:e.target.value}))}/>
                      </div>
                      <div>
                        <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>Agreement Period (months)</div>
                        <select className="input" value={form.period} onChange={e=>setForm(f=>({...f,period:e.target.value}))}>
                          {[1,3,6,11,12].map(m=><option key={m} value={m} style={{background:'#0a0520'}}>{m} months</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.18)',borderRadius:10,padding:'12px 14px',display:'flex',alignItems:'center',gap:8 }}>
                      <FileText size={14} style={{ color:'#a78bfa' }}/>
                      <span style={{ fontSize:12,color:'rgba(255,255,255,0.5)' }}>Digital rental agreement will be auto-generated and sent via WhatsApp & Email</span>
                    </div>
                    <div style={{ display:'flex',gap:8 }}>
                      <button onClick={()=>setStep(1)} className="btn-secondary" style={{ flex:1,justifyContent:'center' }}>← Back</button>
                      <button onClick={()=>setStep(3)} className="btn-primary" style={{ flex:1,justifyContent:'center' }}>Review →</button>
                    </div>
                  </div>
                )}
                {step===3 && (
                  <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                    <div style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:16 }}>
                      {[['Name',form.name||'Arjun Mehta'],['Phone',form.phone||'9876543210'],['Room',form.room?`Room ${rooms.find(r=>r.id===form.room)?.number}`:'Room 103'],['Deposit',form.deposit?`₹${parseInt(form.deposit).toLocaleString()}`:'₹16,000'],['Period',`${form.period} months`]].map(([l,v])=>(
                        <div key={l} style={{ display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                          <span style={{ fontSize:12,color:'rgba(255,255,255,0.35)' }}>{l}</span>
                          <span style={{ fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.75)' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:'flex',gap:8 }}>
                      <button onClick={()=>setStep(2)} className="btn-secondary" style={{ flex:1,justifyContent:'center' }}>← Back</button>
                      <button onClick={handleFinish} className="btn-primary" style={{ flex:1,justifyContent:'center' }}><UserCheck size={14}/>Confirm Check-In</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
