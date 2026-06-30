import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Bell, LogOut, Menu, X } from 'lucide-react';

export default function Layout({ nav, title }) {
  const { user, logout, notifications } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(nav[0]?.key);

  const unread = notifications.filter(n => !n.read).length;
  const ActivePage = nav.find(n => n.key === activeNav)?.component;

  const roleColors = {
    tenant: { grad:'linear-gradient(135deg,#7c3aed,#6d28d9)', accent:'#a855f7', border:'rgba(168,85,247,0.4)' },
    owner:  { grad:'linear-gradient(135deg,#0891b2,#0e7490)', accent:'#22d3ee', border:'rgba(34,211,238,0.4)' },
    admin:  { grad:'linear-gradient(135deg,#dc2626,#9f1239)', accent:'#f87171', border:'rgba(248,113,113,0.4)' },
  };
  const rc = roleColors[user?.role] || roleColors.tenant;

  const SIDEBAR_W = 240;

  return (
    <div style={{ minHeight:'100vh', background:'#04020f', display:'flex', fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#fff' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:40, display:'block' }}
          className="lg:hidden"
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        position: 'fixed',
        top: 0, left: 0,
        height: '100vh',
        width: SIDEBAR_W,
        background: 'rgba(6,3,18,0.98)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease',
        transform: sidebarOpen ? 'translateX(0)' : `translateX(-${SIDEBAR_W}px)`,
      }}
      id="sidebar">

        {/* Logo row */}
        <div style={{ padding:'18px 20px 14px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:17, fontWeight:900, background:'linear-gradient(135deg,#c084fc,#e879f9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:3 }}>
            STAYEASE
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', padding:4, lineHeight:0 }}>
            <X size={16}/>
          </button>
        </div>

        {/* User card */}
        <div style={{ padding:'14px 14px 10px', borderBottom:'1px solid rgba(255,255,255,0.04)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.04)', border:`1px solid ${rc.border}30`, borderRadius:10, padding:'10px 12px' }}>
            <div style={{ width:34, height:34, borderRadius:9, background:rc.grad, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff', flexShrink:0, letterSpacing:0.5 }}>
              {user?.name?.split(' ').map(x=>x[0]).join('').slice(0,2)}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', textTransform:'capitalize', marginTop:1 }}>{user?.role}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'10px 10px', overflowY:'auto', display:'flex', flexDirection:'column', gap:2 }}>
          {nav.map(item => {
            const Icon = item.icon;
            const isActive = activeNav === item.key;
            return (
              <button key={item.key}
                onClick={() => { setActiveNav(item.key); setSidebarOpen(false); }}
                style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'10px 12px', borderRadius:8,
                  border:'none', cursor:'pointer', fontFamily:'inherit',
                  textAlign:'left', width:'100%', transition:'all 0.18s',
                  fontSize:13, fontWeight: isActive ? 600 : 400,
                  color: isActive ? rc.accent : 'rgba(255,255,255,0.38)',
                  background: isActive ? `${rc.accent}18` : 'transparent',
                  borderRight: isActive ? `2px solid ${rc.accent}` : '2px solid transparent',
                }}>
                <Icon size={15} style={{ flexShrink:0 }}/>
                <span style={{ flex:1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{ background:'#ef4444', color:'#fff', fontSize:9, borderRadius:10, padding:'1px 5px', fontWeight:700 }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sign out */}
        <div style={{ padding:'10px', borderTop:'1px solid rgba(255,255,255,0.04)', flexShrink:0 }}>
          <button onClick={logout}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'inherit', width:'100%', fontSize:13, fontWeight:500, color:'rgba(239,68,68,0.6)', background:'transparent', transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(239,68,68,0.08)';e.currentTarget.style.color='#f87171'}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(239,68,68,0.6)'}}>
            <LogOut size={15}/> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN WRAPPER — always offset by sidebar width on desktop ── */}
      <div id="main-wrap" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        marginLeft: 0,   /* overridden by CSS below for large screens */
      }}>

        {/* Topbar */}
        <header style={{
          background: 'rgba(6,3,18,0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '0 20px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          position: 'sticky',
          top: 0,
          zIndex: 30,
          backdropFilter: 'blur(20px)',
          flexShrink: 0,
        }}>
          <button onClick={() => setSidebarOpen(true)}
            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.55)', padding:'7px 8px', borderRadius:8, cursor:'pointer', display:'flex', lineHeight:0 }}>
            <Menu size={17}/>
          </button>

          <span style={{ fontFamily:"'Orbitron',monospace", fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.45)', letterSpacing:2 }}>
            {nav.find(n => n.key === activeNav)?.label || title}
          </span>

          <div style={{ flex:1 }}/>

          {/* Notif bell */}
          <div style={{ position:'relative' }}>
            <button onClick={() => setNotifOpen(o => !o)}
              style={{ position:'relative', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.55)', padding:'7px 8px', borderRadius:8, cursor:'pointer', display:'flex', lineHeight:0 }}>
              <Bell size={17}/>
              {unread > 0 && (
                <span style={{ position:'absolute', top:7, right:7, width:7, height:7, background:'#ef4444', borderRadius:'50%', border:'2px solid #04020f' }}/>
              )}
            </button>
            {notifOpen && (
              <div style={{ position:'absolute', right:0, top:'calc(100% + 8px)', width:290, background:'rgba(10,5,25,0.99)', border:'1px solid rgba(168,85,247,0.18)', borderRadius:12, overflow:'hidden', boxShadow:'0 16px 40px rgba(0,0,0,0.7)', zIndex:100 }}>
                <div style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:1 }}>Notifications</div>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', background: !n.read ? 'rgba(168,85,247,0.06)' : 'transparent' }}>
                    <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>{n.msg}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', marginTop:3, textTransform:'capitalize' }}>{n.type}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div style={{ width:34, height:34, borderRadius:9, background:rc.grad, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', letterSpacing:0.5, flexShrink:0 }}>
            {user?.name?.split(' ').map(x=>x[0]).join('').slice(0,2)}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, padding:'24px 28px', overflowY:'auto', minHeight:0 }}>
          {ActivePage ? <ActivePage /> : null}
        </main>
      </div>

      {/* ── CSS: push main content right on large screens ── */}
      <style>{`
        @media (min-width: 1024px) {
          #sidebar { transform: translateX(0) !important; }
          #main-wrap { margin-left: ${SIDEBAR_W}px !important; }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
