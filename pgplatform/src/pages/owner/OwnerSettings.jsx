import { useState } from 'react';
import { User, Building2, CreditCard, Shield, Bell, Key, LogOut, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function OwnerSettings() {
  const [tab, setTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };

  const tabs = [
    { k:'profile', l:'👤 Profile' },
    { k:'company', l:'🏢 Company' },
    { k:'bank',    l:'💳 Bank' },
    { k:'security',l:'🔐 Security' },
    { k:'notif',   l:'🔔 Notifications' },
  ];

  return (
    <div style={{ maxWidth:800 }}>
      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:800, color:'#fff', marginBottom:20 }}>Owner Settings</div>

      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {tabs.map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)}
            style={{ padding:'8px 16px', borderRadius:8, border:'none', fontSize:13, fontWeight:600, fontFamily:'inherit', cursor:'pointer', background:tab===t.k?'linear-gradient(135deg,#6366f1,#a855f7)':'rgba(255,255,255,0.04)', color:tab===t.k?'#fff':'rgba(255,255,255,0.4)', border:tab===t.k?'none':'1px solid rgba(255,255,255,0.07)' }}>
            {t.l}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding:24 }}>
        {saved && (
          <div style={{ background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.25)', borderRadius:10, padding:'10px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
            <CheckCircle2 size={15} style={{ color:'#34d399' }}/><span style={{ fontSize:13, color:'#34d399', fontWeight:500 }}>Settings saved successfully!</span>
          </div>
        )}

        {tab==='profile' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ fontWeight:700, color:'#fff', fontSize:15, marginBottom:4 }}>Owner Profile</div>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:8, padding:'16px', background:'rgba(255,255,255,0.03)', borderRadius:12, border:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#a855f7)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:800,color:'#fff' }}>RK</div>
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:'#fff' }}>Rajesh Kumar</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>Property Owner · Joined June 2024</div>
              </div>
              <button className="btn-secondary" style={{ marginLeft:'auto', fontSize:12 }}>Change Photo</button>
            </div>
            {[['Full Name','Rajesh Kumar'],['Email','rajesh@owner.com'],['Phone','+91 9876543220'],['City','Bangalore']].map(([l,v])=>(
              <div key={l}>
                <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>{l}</div>
                <input className="input" defaultValue={v}/>
              </div>
            ))}
            <button onClick={save} className="btn-primary" style={{ alignSelf:'flex-start', marginTop:4 }}>Save Profile</button>
          </div>
        )}

        {tab==='company' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ fontWeight:700, color:'#fff', fontSize:15, marginBottom:4 }}>Company Details</div>
            {[['Company Name','RK Properties Pvt Ltd'],['GST Number','29ABCDE1234F1Z5'],['PAN Number','ABCDE1234F'],['Business Address','123, Koramangala, Bangalore - 560034'],['Website','www.rkproperties.com']].map(([l,v])=>(
              <div key={l}>
                <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>{l}</div>
                <input className="input" defaultValue={v}/>
              </div>
            ))}
            <button onClick={save} className="btn-primary" style={{ alignSelf:'flex-start', marginTop:4 }}>Save Company Details</button>
          </div>
        )}

        {tab==='bank' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ fontWeight:700, color:'#fff', fontSize:15, marginBottom:4 }}>Bank Account Details</div>
            <div style={{ background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:10, padding:'10px 14px', fontSize:12, color:'rgba(251,191,36,0.8)' }}>
              ⚠️ Bank details are encrypted and secured with 256-bit SSL
            </div>
            {[['Account Holder Name','Rajesh Kumar'],['Bank Name','State Bank of India'],['Account Number','XXXX XXXX 4512'],['IFSC Code','SBIN0001234'],['Account Type','Current']].map(([l,v])=>(
              <div key={l}>
                <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>{l}</div>
                <input className="input" defaultValue={v}/>
              </div>
            ))}
            <div>
              <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>UPI ID</div>
              <input className="input" defaultValue="rajesh@sbi"/>
            </div>
            <button onClick={save} className="btn-primary" style={{ alignSelf:'flex-start', marginTop:4 }}>Save Bank Details</button>
          </div>
        )}

        {tab==='security' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ fontWeight:700, color:'#fff', fontSize:15, marginBottom:4 }}>Security Settings</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.6)', marginBottom:10 }}>Change Password</div>
              {['Current Password','New Password','Confirm New Password'].map(l=>(
                <div key={l} style={{ marginBottom:10 }}>
                  <div style={{ fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:5 }}>{l}</div>
                  <div style={{ position:'relative' }}>
                    <input className="input" type={showPass?'text':'password'} placeholder="••••••••" style={{ paddingRight:40 }}/>
                    <button onClick={()=>setShowPass(!showPass)} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.25)' }}>
                      {showPass?<EyeOff size={14}/>:<Eye size={14}/>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.7)' }}>Two Factor Authentication</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:2 }}>Secure your account with OTP verification</div>
              </div>
              <button onClick={()=>setTwoFA(!twoFA)} style={{ width:44, height:24, borderRadius:12, background:twoFA?'linear-gradient(135deg,#6366f1,#a855f7)':'rgba(255,255,255,0.1)', border:'none', cursor:'pointer', position:'relative', transition:'all 0.3s', flexShrink:0 }}>
                <div style={{ position:'absolute', top:2, width:20, height:20, borderRadius:'50%', background:'#fff', transition:'left 0.3s', left:twoFA?22:2 }}/>
              </button>
            </div>
            <div className="card" style={{ padding:'14px 16px' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.6)', marginBottom:10 }}>Login History</div>
              {[['Chrome · Windows', 'Bangalore, KA', '2026-06-16 14:32'],['Safari · iPhone', 'Bangalore, KA', '2026-06-15 09:15'],['Chrome · Windows', 'Bangalore, KA', '2026-06-14 18:44']].map(([device,loc,time],i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:12 }}>
                  <span style={{ color:'rgba(255,255,255,0.6)' }}>{device}</span>
                  <span style={{ color:'rgba(255,255,255,0.3)' }}>{loc} · {time}</span>
                </div>
              ))}
            </div>
            <button onClick={save} className="btn-primary" style={{ alignSelf:'flex-start' }}>Save Security Settings</button>
          </div>
        )}

        {tab==='notif' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ fontWeight:700, color:'#fff', fontSize:15, marginBottom:4 }}>Notification Preferences</div>
            {[
              ['SMS Alerts', 'Rent reminders, check-in/out alerts', true],
              ['Email Alerts', 'Monthly reports, payment receipts', true],
              ['WhatsApp Notifications', 'Real-time updates via WhatsApp', false],
              ['Push Notifications', 'Browser/App push notifications', true],
              ['Payment Reminders', 'Auto reminders to tenants for rent', true],
              ['Maintenance Alerts', 'New complaint notifications', true],
              ['Weekly Reports', 'Weekly summary via email', false],
            ].map(([label, sub, def])=>(
              <div key={label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.7)' }}>{label}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.28)', marginTop:2 }}>{sub}</div>
                </div>
                <label style={{ position:'relative', width:44, height:24, cursor:'pointer', flexShrink:0 }}>
                  <input type="checkbox" defaultChecked={def} style={{ opacity:0, width:0, height:0 }}/>
                  <span style={{ position:'absolute', inset:0, borderRadius:12, background:def?'linear-gradient(135deg,#6366f1,#a855f7)':'rgba(255,255,255,0.1)', transition:'0.3s' }}/>
                  <span style={{ position:'absolute', top:2, left:def?22:2, width:20, height:20, borderRadius:'50%', background:'#fff', transition:'0.3s' }}/>
                </label>
              </div>
            ))}
            <button onClick={save} className="btn-primary" style={{ alignSelf:'flex-start', marginTop:4 }}>Save Preferences</button>
          </div>
        )}
      </div>
    </div>
  );
}
