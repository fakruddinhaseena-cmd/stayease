import { Download, TrendingUp, TrendingDown, Users, IndianRupee, BedDouble } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { revenueData, payments, tenants } from '../../data/mockData';

const months = revenueData;
const defaultersList = [
  { name:'Rahul Singh', room:'202', due:'₹12,000', months:2, phone:'9876543212' },
  { name:'Sneha Patel', room:'102', due:'₹8,500',  months:1, phone:'9876543211' },
];

export default function ReportsPage() {
  const totalRev = payments.filter(p=>p.status==='Paid').reduce((a,b)=>a+b.amount,0);
  const totalPend = payments.filter(p=>p.status!=='Paid').reduce((a,b)=>a+b.amount,0);

  return (
    <div style={{ maxWidth:1100 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:800, color:'#fff' }}>Reports & Analytics</div>
        <button className="btn-secondary"><Download size={14}/> Export All Reports</button>
      </div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[
          { label:'Total Revenue', value:`₹${totalRev.toLocaleString()}`, sub:'This month', color:'#34d399', icon:TrendingUp },
          { label:'Pending Rent', value:`₹${totalPend.toLocaleString()}`, sub:`${payments.filter(p=>p.status!=='Paid').length} unpaid`, color:'#fbbf24', icon:TrendingDown },
          { label:'Active Tenants', value:tenants.length, sub:'Currently staying', color:'#a78bfa', icon:Users },
          { label:'Rent Collection', value:'78%', sub:'Collection rate', color:'#60a5fa', icon:IndianRupee },
        ].map(s=>{
          const Icon = s.icon;
          return (
            <div key={s.label} className="card" style={{ padding:'16px' }}>
              <div style={{ width:36,height:36,borderRadius:10,background:`${s.color}20`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12 }}>
                <Icon size={17} style={{ color:s.color }}/>
              </div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:700, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:4 }}>{s.label}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', marginTop:2 }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
        <div className="card" style={{ padding:'18px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <span style={{ fontWeight:700, color:'#fff', fontSize:14 }}>Revenue vs Expenses</span>
            <button className="btn-secondary" style={{ fontSize:11, padding:'4px 10px' }}><Download size={11}/> CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={months} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'rgba(255,255,255,0.3)'}}/>
              <YAxis tick={{fontSize:11,fill:'rgba(255,255,255,0.3)'}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
              <Tooltip contentStyle={{background:'rgba(10,5,25,0.95)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:8,color:'#fff'}} formatter={v=>[`₹${v.toLocaleString()}`]}/>
              <Bar dataKey="revenue" fill="#a78bfa" radius={[4,4,0,0]} name="Revenue"/>
              <Bar dataKey="expenses" fill="rgba(248,113,113,0.6)" radius={[4,4,0,0]} name="Expenses"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding:'18px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <span style={{ fontWeight:700, color:'#fff', fontSize:14 }}>Occupancy Trend</span>
            <button className="btn-secondary" style={{ fontSize:11, padding:'4px 10px' }}><Download size={11}/> CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={months}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'rgba(255,255,255,0.3)'}}/>
              <YAxis domain={[70,100]} tick={{fontSize:11,fill:'rgba(255,255,255,0.3)'}} tickFormatter={v=>`${v}%`}/>
              <Tooltip contentStyle={{background:'rgba(10,5,25,0.95)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:8,color:'#fff'}} formatter={v=>[`${v}%`,'Occupancy']}/>
              <Line type="monotone" dataKey="occupancy" stroke="#34d399" strokeWidth={2.5} dot={{fill:'#34d399',r:4}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* P&L Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontWeight:700, color:'#fff', fontSize:14 }}>Profit & Loss — June 2026</span>
            <button className="btn-secondary" style={{ fontSize:11, padding:'4px 10px' }}><Download size={11}/> PDF</button>
          </div>
          <div style={{ padding:'14px 16px' }}>
            {[['Total Revenue','₹'+totalRev.toLocaleString(),'#34d399',true],['Total Expenses','- ₹42,000','#f87171',false],['Staff Salaries','- ₹86,000','#f87171',false],['Maintenance','- ₹12,000','#fbbf24',false]].map(([l,v,c,bold])=>(
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:bold?600:400 }}>{l}</span>
                <span style={{ fontSize:13, fontWeight:700, color:c }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', marginTop:4, borderTop:'2px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize:14, fontWeight:700, color:'#fff' }}>Net Profit</span>
              <span style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:800, color:'#34d399' }}>₹{(totalRev-42000-86000-12000).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Defaulters */}
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontWeight:700, color:'#fff', fontSize:14 }}>Payment Defaulters</span>
            <span className="badge-red">{defaultersList.length} tenants</span>
          </div>
          {defaultersList.map((d,i)=>(
            <div key={i} style={{ padding:'13px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:38,height:38,borderRadius:'50%',background:'rgba(248,113,113,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#f87171',flexShrink:0 }}>{d.name[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.75)' }}>{d.name}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:1 }}>Room {d.room} · {d.months} month{d.months>1?'s':''} due · {d.phone}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:14, fontWeight:700, color:'#f87171' }}>{d.due}</div>
                <button style={{ fontSize:10, color:'#a78bfa', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', marginTop:2 }}>Send Reminder</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between' }}>
          <span style={{ fontWeight:700, color:'#fff', fontSize:14 }}>Rent Collection Report</span>
          <button className="btn-secondary" style={{ fontSize:11, padding:'4px 10px' }}><Download size={11}/> Excel</button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Tenant','Month','Amount','Method','Date','Status','Receipt'].map(h=><th key={h} className="table-th">{h}</th>)}</tr></thead>
            <tbody>
              {payments.map(p=>(
                <tr key={p.id} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td className="table-td" style={{ fontWeight:500,color:'rgba(255,255,255,0.75)' }}>{p.tenantName}</td>
                  <td className="table-td" style={{ color:'rgba(255,255,255,0.4)' }}>{p.month}</td>
                  <td className="table-td" style={{ fontWeight:600 }}>₹{p.amount.toLocaleString()}</td>
                  <td className="table-td" style={{ color:'rgba(255,255,255,0.4)' }}>{p.method||'—'}</td>
                  <td className="table-td" style={{ color:'rgba(255,255,255,0.35)' }}>{p.date||'—'}</td>
                  <td className="table-td">
                    {p.status==='Paid'    && <span className="badge-green">Paid</span>}
                    {p.status==='Pending' && <span className="badge-yellow">Pending</span>}
                    {p.status==='Overdue' && <span className="badge-red">Overdue</span>}
                  </td>
                  <td className="table-td">
                    {p.invoice ? <button className="btn-secondary" style={{ fontSize:10,padding:'3px 8px' }}><Download size={10}/>{p.invoice}</button> : <span style={{ color:'rgba(255,255,255,0.2)' }}>—</span>}
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
