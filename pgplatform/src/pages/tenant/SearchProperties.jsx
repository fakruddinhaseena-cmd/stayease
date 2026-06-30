import { useState } from 'react';
import { Search, MapPin, Star, Heart, X, ChevronLeft, ChevronRight,
  Wifi, Coffee, Car, Dumbbell, Shield, Wind, Zap, Droplets,
  CheckCircle2, XCircle, ArrowRight, SlidersHorizontal, Building2,
  FileText, Lock, MapPin as Map2 } from 'lucide-react';
import { properties } from '../../data/mockData';

// ── Image Slider ─────────────────────────────────────────────────
function ImageSlider({ images, height = 200 }) {
  const [idx, setIdx] = useState(0);
  const prev = e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); };
  const next = e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); };
  return (
    <div style={{ position:'relative', height, overflow:'hidden' }}>
      {images.map((img, i) => (
        <div key={i} style={{ position:'absolute', inset:0, backgroundImage:`url(${img})`, backgroundSize:'cover', backgroundPosition:'center', opacity: i===idx ? 1 : 0, transition:'opacity 0.5s ease' }}/>
      ))}
      {/* Arrows */}
      {images.length > 1 && <>
        <button onClick={prev} style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', width:28, height:28, borderRadius:'50%', background:'rgba(0,0,0,0.55)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', zIndex:5 }}>
          <ChevronLeft size={14}/>
        </button>
        <button onClick={next} style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', width:28, height:28, borderRadius:'50%', background:'rgba(0,0,0,0.55)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', zIndex:5 }}>
          <ChevronRight size={14}/>
        </button>
        {/* Dots */}
        <div style={{ position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)', display:'flex', gap:5, zIndex:5 }}>
          {images.map((_, i) => (
            <button key={i} onClick={e=>{e.stopPropagation();setIdx(i)}} style={{ width: i===idx?18:6, height:6, borderRadius:3, border:'none', cursor:'pointer', background: i===idx?'#fff':'rgba(255,255,255,0.4)', transition:'all 0.3s', padding:0 }}/>
          ))}
        </div>
      </>}
      {/* Count badge */}
      <div style={{ position:'absolute', top:10, left:10, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(6px)', color:'rgba(255,255,255,0.8)', fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:12, zIndex:5 }}>
        {idx+1}/{images.length}
      </div>
    </div>
  );
}

// ── Feature Check Row ──────────────────────────────────────────────
const Feat = ({ label, value }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
    <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>{label}</span>
    {typeof value === 'boolean'
      ? value
        ? <CheckCircle2 size={14} style={{ color:'#34d399' }}/>
        : <XCircle size={14} style={{ color:'rgba(255,255,255,0.2)' }}/>
      : <span style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.75)' }}>{value}</span>
    }
  </div>
);

// ── Score Bar ─────────────────────────────────────────────────────
const ScoreBar = ({ label, value }) => (
  <div style={{ marginBottom:8 }}>
    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
      <span style={{ fontSize:11, color:'rgba(255,255,255,0.45)' }}>{label}</span>
      <span style={{ fontSize:11, fontWeight:700, color: value>=8?'#34d399':value>=6?'#fbbf24':'#f87171' }}>{value}/10</span>
    </div>
    <div style={{ height:5, borderRadius:3, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${value*10}%`, borderRadius:3, background: value>=8?'linear-gradient(90deg,#10b981,#34d399)':value>=6?'linear-gradient(90deg,#f59e0b,#fbbf24)':'linear-gradient(90deg,#ef4444,#f87171)', transition:'width 0.8s ease' }}/>
    </div>
  </div>
);

// ── Property Detail Modal ─────────────────────────────────────────
function PropertyModal({ p, onClose }) {
  const [tab, setTab] = useState('overview');
  const tabs = ['overview','features','agreement','score'];

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16, backdropFilter:'blur(10px)' }} onClick={onClose}>
      <div style={{ background:'rgba(8,4,22,0.99)', border:'1px solid rgba(167,139,250,0.2)', borderRadius:20, width:'100%', maxWidth:700, maxHeight:'92vh', overflowY:'auto', boxShadow:'0 24px 64px rgba(0,0,0,0.8)' }} onClick={e=>e.stopPropagation()}>

        {/* Image slider top */}
        <div style={{ position:'relative', borderRadius:'20px 20px 0 0', overflow:'hidden' }}>
          <ImageSlider images={p.images} height={260}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(8,4,22,0.95) 0%, transparent 55%)', pointerEvents:'none' }}/>
          <button onClick={onClose} style={{ position:'absolute', top:14, right:14, width:34, height:34, borderRadius:'50%', background:'rgba(0,0,0,0.6)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', zIndex:10 }}>
            <X size={15}/>
          </button>
          <div style={{ position:'absolute', bottom:16, left:20, zIndex:10 }}>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:700, color:'#fff' }}>{p.name}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', display:'flex', alignItems:'center', gap:4, marginTop:4 }}>
              <MapPin size={11}/>{p.locality}, {p.city}
            </div>
          </div>
          <div style={{ position:'absolute', bottom:16, right:20, zIndex:10, textAlign:'right' }}>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:22, fontWeight:700, color:'#e879f9' }}>₹{p.price.toLocaleString()}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>per month</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'0 20px' }}>
          {tabs.map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{ padding:'12px 16px', border:'none', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:12, fontWeight:600, textTransform:'capitalize', color: tab===t?'#a78bfa':'rgba(255,255,255,0.3)', borderBottom: tab===t?'2px solid #a78bfa':'2px solid transparent', transition:'all 0.2s' }}>
              {t==='score'?'Priority Score':t}
            </button>
          ))}
        </div>

        <div style={{ padding:20 }}>

          {/* OVERVIEW */}
          {tab==='overview' && (
            <div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.7, marginBottom:20 }}>{p.description}</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:20 }}>
                {[['Type',p.type],['Gender',p.gender],['Sharing',p.sharing.join(', ')],['Rating',`⭐ ${p.rating} (${p.reviews})`],['Available',`${p.available} beds`],['Internet',p.connectivity?.internetSpeed||'—']].map(([l,v])=>(
                  <div key={l} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:'10px 12px' }}>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.28)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:3 }}>{l}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.8)' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.28)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:8, fontWeight:600 }}>Amenities</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                  {p.amenities.map(a=>(
                    <span key={a} style={{ fontSize:12, color:'rgba(167,139,250,0.9)', background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.22)', padding:'4px 12px', borderRadius:20 }}>{a}</span>
                  ))}
                </div>
              </div>
              <div style={{ background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.15)', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
                <Map2 size={16} style={{ color:'#a78bfa', flexShrink:0 }}/>
                <div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', fontWeight:500 }}>Near Metro: {p.connectivity?.nearMetro} &nbsp;•&nbsp; Internet: {p.connectivity?.internetSpeed} &nbsp;•&nbsp; Signal: {p.connectivity?.mobileSignal}</div>
                </div>
              </div>
            </div>
          )}

          {/* FEATURES */}
          {tab==='features' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              {[
                { title:'🏢 Property', icon:Building2, data: [
                  ['24/7 Water Supply', p.propertyFeatures?.water],
                  ['Power Backup', p.propertyFeatures?.powerBackup],
                  ['High-Speed WiFi', p.propertyFeatures?.wifi],
                  ['Lift Facility', p.propertyFeatures?.lift],
                  ['Parking', p.propertyFeatures?.parking],
                  ['CCTV', p.propertyFeatures?.cctv],
                  ['Security Guard', p.propertyFeatures?.securityGuard],
                  ['Gated Community', p.propertyFeatures?.gatedCommunity],
                  ['Visitor Management', p.propertyFeatures?.visitorManagement],
                  ['Fire Safety', p.propertyFeatures?.fireSafety],
                ]},
                { title:'🛏️ Room', icon:null, data: [
                  ['Attached Washroom', p.roomFeatures?.attachedWashroom],
                  ['Hot Water (Geyser)', p.roomFeatures?.hotWater],
                  ['AC', p.roomFeatures?.ac],
                  ['Wardrobe', p.roomFeatures?.wardrobe],
                  ['Bed & Mattress', p.roomFeatures?.bed],
                  ['Study Table & Chair', p.roomFeatures?.studyTable],
                  ['Balcony', p.roomFeatures?.balcony],
                  ['Good Ventilation', p.roomFeatures?.ventilation],
                  ['Natural Lighting', p.roomFeatures?.naturalLight],
                  ['Soundproofing', p.roomFeatures?.soundproofing],
                ]},
                { title:'🍳 Kitchen & Utility', icon:null, data: [
                  ['Modular Kitchen', p.kitchen?.modularKitchen],
                  ['Refrigerator', p.kitchen?.refrigerator],
                  ['Microwave', p.kitchen?.microwave],
                  ['Induction/Gas Stove', p.kitchen?.inductionStove],
                  ['Washing Machine', p.kitchen?.washingMachine],
                  ['Water Purifier (RO)', p.kitchen?.waterPurifier],
                  ['Clothes Drying Area', p.kitchen?.clothesDrying],
                ]},
                { title:'🔒 Security', icon:null, data: [
                  ['Smart Locks', p.security?.smartLocks],
                  ['Window Grills', p.security?.windowGrills],
                  ['Emergency Exit', p.security?.emergencyExit],
                  ['Safe Neighborhood', p.security?.safeNeighborhood],
                  ['Strong Mobile Signal', p.connectivity?.mobileSignal==='Excellent'||p.connectivity?.mobileSignal==='Good'],
                  ['Near Bus Stop/Metro', p.connectivity?.nearBusStop],
                  ['Near Grocery Stores', p.connectivity?.nearGrocery],
                  ['Food Delivery Available', p.connectivity?.foodDelivery],
                ]},
              ].map(section => (
                <div key={section.title} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'14px 16px' }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.7)', marginBottom:8 }}>{section.title}</div>
                  {section.data.map(([label, val]) => <Feat key={label} label={label} value={val}/>)}
                </div>
              ))}
            </div>
          )}

          {/* AGREEMENT */}
          {tab==='agreement' && (
            <div>
              <div style={{ background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.18)', borderRadius:12, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
                <FileText size={16} style={{ color:'#a78bfa' }}/>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>All financial & agreement terms clearly listed below</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {p.agreement && Object.entries({
                  'Monthly Rent': `₹${p.agreement.monthlyRent?.toLocaleString()}`,
                  'Security Deposit': `₹${p.agreement.securityDeposit?.toLocaleString()}`,
                  'Notice Period': p.agreement.noticePeriod,
                  'Lock-in Period': p.agreement.lockInPeriod,
                  'Maintenance Charges': p.agreement.maintenanceCharges ? `₹${p.agreement.maintenanceCharges}/month` : '—',
                  'Electricity Bill': p.agreement.electricityBill,
                  'Water Charges': p.agreement.waterCharges,
                  'Parking Charges': p.agreement.parkingCharges,
                  'Guest Policy': p.agreement.guestPolicy,
                  'Refund Terms': p.agreement.refundTerms,
                  'Rent Increase Clause': p.agreement.rentIncreaseClause,
                  'Move-out Rules': p.agreement.moveOutRules,
                }).map(([label, value]) => (
                  <div key={label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:'10px 14px' }}>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.28)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{label}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.75)', lineHeight:1.4 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRIORITY SCORE */}
          {tab==='score' && (
            <div>
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:16, marginBottom:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.7)', marginBottom:4 }}>MD Priority Score Card</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>Based on top 10 most important features for tenants</div>
              </div>
              {p.priorityScore && [
                ['Safety & Security', p.priorityScore.safety],
                ['Water Supply', p.priorityScore.water],
                ['Power Backup', p.priorityScore.power],
                ['Internet Speed', p.priorityScore.internet],
                ['Location', p.priorityScore.location],
                ['Rent Affordability', p.priorityScore.affordability],
                ['Clean Washroom', p.priorityScore.washroom],
                ['Parking', p.priorityScore.parking],
                ['Lift Facility', p.priorityScore.lift],
                ['Agreement Transparency', p.priorityScore.agreement],
              ].map(([label, val]) => <ScoreBar key={label} label={label} value={val}/>)}
              <div style={{ marginTop:16, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:10, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.6)' }}>Overall Score</span>
                <span style={{ fontFamily:"'Orbitron',monospace", fontSize:22, fontWeight:700, color:'#a78bfa' }}>
                  {p.priorityScore ? (Object.values(p.priorityScore).reduce((a,b)=>a+b,0)/Object.values(p.priorityScore).length).toFixed(1) : '—'}/10
                </span>
              </div>
            </div>
          )}

          {/* Book button */}
          <div style={{ display:'flex', gap:10, marginTop:20, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={onClose} className="btn-secondary" style={{ flex:1, justifyContent:'center' }}>Close</button>
            <button className="btn-primary" style={{ flex:2, justifyContent:'center', padding:'12px' }} disabled={p.available===0}>
              {p.available>0 ? <>Book This Room <ArrowRight size={14}/></> : 'No Beds Available'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
export default function SearchProperties() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All');
  const [gender, setGender] = useState('All');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [wishlist, setWishlist] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const cities = ['All', ...new Set(properties.map(p => p.city))];
  const filtered = properties.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) || p.locality.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase());
    return ms && (city==='All'||p.city===city) && (gender==='All'||p.gender===gender||p.gender==='Any') && p.price<=maxPrice;
  });

  const toggleWishlist = (id, e) => { e.stopPropagation(); setWishlist(w => w.includes(id)?w.filter(x=>x!==id):[...w,id]); };

  return (
    <div style={{ maxWidth:1100 }}>
      {/* Search bar */}
      <div className="card" style={{ padding:'14px 18px', marginBottom:18, display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ flex:1, minWidth:200, position:'relative' }}>
          <Search size={14} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.25)' }}/>
          <input className="input" style={{ paddingLeft:34 }} placeholder="Search by name, locality or city..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="input" style={{ width:150 }} value={city} onChange={e=>setCity(e.target.value)}>
          {cities.map(c=><option key={c} style={{background:'#0a0520'}}>{c}</option>)}
        </select>
        <select className="input" style={{ width:120 }} value={gender} onChange={e=>setGender(e.target.value)}>
          {['All','Male','Female','Any'].map(g=><option key={g} style={{background:'#0a0520'}}>{g}</option>)}
        </select>
        <button onClick={()=>setShowFilters(!showFilters)} className="btn-secondary" style={{ flexShrink:0 }}>
          <SlidersHorizontal size={13}/> Filters
        </button>
      </div>

      {showFilters && (
        <div className="card" style={{ padding:18, marginBottom:18 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <span style={{ fontWeight:600, color:'#fff', fontSize:13 }}>Budget Filter</span>
            <button onClick={()=>setShowFilters(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)' }}><X size={15}/></button>
          </div>
          <div className="label">Max: ₹{maxPrice.toLocaleString()}/month</div>
          <input type="range" min={3000} max={20000} step={500} value={maxPrice} onChange={e=>setMaxPrice(+e.target.value)} style={{ width:'100%', accentColor:'#a855f7', marginTop:8 }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.28)', marginTop:4 }}>
            <span>₹3,000</span><span>₹20,000</span>
          </div>
        </div>
      )}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>
          <span style={{ fontWeight:600, color:'#fff' }}>{filtered.length}</span> properties found
        </p>
        {wishlist.length>0 && <span className="badge-red">{wishlist.length} wishlisted ♥</span>}
      </div>

      {/* Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))', gap:18 }}>
        {filtered.map(p => (
          <div key={p.id} className="card" style={{ overflow:'hidden', transition:'all 0.3s', cursor:'pointer' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(167,139,250,0.35)';e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 12px 30px rgba(0,0,0,0.4)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>

            {/* Image Slider */}
            <div style={{ position:'relative' }}>
              <ImageSlider images={p.images} height={195}/>
              {/* Overlays */}
              <div style={{ position:'absolute', top:10, left:10, zIndex:6 }}>
                <span style={{ background:'rgba(0,0,0,0.65)', backdropFilter:'blur(6px)', color:'#fff', fontSize:10, fontWeight:600, padding:'3px 9px', borderRadius:20, border:'1px solid rgba(255,255,255,0.12)' }}>{p.type}</span>
              </div>
              <button onClick={e=>toggleWishlist(p.id,e)} style={{ position:'absolute', top:10, right:40, zIndex:6, width:28, height:28, borderRadius:'50%', background:'rgba(0,0,0,0.55)', border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                <Heart size={13} style={{ color: wishlist.includes(p.id)?'#f43f5e':'rgba(255,255,255,0.55)', fill: wishlist.includes(p.id)?'#f43f5e':'transparent' }}/>
              </button>
              <div style={{ position:'absolute', top:10, right:8, zIndex:6, display:'flex', alignItems:'center', gap:3, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(6px)', padding:'3px 7px', borderRadius:20, border:'1px solid rgba(251,191,36,0.28)' }}>
                <Star size={10} style={{ color:'#fbbf24', fill:'#fbbf24' }}/>
                <span style={{ fontSize:10, fontWeight:700, color:'#fbbf24' }}>{p.rating}</span>
              </div>
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:60, background:'linear-gradient(to top,rgba(0,0,0,0.7),transparent)', zIndex:5, pointerEvents:'none' }}/>
              <div style={{ position:'absolute', bottom:8, left:10, fontSize:10, color:'rgba(255,255,255,0.75)', display:'flex', alignItems:'center', gap:3, zIndex:6 }}>
                <MapPin size={9}/>{p.locality}, {p.city}
              </div>
            </div>

            {/* Info */}
            <div style={{ padding:'13px 15px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:9 }}>
                <h3 style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0 }}>{p.name}</h3>
                <div style={{ textAlign:'right', flexShrink:0, marginLeft:8 }}>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:16, fontWeight:700, color:'#e879f9', lineHeight:1 }}>₹{p.price.toLocaleString()}</div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.28)', marginTop:2 }}>/month</div>
                </div>
              </div>

              {/* Quick feature icons */}
              <div style={{ display:'flex', gap:6, marginBottom:10, flexWrap:'wrap' }}>
                {p.propertyFeatures?.powerBackup && <span style={{ fontSize:10, color:'rgba(251,191,36,0.8)', background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.2)', padding:'2px 7px', borderRadius:10 }}>⚡ Power Backup</span>}
                {p.propertyFeatures?.lift && <span style={{ fontSize:10, color:'rgba(34,211,238,0.8)', background:'rgba(34,211,238,0.08)', border:'1px solid rgba(34,211,238,0.18)', padding:'2px 7px', borderRadius:10 }}>🏢 Lift</span>}
                {p.roomFeatures?.attachedWashroom && <span style={{ fontSize:10, color:'rgba(52,211,153,0.8)', background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.18)', padding:'2px 7px', borderRadius:10 }}>🚿 Attached</span>}
                {p.propertyFeatures?.securityGuard && <span style={{ fontSize:10, color:'rgba(167,139,250,0.8)', background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)', padding:'2px 7px', borderRadius:10 }}>🛡️ Security</span>}
                {p.connectivity?.internetSpeed && <span style={{ fontSize:10, color:'rgba(96,165,250,0.8)', background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.18)', padding:'2px 7px', borderRadius:10 }}>📶 {p.connectivity.internetSpeed.split(' ')[0]}</span>}
              </div>

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:11, fontWeight:600, color: p.available>0?'#34d399':'#f87171' }}>
                  {p.available>0 ? `${p.available} beds available` : 'Full'}
                </span>
              </div>

              <div style={{ display:'flex', gap:7, marginTop:11 }}>
                <button onClick={()=>setSelected(p)} className="btn-secondary" style={{ flex:1, justifyContent:'center', fontSize:12 }}>View Details</button>
                <button className="btn-primary" style={{ flex:1, justifyContent:'center', fontSize:12 }} disabled={p.available===0}>Book Now</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0 && (
          <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px 20px', color:'rgba(255,255,255,0.25)' }}>
            <Search size={40} style={{ margin:'0 auto 16px', opacity:0.3, display:'block' }}/>
            <p style={{ fontWeight:500 }}>No properties match your filters</p>
          </div>
        )}
      </div>

      {selected && <PropertyModal p={selected} onClose={()=>setSelected(null)}/>}
    </div>
  );
}
