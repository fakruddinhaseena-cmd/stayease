import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Search, CreditCard, Wrench, Users, Shield, Star, MapPin, Menu, X, ArrowRight, Zap, Mail, Phone, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { heroImages, properties } from '../data/mockData';

export default function LandingPage() {
  const { goToAuth } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Hero image slideshow
  useEffect(() => {
    const img = new Image();
    img.src = heroImages[0];
    img.onload = () => setHeroLoaded(true);
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior:'smooth' }); setMenuOpen(false); };

  const services = [
    { icon:Search,    title:'Smart Room Search',   desc:'Filter by city, budget, gender & amenities. AI-powered matching finds your ideal PG in seconds.',  color:'#6366f1' },
    { icon:CreditCard,title:'Seamless Payments',    desc:'Pay rent via UPI, Card or Net Banking. Auto reminders, instant receipts, zero late fee stress.',   color:'#ec4899' },
    { icon:Wrench,    title:'Service Requests',     desc:'Raise maintenance tickets instantly. Real-time tracking from open → assigned → resolved.',          color:'#06b6d4' },
    { icon:Users,     title:'Community Hub',        desc:'Daily meal menus, event RSVPs, polls & announcements. Build real connections.',                      color:'#f59e0b' },
    { icon:Building2, title:'Owner Dashboard',      desc:'Revenue analytics, occupancy tracking, tenant management — complete property control panel.',        color:'#10b981' },
    { icon:Shield,    title:'KYC Verified',         desc:'Aadhaar & PAN verification built in. Safe, secure and legally compliant for everyone.',              color:'#f43f5e' },
  ];

  return (
    <div style={{ background:'#04020f', minHeight:'100vh', fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#fff' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100, height:68,
        display:'flex', alignItems:'center', padding:'0 48px',
        background: scrolled ? 'rgba(4,2,15,0.92)' : 'rgba(4,2,15,0.3)',
        backdropFilter:'blur(20px)',
        borderBottom:`1px solid ${scrolled ? 'rgba(255,255,255,0.07)' : 'transparent'}`,
        transition:'all 0.4s',
      }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:900, background:'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:3, marginRight:'auto' }}>
          STAYEASE
        </div>
        <div style={{ display:'flex', gap:36, marginRight:36 }} className="hide-mobile">
          {['home','services','about','contact'].map(s => (
            <button key={s} onClick={() => scrollTo(s)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.5)', textTransform:'capitalize', letterSpacing:'0.04em', fontFamily:'inherit', transition:'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.5)'}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:10 }} className="hide-mobile">
          <button onClick={() => goToAuth('login')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)', padding:'9px 22px', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)'}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)'}}>
            Login
          </button>
          <button onClick={() => goToAuth('register')} style={{ background:'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)', border:'none', color:'#fff', padding:'9px 22px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 16px rgba(139,92,246,0.35)' }}>
            Get Started
          </button>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="show-mobile" style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', padding:4 }}>
          {menuOpen ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position:'fixed', top:68, left:0, right:0, zIndex:99, background:'rgba(4,2,15,0.97)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'16px 24px 24px', display:'flex', flexDirection:'column', gap:2 }}>
          {['home','services','about','contact'].map(s => (
            <button key={s} onClick={() => scrollTo(s)} style={{ background:'none', border:'none', textAlign:'left', padding:'13px 0', fontSize:15, fontWeight:500, color:'rgba(255,255,255,0.6)', cursor:'pointer', fontFamily:'inherit', borderBottom:'1px solid rgba(255,255,255,0.04)', textTransform:'capitalize' }}>{s}</button>
          ))}
          <div style={{ display:'flex', gap:10, marginTop:16 }}>
            <button onClick={() => goToAuth('login')} style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)', padding:'12px', borderRadius:8, fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>Login</button>
            <button onClick={() => goToAuth('register')} style={{ flex:1, background:'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)', border:'none', color:'#fff', padding:'12px', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Get Started</button>
          </div>
        </div>
      )}

      {/* ── HERO — Real property image background ── */}
      <section id="home" style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', overflow:'hidden' }}>

        {/* Background images with crossfade */}
        {heroImages.map((img, i) => (
          <div key={i} style={{
            position:'absolute', inset:0, zIndex:0,
            backgroundImage:`url(${img})`,
            backgroundSize:'cover', backgroundPosition:'center',
            opacity: i === heroIdx ? 1 : 0,
            transition:'opacity 1.2s ease',
          }}/>
        ))}

        {/* Dark overlay gradient — makes text readable */}
        <div style={{ position:'absolute', inset:0, zIndex:1, background:'linear-gradient(135deg, rgba(4,2,15,0.88) 0%, rgba(10,0,30,0.82) 40%, rgba(4,2,15,0.6) 100%)' }}/>

        {/* Bottom fade to site bg */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:160, zIndex:2, background:'linear-gradient(to bottom, transparent, #04020f)' }}/>

        {/* Subtle purple glow on top of image */}
        <div style={{ position:'absolute', inset:0, zIndex:1, background:'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.18) 0%, transparent 60%)' }}/>

        {/* Content */}
        <div style={{ position:'relative', zIndex:3, width:'100%', maxWidth:1200, margin:'0 auto', padding:'120px 48px 80px', display:'grid', gridTemplateColumns:'1fr 420px', gap:40, alignItems:'center' }}>

          {/* Left copy */}
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:50, padding:'6px 18px', marginBottom:28, fontSize:12, fontWeight:600, color:'#a78bfa', letterSpacing:'0.08em' }}>
              <Zap size={12}/> Next-Gen PG & Co-Living Platform
            </div>
            <h1 style={{ fontFamily:"'Orbitron',monospace", fontSize:'clamp(36px,5.5vw,68px)', fontWeight:900, lineHeight:1.05, marginBottom:20, color:'#fff', textShadow:'0 2px 40px rgba(0,0,0,0.8)' }}>
              FIND YOUR<br/>
              <span style={{ background:'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>PERFECT</span>
              <br/>SPACE
            </h1>
            <p style={{ fontSize:'clamp(14px,1.5vw,17px)', color:'rgba(255,255,255,0.6)', lineHeight:1.8, marginBottom:36, maxWidth:480, textShadow:'0 1px 8px rgba(0,0,0,0.6)' }}>
              Discover premium PG & co-living spaces across India.<br/>
              <strong style={{ color:'rgba(255,255,255,0.85)', fontWeight:600 }}>Instant booking. Smart management. Zero hassle.</strong>
            </p>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:48 }}>
              <button onClick={() => goToAuth('register')} style={{ background:'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)', border:'none', color:'#fff', padding:'14px 36px', borderRadius:12, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 8px 32px rgba(139,92,246,0.5)', display:'flex', alignItems:'center', gap:8, transition:'transform 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                Explore Properties <ArrowRight size={16}/>
              </button>
              <button onClick={() => goToAuth('login')} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.8)', padding:'14px 36px', borderRadius:12, fontSize:15, fontWeight:500, cursor:'pointer', fontFamily:'inherit', backdropFilter:'blur(10px)', transition:'all 0.2s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.14)'}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)'}}>
                Owner Login →
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display:'flex', gap:32, flexWrap:'wrap' }}>
              {[['2,400+','Properties'],['18K+','Tenants'],['12','Cities'],['98%','Satisfaction']].map(([v,l]) => (
                <div key={l}>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:22, fontWeight:700, color:'#e879f9', lineHeight:1 }}>{v}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.12em', marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Property preview cards */}
          <div style={{ display:'flex', flexDirection:'column', gap:12 }} className="hide-mobile">
            {properties.slice(0,3).map((p, i) => (
              <div key={p.id} style={{
                display:'flex', alignItems:'center', gap:14,
                background:'rgba(255,255,255,0.06)', backdropFilter:'blur(16px)',
                border:'1px solid rgba(255,255,255,0.1)', borderRadius:14,
                padding:'12px 14px',
                transform: `translateX(${i * 16}px)`,
                boxShadow:'0 4px 20px rgba(0,0,0,0.4)',
                transition:'all 0.3s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.transform=`translateX(${i*16}px) scale(1.02)`}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.transform=`translateX(${i*16}px)`}}>
                <div style={{ width:60, height:60, borderRadius:10, overflow:'hidden', flexShrink:0 }}>
                  <img src={p.images[0]} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', display:'flex', alignItems:'center', gap:4, marginTop:2 }}>
                    <MapPin size={10}/>{p.locality}, {p.city}
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#e879f9', marginTop:4 }}>₹{p.price.toLocaleString()}<span style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:400 }}>/mo</span></div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:3, background:'rgba(251,191,36,0.15)', border:'1px solid rgba(251,191,36,0.3)', borderRadius:8, padding:'4px 8px' }}>
                  <Star size={11} style={{ color:'#fbbf24', fill:'#fbbf24' }}/>
                  <span style={{ fontSize:11, fontWeight:600, color:'#fbbf24' }}>{p.rating}</span>
                </div>
              </div>
            ))}
            <div style={{ textAlign:'right', paddingRight:8 }}>
              <button onClick={() => goToAuth('register')} style={{ background:'none', border:'none', color:'rgba(167,139,250,0.7)', fontSize:12, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:4 }}>
                View all {properties.length} properties <ArrowRight size={12}/>
              </button>
            </div>
          </div>
        </div>

        {/* Image dot indicators */}
        <div style={{ position:'absolute', bottom:48, left:'50%', transform:'translateX(-50%)', zIndex:3, display:'flex', gap:8 }}>
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} style={{ width: i===heroIdx ? 24 : 8, height:8, borderRadius:4, border:'none', cursor:'pointer', background: i===heroIdx ? '#a78bfa' : 'rgba(255,255,255,0.25)', transition:'all 0.4s', padding:0 }}/>
          ))}
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ── */}
      <section style={{ padding:'80px 48px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:40, flexWrap:'wrap', gap:16 }}>
            <div>
              <div style={{ fontSize:11, letterSpacing:'0.3em', textTransform:'uppercase', color:'#a855f7', fontWeight:600, marginBottom:10 }}>Browse Properties</div>
              <h2 style={{ fontFamily:"'Orbitron',monospace", fontSize:'clamp(22px,3.5vw,36px)', fontWeight:700, color:'#fff', margin:0 }}>Featured Listings</h2>
            </div>
            <button onClick={() => goToAuth('register')} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', padding:'10px 20px', borderRadius:8, fontSize:13, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:6 }}>
              View All <ArrowRight size={14}/>
            </button>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
            {properties.slice(0,6).map(p => (
              <div key={p.id} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, overflow:'hidden', cursor:'pointer', transition:'all 0.3s' }}
                onMouseEnter={e=>{e.currentTarget.style.border='1px solid rgba(167,139,250,0.3)';e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,0.4)'}}
                onMouseLeave={e=>{e.currentTarget.style.border='1px solid rgba(255,255,255,0.07)';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
                {/* Image */}
                <div style={{ position:'relative', height:180, overflow:'hidden' }}>
                  <img src={p.images[0]} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s' }}
                    onMouseEnter={e=>e.target.style.transform='scale(1.06)'} onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                  {/* Overlay badges */}
                  <div style={{ position:'absolute', top:12, left:12 }}>
                    <span style={{ background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', color:'#fff', fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:20, border:'1px solid rgba(255,255,255,0.15)' }}>{p.type}</span>
                  </div>
                  <div style={{ position:'absolute', top:12, right:12, display:'flex', alignItems:'center', gap:4, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', padding:'4px 8px', borderRadius:20, border:'1px solid rgba(251,191,36,0.3)' }}>
                    <Star size={11} style={{ color:'#fbbf24', fill:'#fbbf24' }}/>
                    <span style={{ fontSize:11, fontWeight:600, color:'#fbbf24' }}>{p.rating}</span>
                  </div>
                  {/* Bottom gradient */}
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:60, background:'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}/>
                  <div style={{ position:'absolute', bottom:10, left:12, fontSize:11, color:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center', gap:4 }}>
                    <MapPin size={10}/>{p.locality}, {p.city}
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding:'14px 16px' }}>
                  <div style={{ display:'flex', alignItems:'start', justifyContent:'space-between', marginBottom:8 }}>
                    <h3 style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0 }}>{p.name}</h3>
                    <div style={{ textAlign:'right', flexShrink:0, marginLeft:8 }}>
                      <div style={{ fontSize:16, fontWeight:700, color:'#e879f9', fontFamily:"'Orbitron',monospace" }}>₹{p.price.toLocaleString()}</div>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>/month</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
                    {p.amenities.slice(0,4).map(a => (
                      <span key={a} style={{ fontSize:10, color:'rgba(167,139,250,0.8)', background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', padding:'2px 8px', borderRadius:12 }}>{a}</span>
                    ))}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:12, color: p.available > 0 ? '#34d399' : '#f87171', fontWeight:600 }}>
                      {p.available > 0 ? `${p.available} beds available` : 'Full'}
                    </span>
                    <button onClick={() => goToAuth('register')} style={{ background:'linear-gradient(135deg,#6366f1,#a855f7)', border:'none', color:'#fff', padding:'7px 16px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding:'80px 48px', borderTop:'1px solid rgba(255,255,255,0.05)', background:'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <div style={{ fontSize:11, letterSpacing:'0.3em', textTransform:'uppercase', color:'#a855f7', fontWeight:600, marginBottom:12 }}>What We Offer</div>
            <h2 style={{ fontFamily:"'Orbitron',monospace", fontSize:'clamp(24px,4vw,40px)', fontWeight:700, color:'#fff' }}>Our Services</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20 }}>
            {services.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.title} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'28px', transition:'all 0.3s' }}
                  onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${s.color}40`;e.currentTarget.style.transform='translateY(-4px)'}}
                  onMouseLeave={e=>{e.currentTarget.style.border='1px solid rgba(255,255,255,0.07)';e.currentTarget.style.transform='translateY(0)'}}>
                  <div style={{ width:48, height:48, borderRadius:12, background:`${s.color}20`, border:`1px solid ${s.color}40`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                    <Icon size={22} style={{ color:s.color }}/>
                  </div>
                  <h3 style={{ fontSize:16, fontWeight:700, color:'#fff', marginBottom:10 }}>{s.title}</h3>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.7, margin:0 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding:'80px 48px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
          <div>
            <div style={{ fontSize:11, letterSpacing:'0.3em', textTransform:'uppercase', color:'#a855f7', fontWeight:600, marginBottom:16 }}>About StayEase</div>
            <h2 style={{ fontFamily:"'Orbitron',monospace", fontSize:'clamp(22px,3.5vw,36px)', fontWeight:700, color:'#fff', lineHeight:1.15, marginBottom:20 }}>Built for the<br/>Modern Professional</h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.45)', lineHeight:1.85, marginBottom:24 }}>
              StayEase digitizes the entire PG rental lifecycle — from discovery to checkout — for tenants, owners, and administrators. No paperwork, no middlemen, no confusion.
            </p>
            {['Instant room booking with digital agreements','Transparent pricing, no hidden charges','24/7 maintenance request tracking','Community events & meal management'].map(f => (
              <div key={f} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <CheckCircle2 size={16} style={{ color:'#a855f7', flexShrink:0 }}/>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.55)' }}>{f}</span>
              </div>
            ))}
          </div>
          {/* Property collage */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'200px 200px', gap:12 }}>
            {properties.slice(0,4).map((p,i) => (
              <div key={p.id} style={{ borderRadius:14, overflow:'hidden', position:'relative', gridColumn: i===0 ? '1/2' : 'auto', gridRow: i===0 ? '1/3' : 'auto' }}>
                <img src={p.images[0]} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }}/>
                <div style={{ position:'absolute', bottom:10, left:10 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>{p.name}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.6)' }}>{p.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding:'80px 48px', borderTop:'1px solid rgba(255,255,255,0.05)', background:'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center' }}>
          <div style={{ fontSize:11, letterSpacing:'0.3em', textTransform:'uppercase', color:'#a855f7', fontWeight:600, marginBottom:12 }}>Contact</div>
          <h2 style={{ fontFamily:"'Orbitron',monospace", fontSize:'clamp(24px,4vw,40px)', fontWeight:700, color:'#fff', marginBottom:12 }}>Get In Touch</h2>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.35)', marginBottom:48 }}>Have questions? We'd love to hear from you.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:48 }}>
            {[[Mail,'hello@stayease.in','Email Us'],[Phone,'+91 9876543210','Call Us'],[MapPin,'Bangalore, Karnataka','HQ']].map(([Icon,val,lbl]) => (
              <div key={lbl} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={20} style={{ color:'#a855f7' }}/>
                </div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em' }}>{lbl}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', fontWeight:500 }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(236,72,153,0.1))', border:'1px solid rgba(139,92,246,0.2)', borderRadius:20, padding:40 }}>
            <h3 style={{ fontSize:22, fontWeight:700, color:'#fff', marginBottom:10 }}>Ready to Get Started?</h3>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:24 }}>Join thousands of tenants and owners who trust StayEase.</p>
            <button onClick={() => goToAuth('register')} style={{ background:'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)', border:'none', color:'#fff', padding:'14px 40px', borderRadius:12, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 8px 32px rgba(139,92,246,0.4)', display:'inline-flex', alignItems:'center', gap:8 }}>
              Create Free Account <ArrowRight size={16}/>
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:'24px 48px', display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid rgba(255,255,255,0.06)', background:'rgba(4,2,15,0.9)', flexWrap:'wrap', gap:12 }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:16, fontWeight:900, background:'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>STAYEASE</div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)' }}>© 2026 StayEase. All rights reserved.</div>
        <div style={{ display:'flex', gap:20 }}>
          {['Privacy Policy','Terms','Cookies'].map(l=><span key={l} style={{ fontSize:11, color:'rgba(255,255,255,0.2)', cursor:'pointer' }}>{l}</span>)}
        </div>
      </footer>

      <style>{`
        @media(max-width:900px){
          .hide-mobile{display:none!important}
          #about>div{grid-template-columns:1fr!important}
          section{padding-left:20px!important;padding-right:20px!important}
        }
        .show-mobile{display:none}
        @media(max-width:900px){.show-mobile{display:block!important}}
      `}</style>
    </div>
  );
}
