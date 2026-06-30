import { Building2, Users, IndianRupee, TrendingUp, AlertTriangle, BedDouble, UserCheck, UserX, ArrowUpRight, ArrowDownRight, Zap, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { properties, rooms, tenants, payments, serviceRequests, revenueData } from '../../data/mockData';

const todayCheckins  = [{ name:'Rohan Gupta', room:'103', time:'10:00 AM' }, { name:'Priya Singh', room:'201', time:'2:00 PM' }];
const todayCheckouts = [{ name:'Amit Sharma', room:'104', time:'11:00 AM' }];

export default function OwnerDashboard() {
  const myProps   = properties.filter(p => p.ownerId === 'o1');
  const myRooms   = rooms.filter(r => myProps.map(p=>p.id).includes(r.propId));
  const myTenants = tenants.filter(t => myProps.map(p=>p.id).includes(t.propId));
  const myPayments= payments.filter(p => myProps.map(x=>x.id).includes(p.propId));

  const occupied  = myRooms.filter(r=>r.status==='Occupied').length;
  const vacant    = myRooms.filter(r=>r.status==='Available').length;
  const totalBeds = myRooms.reduce((a,r)=>a+(r.type==='Single'?1:r.type==='Double'?2:3),0);
  const occBeds   = myTenants.length;
  const revenue   = myPayments.filter(p=>p.status==='Paid').reduce((a,b)=>a+b.amount,0);
  const pending   = myPayments.filter(p=>p.status!=='Paid').reduce((a,b)=>a+b.amount,0);
  const expenses  = 42000;
  const profit    = revenue - expenses;
  const occRate   = myRooms.length ? Math.round((occupied/myRooms.length)*100) : 0;

  const topCards = [
    { label:'Total Properties', value:myProps.length,   sub:'Active listings',           icon:Building2,   color:'#a78bfa', bg:'rgba(139,92,246,0.12)' },
    { label:'Total Rooms',      value:myRooms.length,   sub:`${occupied} occ · ${vacant} vacant`, icon:BedDouble, color:'#60a5fa', bg:'rgba(96,165,250,0.12)' },
    { label:'Total Beds',       value:totalBeds,         sub:`${occBeds} occupied`,       icon:BedDouble,   color:'#34d399', bg:'rgba(52,211,153,0.12)' },
    { label:'Total Tenants',    value:myTenants.length, sub:'Currently staying',          icon:Users,       color:'#f472b6', bg:'rgba(244,114,182,0.12)' },
    { label:'Revenue (Jun)',    value:`₹${(revenue/1000).toFixed(0)}k`, sub:'This month', icon:IndianRupee, color:'#34d399', bg:'rgba(52,211,153,0.12)' },
    { label:'Pending Rent',     value:`₹${(pending/1000).toFixed(0)}k`, sub:`${myPayments.filter(p=>p.status!=='Paid').length} unpaid`, icon:AlertTriangle, color:'#fbbf24', bg:'rgba(251,191,36,0.12)' },
    { label:'Expenses',         value:`₹${(expenses/1000).toFixed(0)}k`, sub:'This month', icon:TrendingUp, color:'#f87171', bg:'rgba(248,113,113,0.12)' },
    { label:'Profit',           value:`₹${(profit/1000).toFixed(0)}k`,  sub:'Net profit', icon:ArrowUpRight, color:'#34d399', bg:'rgba(52,211,153,0.12)' },
  ];

  const pieData = [
    { name:'Occupied', value:occupied, color:'#a78bfa' },
    { name:'Vacant',   value:vacant,   color:'rgba(255,255,255,0.08)' },
  ];

  return (
    <div style={{ maxWidth:1200 }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:22, fontWeight:800, color:'#fff', marginBottom:4 }}>Owner Dashboard</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.35)' }}>Welcome back, Rajesh Kumar · {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
      </div>

      {/* 8 stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {topCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card" style={{ padding:'16px', transition:'all 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(167,139,250,0.3)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={17} style={{ color:s.color }}/>
                </div>
              </div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:700, color:'#fff', lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:4 }}>{s.label}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', marginTop:2 }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 300px', gap:16, marginBottom:20 }}>
        {/* Revenue bar chart */}
        <div className="card" style={{ padding:'18px' }}>
          <div style={{ fontWeight:700, color:'#fff', fontSize:14, marginBottom:16 }}>Monthly Revenue</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueData} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'rgba(255,255,255,0.3)'}}/>
              <YAxis tick={{fontSize:11,fill:'rgba(255,255,255,0.3)'}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={v=>[`₹${v.toLocaleString()}`,'Revenue']} contentStyle={{background:'rgba(10,5,25,0.95)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:8,color:'#fff'}}/>
              <Bar dataKey="revenue" fill="#a78bfa" radius={[4,4,0,0]}/>
              <Bar dataKey="expenses" fill="rgba(248,113,113,0.6)" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy line chart */}
        <div className="card" style={{ padding:'18px' }}>
          <div style={{ fontWeight:700, color:'#fff', fontSize:14, marginBottom:16 }}>Occupancy Trend (%)</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'rgba(255,255,255,0.3)'}}/>
              <YAxis domain={[70,100]} tick={{fontSize:11,fill:'rgba(255,255,255,0.3)'}} tickFormatter={v=>`${v}%`}/>
              <Tooltip formatter={v=>[`${v}%`,'Occupancy']} contentStyle={{background:'rgba(10,5,25,0.95)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:8,color:'#fff'}}/>
              <Line type="monotone" dataKey="occupancy" stroke="#34d399" strokeWidth={2.5} dot={{fill:'#34d399',r:4}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy donut */}
        <div className="card" style={{ padding:'18px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontWeight:700, color:'#fff', fontSize:14, marginBottom:12, alignSelf:'flex-start' }}>Occupancy Rate</div>
          <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position:'absolute', textAlign:'center' }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:22, fontWeight:800, color:'#fff' }}>{occRate}%</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>Occupied</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:16, marginTop:8 }}>
            {pieData.map(d=><div key={d.name} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:8,height:8,borderRadius:'50%',background:d.color }}/>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{d.name}: {d.value}</span>
            </div>)}
          </div>
        </div>
      </div>

      {/* Today's Activity + Service Requests */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
        {/* Today checkins/outs */}
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:12 }}>
            <span style={{ fontWeight:700, color:'#fff', fontSize:14 }}>Today's Activity</span>
            <span style={{ background:'rgba(52,211,153,0.15)', color:'#34d399', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10, border:'1px solid rgba(52,211,153,0.25)' }}>LIVE</span>
          </div>
          <div style={{ padding:'12px 16px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:'rgba(52,211,153,0.7)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Check-ins ({todayCheckins.length})</div>
            {todayCheckins.map((c,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width:32,height:32,borderRadius:'50%',background:'rgba(52,211,153,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#34d399',flexShrink:0 }}>{c.name[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.75)' }}>{c.name}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>Room {c.room} · {c.time}</div>
                </div>
                <UserCheck size={14} style={{ color:'#34d399' }}/>
              </div>
            ))}
            <div style={{ fontSize:11, fontWeight:600, color:'rgba(248,113,113,0.7)', textTransform:'uppercase', letterSpacing:'0.1em', margin:'12px 0 8px' }}>Check-outs ({todayCheckouts.length})</div>
            {todayCheckouts.map((c,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0' }}>
                <div style={{ width:32,height:32,borderRadius:'50%',background:'rgba(248,113,113,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#f87171',flexShrink:0 }}>{c.name[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.75)' }}>{c.name}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>Room {c.room} · {c.time}</div>
                </div>
                <UserX size={14} style={{ color:'#f87171' }}/>
              </div>
            ))}
          </div>
        </div>

        {/* Property wise performance */}
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontWeight:700, color:'#fff', fontSize:14 }}>Property Performance</span>
          </div>
          {myProps.map(p => {
            const pr = rooms.filter(r=>r.propId===p.id);
            const occ = pr.filter(r=>r.status==='Occupied').length;
            const pct = pr.length ? Math.round((occ/pr.length)*100) : 0;
            const rev = payments.filter(pay=>pay.propId===p.id&&pay.status==='Paid').reduce((a,b)=>a+b.amount,0);
            return (
              <div key={p.id} style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.75)' }}>{p.name}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{p.locality} · {occ}/{pr.length} rooms</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:"'Orbitron',monospace", fontSize:13, fontWeight:700, color:'#e879f9' }}>₹{rev.toLocaleString()}</div>
                    <div style={{ fontSize:10, color: pct>=80?'#34d399':'#fbbf24', fontWeight:600 }}>{pct}% occupied</div>
                  </div>
                </div>
                <div style={{ height:4, borderRadius:2, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, borderRadius:2, background: pct>=80?'linear-gradient(90deg,#10b981,#34d399)':'linear-gradient(90deg,#f59e0b,#fbbf24)', transition:'width 0.8s' }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent service requests */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between' }}>
          <span style={{ fontWeight:700, color:'#fff', fontSize:14 }}>Open Service Requests</span>
          <span className="badge-yellow">{serviceRequests.filter(s=>s.status!=='Completed').length} pending</span>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>
              {['Issue','Tenant','Room','Category','Priority','Status'].map(h=><th key={h} className="table-th">{h}</th>)}
            </tr></thead>
            <tbody>
              {serviceRequests.filter(s=>s.status!=='Completed').map(r=>(
                <tr key={r.id} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td className="table-td" style={{ fontWeight:500, color:'rgba(255,255,255,0.75)' }}>{r.title}</td>
                  <td className="table-td" style={{ color:'rgba(255,255,255,0.4)' }}>{r.tenantName}</td>
                  <td className="table-td"><span className="badge-gray">Rm {r.roomNo}</span></td>
                  <td className="table-td" style={{ color:'rgba(255,255,255,0.4)' }}>{r.category}</td>
                  <td className="table-td"><span className={r.priority==='High'?'badge-red':r.priority==='Medium'?'badge-yellow':'badge-gray'}>{r.priority}</span></td>
                  <td className="table-td">
                    {r.status==='Open' && <span className="badge-yellow">Open</span>}
                    {r.status==='Assigned' && <span className="badge-gray">Assigned</span>}
                    {r.status==='In Progress' && <span className="badge-blue">In Progress</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
