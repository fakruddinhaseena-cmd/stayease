import { useState } from 'react';
import { CreditCard, Wrench, Bell, CheckCircle2, Clock, AlertTriangle,
  MapPin, Wifi, Coffee, Car, Zap, Droplets, Shield, ChevronRight,
  Calendar, TrendingUp, Home, Star, Phone, MessageSquare, FileText,
  Users, ThumbsUp, Award, BarChart2 } from 'lucide-react';
import { tenants, payments, serviceRequests, announcements, properties } from '../../data/mockData';

const me = tenants[0];
const myProp = properties.find(p => p.id === me.propId);

export default function TenantDashboard() {
  const myPayments = payments.filter(p => p.tenantId === me.id);
  const myReqs = serviceRequests.filter(s => s.tenantId === me.id);
  const pendingPay = myPayments.find(p => p.status==='Pending'||p.status==='Overdue');
  const openReqs = myReqs.filter(r => r.status!=='Completed').length;
  const [activeTab, setActiveTab] = useState('home');

  // Days until checkout
  const checkout = new Date(me.checkOut);
  const today = new Date();
  const daysLeft = Math.ceil((checkout - today) / (1000*60*60*24));

  const statsCards = [
    { label:'Room', value:'101', sub:'Floor 1 · Single', icon:Home, color:'#a78bfa', bg:'rgba(139,92,246,0.12)' },
    { label:'Rent Due', value: pendingPay ? `₹${pendingPay.amount.toLocaleString()}` : 'All Clear', sub: pendingPay?'Payment pending':'No dues this month', icon:CreditCard, color: pendingPay?'#f87171':'#34d399', bg: pendingPay?'rgba(239,68,68,0.1)':'rgba(52,211,153,0.1)' },
    { label:'Open Tickets', value:openReqs, sub:`${myReqs.length} total raised`, icon:Wrench, color:'#fbbf24', bg:'rgba(251,191,36,0.1)' },
    { label:'Days Left', value:daysLeft>0?daysLeft:'—', sub:`Checkout: ${me.checkOut}`, icon:Calendar, color:'#60a5fa', bg:'rgba(96,165,250,0.1)' },
  ];

  return (
    <div style={{ maxWidth:1000 }}>

      {/* Welcome Hero */}
      <div style={{ position:'relative', borderRadius:16, overflow:'hidden', marginBottom:22, minHeight:140 }}>
        {myProp?.images[0] && (
          <>
            <div style={{ position:'absolute', inset:0, backgroundImage:`url(${myProp.images[0]})`, backgroundSize:'cover', backgroundPosition:'center' }}/>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(6,3,20,0.92) 0%,rgba(6,3,20,0.75) 60%,rgba(6,3,20,0.4) 100%)' }}/>
          </>
        )}
        <div style={{ position:'relative', padding:'24px 28px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', marginBottom:4 }}>Good morning 👋</div>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:24, fontWeight:800, color:'#fff', marginBottom:6 }}>{me.name}</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(255,255,255,0.5)' }}>
              <MapPin size={12}/>{myProp?.name}, {myProp?.locality} · Room 101
            </div>
            <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
              {myProp?.propertyFeatures?.wifi && <span style={{ fontSize:10, color:'rgba(96,165,250,0.9)', background:'rgba(59,130,246,0.12)', border:'1px solid rgba(59,130,246,0.2)', padding:'3px 9px', borderRadius:12 }}>📶 {myProp.connectivity?.internetSpeed}</span>}
              {myProp?.propertyFeatures?.powerBackup && <span style={{ fontSize:10, color:'rgba(251,191,36,0.9)', background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.2)', padding:'3px 9px', borderRadius:12 }}>⚡ Power Backup</span>}
              {myProp?.propertyFeatures?.securityGuard && <span style={{ fontSize:10, color:'rgba(52,211,153,0.9)', background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.2)', padding:'3px 9px', borderRadius:12 }}>🛡️ 24/7 Security</span>}
            </div>
          </div>
          <div style={{ background:'rgba(0,0,0,0.4)', backdropFilter:'blur(12px)', borderRadius:12, padding:'14px 20px', textAlign:'center', border:'1px solid rgba(255,255,255,0.1)', flexShrink:0 }}>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:28, fontWeight:800, color:'#fff', lineHeight:1 }}>{new Date().getDate()}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', marginTop:3 }}>{new Date().toLocaleString('default',{month:'short',year:'numeric'})}</div>
            <div style={{ fontSize:10, color:'rgba(167,139,250,0.7)', marginTop:4 }}>{daysLeft} days left</div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:22 }}>
        {statsCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card" style={{ padding:'16px', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(167,139,250,0.3)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}}>
              <div style={{ width:36, height:36, borderRadius:10, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
                <Icon size={17} style={{ color:s.color }}/>
              </div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:700, color:'#fff', lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:3 }}>{s.label}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', marginTop:2 }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>

        {/* Payment dues */}
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span className="section-title" style={{ fontSize:14 }}>Payment History</span>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.05)', padding:'3px 8px', borderRadius:10 }}>Last 3 months</span>
          </div>
          {myPayments.map(p => (
            <div key={p.id} style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.75)' }}>{p.month}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.28)', marginTop:2 }}>{p.method||'—'} {p.invoice?`· ${p.invoice}`:''}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>₹{p.amount.toLocaleString()}</div>
                <div style={{ marginTop:3 }}>
                  {p.status==='Paid'    && <span className="badge-green">Paid</span>}
                  {p.status==='Pending' && <span className="badge-yellow">Pending</span>}
                  {p.status==='Overdue' && <span className="badge-red">Overdue</span>}
                </div>
              </div>
            </div>
          ))}
          {pendingPay && (
            <div style={{ padding:'12px 16px' }}>
              <button className="btn-primary" style={{ width:'100%', justifyContent:'center' }}>
                <CreditCard size={14}/> Pay Now — ₹{pendingPay.amount.toLocaleString()}
              </button>
            </div>
          )}
        </div>

        {/* Announcements */}
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            <span className="section-title" style={{ fontSize:14 }}>Announcements</span>
          </div>
          {announcements.map(a => (
            <div key={a.id} style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display:'flex', gap:10 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', flexShrink:0, marginTop:4, background: a.type==='warning'?'#fbbf24':a.type==='event'?'#a78bfa':'#60a5fa' }}/>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.75)' }}>{a.title}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.38)', marginTop:3, lineHeight:1.5 }}>{a.message}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', marginTop:4 }}>{a.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Property Features — Quick view */}
      {myProp && (
        <div className="card" style={{ padding:0, overflow:'hidden', marginBottom:16 }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span className="section-title" style={{ fontSize:14 }}>My Property — {myProp.name}</span>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <Star size={12} style={{ color:'#fbbf24', fill:'#fbbf24' }}/>
              <span style={{ fontSize:12, fontWeight:600, color:'#fbbf24' }}>{myProp.rating}</span>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>({myProp.reviews} reviews)</span>
            </div>
          </div>
          <div style={{ padding:'14px 16px', display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10 }}>
            {[
              { label:'Water', val:myProp.propertyFeatures?.water, emoji:'💧' },
              { label:'Power', val:myProp.propertyFeatures?.powerBackup, emoji:'⚡' },
              { label:'WiFi', val:myProp.propertyFeatures?.wifi, emoji:'📶' },
              { label:'Lift', val:myProp.propertyFeatures?.lift, emoji:'🏢' },
              { label:'Security', val:myProp.propertyFeatures?.securityGuard, emoji:'🛡️' },
              { label:'CCTV', val:myProp.propertyFeatures?.cctv, emoji:'📷' },
              { label:'AC', val:myProp.roomFeatures?.ac, emoji:'❄️' },
              { label:'Washroom', val:myProp.roomFeatures?.attachedWashroom, emoji:'🚿' },
              { label:'Balcony', val:myProp.roomFeatures?.balcony, emoji:'🌅' },
              { label:'RO Water', val:myProp.kitchen?.waterPurifier, emoji:'🔬' },
            ].map(f => (
              <div key={f.label} style={{ background: f.val?'rgba(52,211,153,0.06)':'rgba(255,255,255,0.02)', border:`1px solid ${f.val?'rgba(52,211,153,0.15)':'rgba(255,255,255,0.05)'}`, borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
                <div style={{ fontSize:18, marginBottom:4 }}>{f.emoji}</div>
                <div style={{ fontSize:10, color: f.val?'rgba(52,211,153,0.9)':'rgba(255,255,255,0.25)', fontWeight:600 }}>{f.label}</div>
                <div style={{ fontSize:9, color: f.val?'rgba(52,211,153,0.6)':'rgba(255,255,255,0.18)', marginTop:2 }}>{f.val?'Available':'N/A'}</div>
              </div>
            ))}
          </div>
          {/* Agreement quick info */}
          <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:16, flexWrap:'wrap' }}>
            {[
              ['Security Deposit', `₹${myProp.agreement?.securityDeposit?.toLocaleString()}`],
              ['Notice Period', myProp.agreement?.noticePeriod],
              ['Lock-in', myProp.agreement?.lockInPeriod],
              ['Electricity', myProp.agreement?.electricityBill],
              ['Guest Policy', myProp.agreement?.guestPolicy],
            ].map(([l,v]) => (
              <div key={l}>
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.25)', textTransform:'uppercase', letterSpacing:'0.1em' }}>{l}</div>
                <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.6)', marginTop:2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Requests */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span className="section-title" style={{ fontSize:14 }}>My Service Requests</span>
          {openReqs>0 && <span className="badge-yellow">{openReqs} open</span>}
        </div>
        {myReqs.length===0 ? (
          <div style={{ padding:40, textAlign:'center', color:'rgba(255,255,255,0.25)', fontSize:13 }}>No service requests yet</div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>
                {['Issue','Category','Status','Assigned','Date'].map(h=>(
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {myReqs.map(r => (
                  <tr key={r.id} style={{ transition:'background 0.15s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td className="table-td" style={{ fontWeight:500, color:'rgba(255,255,255,0.8)' }}>{r.title}</td>
                    <td className="table-td"><span className="badge-gray">{r.category}</span></td>
                    <td className="table-td">
                      {r.status==='Completed'   && <span className="badge-green">Completed</span>}
                      {r.status==='In Progress' && <span className="badge-blue">In Progress</span>}
                      {r.status==='Open'        && <span className="badge-yellow">Open</span>}
                      {r.status==='Assigned'    && <span className="badge-gray">Assigned</span>}
                    </td>
                    <td className="table-td" style={{ color:'rgba(255,255,255,0.35)' }}>{r.assigned||'—'}</td>
                    <td className="table-td" style={{ color:'rgba(255,255,255,0.28)' }}>{r.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
