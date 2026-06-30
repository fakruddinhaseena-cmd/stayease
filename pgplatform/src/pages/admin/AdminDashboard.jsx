import { useState } from 'react';
import { Building2, Users, IndianRupee, TrendingUp, TrendingDown, ShieldCheck, Globe,
  BedDouble, Cpu, BarChart2, AlertCircle, CheckCircle2, Clock, Zap, Bot } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { users, properties, payments, kycQueue, serviceRequests, revenueData } from '../../data/mockData';

const cityData = [
  { city:'Bangalore', properties:2, tenants:8, revenue:185000, occupancy:89 },
  { city:'Hyderabad', properties:1, tenants:4, revenue:92000,  occupancy:82 },
  { city:'Pune',      properties:1, tenants:3, revenue:67000,  occupancy:76 },
  { city:'Mumbai',    properties:1, tenants:3, revenue:121000, occupancy:85 },
];

const aiPredictions = [
  { month:'Jul', predicted:162000, actual:null },
  { month:'Aug', predicted:171000, actual:null },
  { month:'Sep', predicted:168000, actual:null },
];

const auditLogs = [
  { action:'Owner Rajesh added new property', user:'Rajesh Kumar', time:'14:32', type:'create' },
  { action:'KYC approved for Rahul Singh',     user:'Super Admin',  time:'13:15', type:'approve' },
  { action:'Tenant Kavya Reddy registered',    user:'System',       time:'11:02', type:'info' },
  { action:'Property listing rejected: XYZ PG',user:'Super Admin',  time:'10:45', type:'delete' },
  { action:'Bulk rent reminder sent to 18 tenants', user:'System',  time:'09:00', type:'bulk' },
];

const subscriptions = [
  { owner:'Rajesh Kumar', plan:'Premium', properties:2, due:'2026-09-01', status:'Active', amount:'₹4,999/mo' },
  { owner:'Sunita Reddy', plan:'Basic',   properties:1, due:'2026-07-15', status:'Active', amount:'₹999/mo' },
  { owner:'Amit Joshi',   plan:'Premium', properties:1, due:'2026-08-20', status:'Expiring Soon', amount:'₹4,999/mo' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const totalRevenue = payments.filter(p=>p.status==='Paid').reduce((a,b)=>a+b.amount,0);
  const totalExp = 140000;
  const profit = totalRevenue - totalExp;
  const totalBeds = 110;
  const occBeds = 86;
  const vacBeds = totalBeds - occBeds;

  const megaStats = [
    { label:'Total PGs',       value:properties.length, icon:Building2,    color:'#a78bfa', bg:'rgba(139,92,246,0.12)' },
    { label:'Total Owners',    value:users.filter(u=>u.role==='owner').length, icon:Users, color:'#60a5fa', bg:'rgba(96,165,250,0.12)' },
    { label:'Total Tenants',   value:users.filter(u=>u.role==='tenant').length, icon:Users, color:'#f472b6', bg:'rgba(244,114,182,0.12)' },
    { label:'Total Rooms',     value:22, icon:BedDouble, color:'#34d399', bg:'rgba(52,211,153,0.12)' },
    { label:'Total Beds',      value:totalBeds, icon:BedDouble, color:'#fbbf24', bg:'rgba(251,191,36,0.12)' },
    { label:'Occupied Beds',   value:occBeds, icon:CheckCircle2, color:'#34d399', bg:'rgba(52,211,153,0.12)' },
    { label:'Vacant Beds',     value:vacBeds, icon:BedDouble, color:'#f87171', bg:'rgba(248,113,113,0.12)' },
    { label:'Revenue',         value:`₹${(totalRevenue/1000).toFixed(0)}k`, icon:IndianRupee, color:'#34d399', bg:'rgba(52,211,153,0.12)' },
    { label:'Expenses',        value:`₹${(totalExp/1000).toFixed(0)}k`, icon:TrendingDown, color:'#f87171', bg:'rgba(248,113,113,0.12)' },
    { label:'Profit',          value:`₹${(profit/1000).toFixed(0)}k`, icon:TrendingUp, color:'#34d399', bg:'rgba(52,211,153,0.12)' },
    { label:'Complaints',      value:serviceRequests.length, icon:AlertCircle, color:'#fbbf24', bg:'rgba(251,191,36,0.12)' },
    { label:'KYC Pending',     value:kycQueue.filter(k=>k.status==='Pending').length, icon:ShieldCheck, color:'#fb923c', bg:'rgba(251,146,60,0.12)' },
  ];

  const tabs = ['overview','ai_analytics','subscriptions','audit_logs','security'];

  const aiData = [...revenueData, ...aiPredictions.map(p=>({...p, revenue:p.predicted}))];

  return (
    <div style={{ maxWidth:1300 }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(244,114,182,0.1))', border:'1px solid rgba(167,139,250,0.2)', borderRadius:16, padding:'20px 24px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, fontWeight:700, color:'#a78bfa', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:6 }}>Super Admin Control Panel</div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:22, fontWeight:900, color:'#fff' }}>Platform Overview</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:4 }}>{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · All systems operational</div>
        </div>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          {[{l:'Cities',v:'4',c:'#a78bfa'},{l:'Occupancy',v:`${Math.round(occBeds/totalBeds*100)}%`,c:'#34d399'},{l:'Uptime',v:'99.9%',c:'#60a5fa'}].map(s=>(
            <div key={s.l} style={{ background:'rgba(0,0,0,0.3)', backdropFilter:'blur(10px)', borderRadius:12, padding:'12px 20px', textAlign:'center', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:22, fontWeight:800, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginTop:3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 12 mega stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10, marginBottom:20 }}>
        {megaStats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card" style={{ padding:'14px', transition:'all 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(167,139,250,0.3)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}>
              <div style={{ width:32,height:32,borderRadius:9,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10 }}>
                <Icon size={15} style={{ color:s.color }}/>
              </div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:700, color:'#fff', lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:4, lineHeight:1.3 }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tab navigation */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {[{k:'overview',l:'📊 Overview'},{k:'ai_analytics',l:'🤖 AI Analytics'},{k:'subscriptions',l:'💳 Subscriptions'},{k:'audit_logs',l:'📋 Audit Logs'},{k:'security',l:'🔐 Security'}].map(t=>(
          <button key={t.k} onClick={()=>setActiveTab(t.k)}
            style={{ padding:'8px 16px',borderRadius:8,border:'none',fontSize:12,fontWeight:600,fontFamily:'inherit',cursor:'pointer',background:activeTab===t.k?'linear-gradient(135deg,#6366f1,#a855f7)':'rgba(255,255,255,0.04)',color:activeTab===t.k?'#fff':'rgba(255,255,255,0.4)',border:activeTab===t.k?'none':'1px solid rgba(255,255,255,0.07)' }}>
            {t.l}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab==='overview' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 300px', gap:16, marginBottom:16 }}>
            <div className="card" style={{ padding:'18px' }}>
              <div style={{ fontWeight:700,color:'#fff',fontSize:14,marginBottom:16 }}>Platform Revenue (6 months)</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={revenueData} barSize={22}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="month" tick={{fontSize:11,fill:'rgba(255,255,255,0.3)'}}/>
                  <YAxis tick={{fontSize:11,fill:'rgba(255,255,255,0.3)'}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
                  <Tooltip contentStyle={{background:'rgba(10,5,25,0.95)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:8,color:'#fff'}} formatter={v=>[`₹${v.toLocaleString()}`]}/>
                  <Bar dataKey="revenue" fill="#7c3aed" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card" style={{ padding:'18px' }}>
              <div style={{ fontWeight:700,color:'#fff',fontSize:14,marginBottom:16 }}>Occupancy Trend</div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="month" tick={{fontSize:11,fill:'rgba(255,255,255,0.3)'}}/>
                  <YAxis domain={[70,100]} tick={{fontSize:11,fill:'rgba(255,255,255,0.3)'}} tickFormatter={v=>`${v}%`}/>
                  <Tooltip contentStyle={{background:'rgba(10,5,25,0.95)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:8,color:'#fff'}} formatter={v=>[`${v}%`,'Occupancy']}/>
                  <defs><linearGradient id="oc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34d399" stopOpacity={0.25}/><stop offset="95%" stopColor="#34d399" stopOpacity={0}/></linearGradient></defs>
                  <Area type="monotone" dataKey="occupancy" stroke="#34d399" strokeWidth={2.5} fill="url(#oc)"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* City distribution pie */}
            <div className="card" style={{ padding:'18px' }}>
              <div style={{ fontWeight:700,color:'#fff',fontSize:14,marginBottom:12 }}>City Distribution</div>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={cityData} cx="50%" cy="50%" outerRadius={55} dataKey="properties" paddingAngle={3}>
                    {cityData.map((_,i)=><Cell key={i} fill={['#a78bfa','#60a5fa','#f472b6','#34d399'][i]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:'rgba(10,5,25,0.95)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:8,color:'#fff'}}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {cityData.map((c,i)=>(
                  <div key={c.city} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:8,height:8,borderRadius:'50%',background:['#a78bfa','#60a5fa','#f472b6','#34d399'][i]}}/>
                      <span style={{ fontSize:11,color:'rgba(255,255,255,0.5)' }}>{c.city}</span>
                    </div>
                    <span style={{ fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.7)' }}>{c.properties} PG</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* City table */}
          <div className="card" style={{ padding:0, overflow:'hidden', marginBottom:16 }}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:8 }}>
              <Globe size={16} style={{ color:'#a78bfa' }}/>
              <span style={{ fontWeight:700,color:'#fff',fontSize:14 }}>City-wise Performance</span>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr>{['City','Properties','Tenants','Revenue','Occupancy','Status'].map(h=><th key={h} className="table-th">{h}</th>)}</tr></thead>
                <tbody>
                  {cityData.map(c=>(
                    <tr key={c.city} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td className="table-td" style={{ fontWeight:600,color:'rgba(255,255,255,0.8)' }}>{c.city}</td>
                      <td className="table-td">{c.properties}</td>
                      <td className="table-td">{c.tenants}</td>
                      <td className="table-td" style={{ fontWeight:600,color:'#e879f9',fontFamily:"'Orbitron',monospace",fontSize:12 }}>₹{c.revenue.toLocaleString()}</td>
                      <td className="table-td">
                        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                          <div style={{ flex:1,height:4,borderRadius:2,background:'rgba(255,255,255,0.07)',overflow:'hidden' }}>
                            <div style={{ height:'100%',width:`${c.occupancy}%`,background:c.occupancy>=85?'#34d399':'#fbbf24',borderRadius:2 }}/>
                          </div>
                          <span style={{ fontSize:11,fontWeight:700,color:c.occupancy>=85?'#34d399':'#fbbf24',width:32 }}>{c.occupancy}%</span>
                        </div>
                      </td>
                      <td className="table-td"><span className="badge-green">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── AI ANALYTICS ── */}
      {activeTab==='ai_analytics' && (
        <div>
          <div style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.08))', border:'1px solid rgba(139,92,246,0.2)', borderRadius:14, padding:'16px 20px', marginBottom:16, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,#6366f1,#a855f7)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <Bot size={20} style={{ color:'#fff' }}/>
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>AI-Powered Business Intelligence</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>Revenue forecasting, occupancy prediction & churn analysis — updated daily</div>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            <div className="card" style={{ padding:'18px' }}>
              <div style={{ fontWeight:700,color:'#fff',fontSize:14,marginBottom:4 }}>AI Revenue Forecast (Next 3 months)</div>
              <div style={{ fontSize:11,color:'rgba(255,255,255,0.35)',marginBottom:16 }}>Based on historical trends + seasonal patterns</div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={[...revenueData, ...aiPredictions.map(p=>({month:p.month, revenue:p.predicted, predicted:true}))]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="month" tick={{fontSize:11,fill:'rgba(255,255,255,0.3)'}}/>
                  <YAxis tick={{fontSize:11,fill:'rgba(255,255,255,0.3)'}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
                  <Tooltip contentStyle={{background:'rgba(10,5,25,0.95)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:8,color:'#fff'}} formatter={v=>[`₹${v.toLocaleString()}`,'Revenue']}/>
                  <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/><stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/></linearGradient></defs>
                  <Area type="monotone" dataKey="revenue" stroke="#a78bfa" strokeWidth={2.5} fill="url(#rev)" strokeDasharray="0"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card" style={{ padding:'18px' }}>
              <div style={{ fontWeight:700,color:'#fff',fontSize:14,marginBottom:16 }}>AI Insights</div>
              {[
                { title:'Occupancy Prediction', value:'91%', trend:'+3%', sub:'Expected next month', color:'#34d399', icon:'📈' },
                { title:'Revenue Forecast', value:'₹1.71L', trend:'+7.4%', sub:'Q3 2026 estimate', color:'#a78bfa', icon:'💰' },
                { title:'Tenant Retention Rate', value:'84%', trend:'-2%', sub:'Last 30 days', color:'#fbbf24', icon:'👥' },
                { title:'Churn Risk', value:'3 tenants', trend:'Medium', sub:'Checkout in next 45 days', color:'#f87171', icon:'⚠️' },
              ].map(item=>(
                <div key={item.title} style={{ display:'flex',alignItems:'center',gap:12,padding:'11px 0',borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize:20, width:36, textAlign:'center', flexShrink:0 }}>{item.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)' }}>{item.title}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:1 }}>{item.sub}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:"'Orbitron',monospace",fontSize:15,fontWeight:700,color:item.color }}>{item.value}</div>
                    <div style={{ fontSize:10,color:item.color,marginTop:2 }}>{item.trend}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Complaint Categorization */}
          <div className="card" style={{ padding:'18px' }}>
            <div style={{ fontWeight:700,color:'#fff',fontSize:14,marginBottom:16 }}>AI Complaint Auto-Categorization</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10 }}>
              {[['Electrical',35,'#fbbf24'],['Plumbing',22,'#60a5fa'],['WiFi/Internet',18,'#a78bfa'],['Cleaning',15,'#34d399'],['Others',10,'#f472b6']].map(([cat,pct,col])=>(
                <div key={cat} style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'14px',textAlign:'center' }}>
                  <div style={{ fontFamily:"'Orbitron',monospace",fontSize:22,fontWeight:700,color:col }}>{pct}%</div>
                  <div style={{ fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:4 }}>{cat}</div>
                  <div style={{ height:3,borderRadius:2,background:'rgba(255,255,255,0.07)',marginTop:8,overflow:'hidden' }}>
                    <div style={{ height:'100%',width:`${pct}%`,background:col,borderRadius:2 }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SUBSCRIPTIONS ── */}
      {activeTab==='subscriptions' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
            {[['Active Subscriptions',subscriptions.filter(s=>s.status==='Active').length,'#34d399'],['Expiring Soon',subscriptions.filter(s=>s.status==='Expiring Soon').length,'#fbbf24'],['Monthly SaaS Revenue','₹10,997','#a78bfa']].map(([l,v,c])=>(
              <div key={l} className="card" style={{ padding:'16px' }}>
                <div style={{ fontFamily:"'Orbitron',monospace",fontSize:24,fontWeight:700,color:c }}>{v}</div>
                <div style={{ fontSize:11,color:'rgba(255,255,255,0.35)',marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{ overflow:'hidden' }}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontWeight:700,color:'#fff',fontSize:14 }}>Owner Subscriptions</span>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr>{['Owner','Plan','Properties','Monthly','Due Date','Status','Action'].map(h=><th key={h} className="table-th">{h}</th>)}</tr></thead>
                <tbody>
                  {subscriptions.map((s,i)=>(
                    <tr key={i} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td className="table-td" style={{ fontWeight:500,color:'rgba(255,255,255,0.75)' }}>{s.owner}</td>
                      <td className="table-td"><span style={{ fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:10,background:s.plan==='Premium'?'rgba(167,139,250,0.15)':'rgba(96,165,250,0.15)',color:s.plan==='Premium'?'#a78bfa':'#60a5fa',border:`1px solid ${s.plan==='Premium'?'rgba(167,139,250,0.3)':'rgba(96,165,250,0.3)'}` }}>{s.plan}</span></td>
                      <td className="table-td">{s.properties}</td>
                      <td className="table-td" style={{ fontFamily:"'Orbitron',monospace",fontSize:12,color:'#e879f9' }}>{s.amount}</td>
                      <td className="table-td" style={{ color:'rgba(255,255,255,0.4)' }}>{s.due}</td>
                      <td className="table-td"><span className={s.status==='Active'?'badge-green':'badge-yellow'}>{s.status}</span></td>
                      <td className="table-td"><button className="btn-secondary" style={{ fontSize:11,padding:'4px 10px' }}>Manage</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── AUDIT LOGS ── */}
      {activeTab==='audit_logs' && (
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontWeight:700,color:'#fff',fontSize:14 }}>System Audit Logs — Today</span>
            <button className="btn-secondary" style={{ fontSize:11,padding:'4px 10px' }}>Export Logs</button>
          </div>
          {auditLogs.map((log,i)=>(
            <div key={i} style={{ padding:'13px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:8,height:8,borderRadius:'50%',flexShrink:0,background:log.type==='create'?'#34d399':log.type==='approve'?'#a78bfa':log.type==='delete'?'#f87171':log.type==='bulk'?'#60a5fa':'#fbbf24' }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13,color:'rgba(255,255,255,0.7)' }}>{log.action}</div>
                <div style={{ fontSize:11,color:'rgba(255,255,255,0.3)',marginTop:2 }}>By: {log.user}</div>
              </div>
              <div style={{ fontSize:11,color:'rgba(255,255,255,0.25)',flexShrink:0 }}>{log.time} today</div>
            </div>
          ))}
        </div>
      )}

      {/* ── SECURITY ── */}
      {activeTab==='security' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div className="card" style={{ padding:'20px' }}>
            <div style={{ fontWeight:700,color:'#fff',fontSize:14,marginBottom:16 }}>🔐 Security Center</div>
            {[
              ['Login OTP', true, '#34d399'],
              ['Two Factor Auth', true, '#34d399'],
              ['Device Tracking', true, '#34d399'],
              ['IP Tracking', true, '#34d399'],
              ['Session Management', true, '#34d399'],
              ['SSL Certificate', true, '#34d399'],
              ['Data Encryption (256-bit)', true, '#34d399'],
              ['Brute Force Protection', true, '#34d399'],
            ].map(([feat,status,c])=>(
              <div key={feat} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize:13,color:'rgba(255,255,255,0.5)' }}>{feat}</span>
                <div style={{ display:'flex',alignItems:'center',gap:5 }}>
                  <CheckCircle2 size={13} style={{ color:c }}/>
                  <span style={{ fontSize:11,fontWeight:600,color:c }}>Active</span>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding:'20px' }}>
            <div style={{ fontWeight:700,color:'#fff',fontSize:14,marginBottom:16 }}>📊 Active Sessions</div>
            {[
              { user:'Super Admin', device:'Chrome · Windows 11', ip:'192.168.1.1', time:'Active now' },
              { user:'Rajesh Kumar', device:'Safari · iPhone 15', ip:'103.24.x.x', time:'5 min ago' },
              { user:'Sunita Reddy', device:'Chrome · Android', ip:'49.36.x.x', time:'1 hr ago' },
            ].map((s,i)=>(
              <div key={i} style={{ padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
                  <span style={{ fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.7)' }}>{s.user}</span>
                  <span style={{ fontSize:11,color: i===0?'#34d399':'rgba(255,255,255,0.3)' }}>{s.time}</span>
                </div>
                <div style={{ fontSize:11,color:'rgba(255,255,255,0.3)' }}>{s.device} · {s.ip}</div>
              </div>
            ))}
            <div style={{ marginTop:12 }}>
              <button className="btn-danger" style={{ width:'100%',justifyContent:'center',fontSize:12 }}>Terminate All Other Sessions</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
