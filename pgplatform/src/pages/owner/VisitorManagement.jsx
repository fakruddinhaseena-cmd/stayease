import { useState } from 'react';
import { Plus, X, CheckCircle2, UserCheck, Clock, Ban } from 'lucide-react';

const initVisitors = [
  { id:'v1', name:'Amit Sharma', host:'Arjun Mehta', room:'101', phone:'9876500001', purpose:'Personal Visit', inTime:'10:30 AM', outTime:'12:00 PM', date:'2026-06-16', status:'Checked Out' },
  { id:'v2', name:'Pooja Reddy', host:'Sneha Patel', room:'102', phone:'9876500002', purpose:'Family Visit', inTime:'2:00 PM', outTime:null, date:'2026-06-16', status:'Inside' },
  { id:'v3', name:'Raj Mehta', host:'Rahul Singh', room:'202', phone:'9876500003', purpose:'Friend Visit', inTime:'4:30 PM', outTime:null, date:'2026-06-16', status:'Pending Approval' },
];

export default function VisitorManagement() {
  const [visitors, setVisitors] = useState(initVisitors);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', host:'', room:'', purpose:'' });

  const handleAdd = () => {
    setVisitors(v=>[...v,{ id:`v${Date.now()}`, ...form, inTime: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}), outTime:null, date:new Date().toISOString().split('T')[0], status:'Inside' }]);
    setShowAdd(false); setForm({ name:'', phone:'', host:'', room:'', purpose:'' });
  };

  const approve = id => setVisitors(v=>v.map(x=>x.id===id?{...x,status:'Inside'}:x));
  const checkout = id => setVisitors(v=>v.map(x=>x.id===id?{...x,status:'Checked Out',outTime:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}:x));

  return (
    <div style={{ maxWidth:1000 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:800, color:'#fff' }}>Visitor Management</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:3 }}>Track all visitors in real-time</div>
        </div>
        <button onClick={()=>setShowAdd(true)} className="btn-primary"><Plus size={14}/> New Visitor Entry</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[['Total Today',visitors.length,'#a78bfa'],['Inside Now',visitors.filter(v=>v.status==='Inside').length,'#34d399'],['Checked Out',visitors.filter(v=>v.status==='Checked Out').length,'#60a5fa'],['Pending',visitors.filter(v=>v.status==='Pending Approval').length,'#fbbf24']].map(([l,v,c])=>(
          <div key={l} className="card" style={{ padding:'16px' }}>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:24, fontWeight:700, color:c }}>{v}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontWeight:700, color:'#fff', fontSize:14 }}>Today's Visitor Log</span>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Visitor','Host','Room','Purpose','In Time','Out Time','Status','Action'].map(h=><th key={h} className="table-th">{h}</th>)}</tr></thead>
            <tbody>
              {visitors.map(v=>(
                <tr key={v.id} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td className="table-td">
                    <div style={{ fontWeight:500, color:'rgba(255,255,255,0.75)' }}>{v.name}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{v.phone}</div>
                  </td>
                  <td className="table-td" style={{ color:'rgba(255,255,255,0.5)' }}>{v.host}</td>
                  <td className="table-td"><span className="badge-gray">Rm {v.room}</span></td>
                  <td className="table-td" style={{ color:'rgba(255,255,255,0.4)' }}>{v.purpose}</td>
                  <td className="table-td" style={{ color:'rgba(255,255,255,0.5)' }}>{v.inTime}</td>
                  <td className="table-td" style={{ color:'rgba(255,255,255,0.35)' }}>{v.outTime||'—'}</td>
                  <td className="table-td">
                    {v.status==='Inside'           && <span className="badge-green">Inside</span>}
                    {v.status==='Checked Out'      && <span className="badge-gray">Checked Out</span>}
                    {v.status==='Pending Approval' && <span className="badge-yellow">Pending</span>}
                  </td>
                  <td className="table-td">
                    <div style={{ display:'flex', gap:6 }}>
                      {v.status==='Pending Approval' && <button onClick={()=>approve(v.id)} style={{ fontSize:10, background:'rgba(52,211,153,0.15)', border:'1px solid rgba(52,211,153,0.3)', color:'#34d399', padding:'4px 8px', borderRadius:6, cursor:'pointer', fontFamily:'inherit' }}>Approve</button>}
                      {v.status==='Inside' && <button onClick={()=>checkout(v.id)} style={{ fontSize:10, background:'rgba(248,113,113,0.12)', border:'1px solid rgba(248,113,113,0.25)', color:'#f87171', padding:'4px 8px', borderRadius:6, cursor:'pointer', fontFamily:'inherit' }}>Checkout</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:20,backdropFilter:'blur(8px)' }}>
          <div style={{ background:'rgba(8,4,22,0.99)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:20,width:'100%',maxWidth:440,padding:24 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
              <span style={{ fontWeight:700,color:'#fff',fontSize:16 }}>New Visitor Entry</span>
              <button onClick={()=>setShowAdd(false)} style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.4)' }}><X size={18}/></button>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
              {[['Visitor Name','name','Amit Sharma'],['Phone Number','phone','9876500001'],['Host Tenant','host','Arjun Mehta'],['Room Number','room','101'],['Purpose','purpose','Personal Visit']].map(([l,k,ph])=>(
                <div key={k}>
                  <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>{l}</div>
                  <input className="input" placeholder={ph} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}/>
                </div>
              ))}
              <div style={{ display:'flex',gap:10,marginTop:4 }}>
                <button onClick={()=>setShowAdd(false)} className="btn-secondary" style={{ flex:1,justifyContent:'center' }}>Cancel</button>
                <button onClick={handleAdd} className="btn-primary" style={{ flex:1,justifyContent:'center' }} disabled={!form.name}><UserCheck size={14}/>Approve Entry</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
