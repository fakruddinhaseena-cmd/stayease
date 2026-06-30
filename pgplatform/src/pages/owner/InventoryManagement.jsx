import { useState } from 'react';
import { Plus, X, Package, AlertTriangle, CheckCircle2, Edit3 } from 'lucide-react';

const initialInventory = [
  { id:'i1', item:'Beds', category:'Furniture', total:20, allocated:18, damaged:1, available:1 },
  { id:'i2', item:'Mattresses', category:'Furniture', total:20, allocated:17, damaged:2, available:1 },
  { id:'i3', item:'Chairs', category:'Furniture', total:40, allocated:36, damaged:3, available:1 },
  { id:'i4', item:'Study Tables', category:'Furniture', total:20, allocated:18, damaged:0, available:2 },
  { id:'i5', item:'Ceiling Fans', category:'Electrical', total:25, allocated:24, damaged:1, available:0 },
  { id:'i6', item:'ACs', category:'Electrical', total:10, allocated:10, damaged:0, available:0 },
  { id:'i7', item:'Water Coolers', category:'Appliances', total:3, allocated:3, damaged:0, available:0 },
  { id:'i8', item:'Wardrobes', category:'Furniture', total:20, allocated:18, damaged:0, available:2 },
];
const cats = ['All','Furniture','Electrical','Appliances'];

export default function InventoryManagement() {
  const [inv, setInv] = useState(initialInventory);
  const [filter, setFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ item:'', category:'Furniture', total:'' });

  const filtered = filter==='All' ? inv : inv.filter(i=>i.category===filter);

  const handleAdd = () => {
    const total = parseInt(form.total)||0;
    setInv(i=>[...i,{ id:`i${Date.now()}`, ...form, total, allocated:0, damaged:0, available:total }]);
    setShowAdd(false); setForm({ item:'', category:'Furniture', total:'' });
  };

  const totals = { total:inv.reduce((a,b)=>a+b.total,0), allocated:inv.reduce((a,b)=>a+b.allocated,0), damaged:inv.reduce((a,b)=>a+b.damaged,0), available:inv.reduce((a,b)=>a+b.available,0) };

  return (
    <div style={{ maxWidth:1000 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:800, color:'#fff' }}>Inventory Management</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:3 }}>Track all assets and allocations</div>
        </div>
        <button onClick={()=>setShowAdd(true)} className="btn-primary"><Plus size={14}/> Add Item</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[['Total Assets',totals.total,'#a78bfa'],['Allocated',totals.allocated,'#60a5fa'],['Available',totals.available,'#34d399'],['Damaged',totals.damaged,'#f87171']].map(([l,v,c])=>(
          <div key={l} className="card" style={{ padding:'16px' }}>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:24, fontWeight:700, color:c }}>{v}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setFilter(c)} style={{ padding:'7px 16px',borderRadius:8,border:'none',fontSize:12,fontWeight:600,fontFamily:'inherit',cursor:'pointer',background:filter===c?'linear-gradient(135deg,#6366f1,#a855f7)':'rgba(255,255,255,0.04)',color:filter===c?'#fff':'rgba(255,255,255,0.4)',border:filter===c?'none':'1px solid rgba(255,255,255,0.07)' }}>
            {c}
          </button>
        ))}
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Item','Category','Total','Allocated','Available','Damaged','Status','Action'].map(h=><th key={h} className="table-th">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(i=>(
                <tr key={i.id} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td className="table-td" style={{ fontWeight:600,color:'rgba(255,255,255,0.8)' }}><div style={{ display:'flex',alignItems:'center',gap:8 }}><Package size={14} style={{ color:'#a78bfa' }}/>{i.item}</div></td>
                  <td className="table-td"><span className="badge-gray">{i.category}</span></td>
                  <td className="table-td" style={{ fontWeight:600 }}>{i.total}</td>
                  <td className="table-td" style={{ color:'#60a5fa' }}>{i.allocated}</td>
                  <td className="table-td" style={{ color:'#34d399',fontWeight:600 }}>{i.available}</td>
                  <td className="table-td" style={{ color: i.damaged>0?'#f87171':'rgba(255,255,255,0.3)',fontWeight:i.damaged>0?700:400 }}>{i.damaged>0?`⚠️ ${i.damaged}`:i.damaged}</td>
                  <td className="table-td">
                    {i.available===0 ? <span className="badge-red">Full</span> : i.available<=2 ? <span className="badge-yellow">Low Stock</span> : <span className="badge-green">OK</span>}
                  </td>
                  <td className="table-td"><button className="btn-secondary" style={{ fontSize:11,padding:'5px 10px' }}><Edit3 size={11}/>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:20,backdropFilter:'blur(8px)' }}>
          <div style={{ background:'rgba(8,4,22,0.99)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:20,width:'100%',maxWidth:400,padding:24 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
              <span style={{ fontWeight:700,color:'#fff',fontSize:16 }}>Add Inventory Item</span>
              <button onClick={()=>setShowAdd(false)} style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.4)' }}><X size={18}/></button>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
              <div><div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>Item Name</div><input className="input" placeholder="e.g. Water Coolers" value={form.item} onChange={e=>setForm(f=>({...f,item:e.target.value}))}/></div>
              <div><div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>Category</div><select className="input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}><option style={{background:'#0a0520'}}>Furniture</option><option style={{background:'#0a0520'}}>Electrical</option><option style={{background:'#0a0520'}}>Appliances</option></select></div>
              <div><div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>Total Quantity</div><input className="input" type="number" placeholder="10" value={form.total} onChange={e=>setForm(f=>({...f,total:e.target.value}))}/></div>
              <div style={{ display:'flex',gap:10,marginTop:4 }}>
                <button onClick={()=>setShowAdd(false)} className="btn-secondary" style={{ flex:1,justifyContent:'center' }}>Cancel</button>
                <button onClick={handleAdd} className="btn-primary" style={{ flex:1,justifyContent:'center' }} disabled={!form.item}>Add Item</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
