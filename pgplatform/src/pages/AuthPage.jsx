import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2, User, Shield, ArrowLeft, CheckCircle2,
  ChevronRight, Eye, EyeOff, Mail, Lock, RefreshCw, Smartphone
} from 'lucide-react';

const DEMO_MODE = false; // Real API mode

const ROLE_IMAGES = {
  tenant: '/img-tenant.png',
  owner:  '/img-owner.png',
  admin:  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=85',
};
const ROLE_QUOTES = {
  tenant: { headline:'"Find your perfect home away from home"',    sub:'Thousands of verified PGs waiting for you' },
  owner:  { headline:'"Manage your properties smarter"',           sub:'Track tenants, rent & requests — all in one place' },
  admin:  { headline:'"Full platform control at your fingertips"', sub:'Monitor, approve & manage the entire platform' },
};
const ROLES = [
  { key:'tenant', label:'Tenant',         sub:'I am looking for a PG or co-living space', icon:User,      grad:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'rgba(139,92,246,0.55)', glow:'rgba(139,92,246,0.2)',  tag:'Most Popular' },
  { key:'owner',  label:'Property Owner', sub:'I own or manage rental properties',         icon:Building2, grad:'linear-gradient(135deg,#06b6d4,#0891b2)', border:'rgba(6,182,212,0.5)',   glow:'rgba(6,182,212,0.15)',  tag:'For Owners' },
  { key:'admin',  label:'Super Admin',    sub:'Platform administrator & control panel',    icon:Shield,    grad:'linear-gradient(135deg,#f43f5e,#e11d48)', border:'rgba(244,63,94,0.5)',   glow:'rgba(244,63,94,0.15)',  tag:'Admin' },
];

export default function AuthPage() {
  const { authMode, goToLandingFromAuth, login, afterRegister } = useApp();

  const [mode, setMode] = useState(authMode);
  const [role, setRole] = useState('tenant');
  const [step, setStep] = useState('role');

  useEffect(() => {
    setMode(authMode);
    setStep('role');
    setError('');
    setSuccess(false);
  }, [authMode]);

  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]    = useState('');
  const [regPhone,    setRegPhone]    = useState('');
  const [regEmail,    setRegEmail]    = useState('');
  const [regPass,     setRegPass]     = useState('');
  const [showRegPass, setShowRegPass] = useState(false);

  const [loginEmail,    setLoginEmail]    = useState('');
  const [loginPhone,    setLoginPhone]    = useState('');
  const [loginMethod,   setLoginMethod]   = useState('email'); // 'email' | 'phone'
  const [loginPass,     setLoginPass]     = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  const [otp,        setOtp]        = useState(['','','','','','']);
  const [otpTarget,  setOtpTarget]  = useState('');
  const [otpChannel, setOtpChannel] = useState('email'); // 'email' | 'phone' — which API to verify against
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const sel = ROLES.find(r => r.key === role);

  const resetOtp = () => setOtp(['','','','','','']);

  const startTimer = () => {
    setResendTimer(30);
    const t = setInterval(() => {
      setResendTimer(prev => { if (prev <= 1) { clearInterval(t); return 0; } return prev - 1; });
    }, 1000);
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[idx] = val.slice(-1); setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const switchMode = (m) => {
    setMode(m); setStep('role'); setError(''); setSuccess(false); resetOtp();
    setFirstName(''); setLastName(''); setRegPhone(''); setRegEmail(''); setRegPass('');
    setLoginEmail(''); setLoginPhone(''); setLoginPass(''); setLoginMethod('email');
  };

  const handleRegister = async () => {
    if (!firstName.trim()) return setError('First name is required');
    if (!lastName.trim())  return setError('Last name is required');
    if (regPhone.length < 10) return setError('Enter a valid 10-digit phone number');
    if (!regEmail.includes('@')) return setError('Enter a valid email address');
    if (regPass.length < 6) return setError('Password must be at least 6 characters');
    setError(''); setLoading(true);
    if (DEMO_MODE) {
      setTimeout(() => { setLoading(false); setSuccess(true); setTimeout(() => afterRegister(), 2500); }, 1000);
      return;
    }
    try {
      const { api } = await import('../config/api');
      const result = await api.register({ firstName, lastName, phone: regPhone, email: regEmail, password: regPass, role });
      if (result.success) { setSuccess(true); setTimeout(() => afterRegister(), 2500); }
      else setError(result.message || 'Registration failed');
    } catch (err) { setError(err.message || 'Registration failed'); }
    setLoading(false);
  };

  const handleSendOTP = async () => {
    if (loginMethod === 'email') {
      if (!loginEmail.includes('@')) return setError('Enter a valid email address');
      setError(''); setLoading(true);
      setOtpTarget(loginEmail); setOtpChannel('email');
      try {
        const { api } = await import('../config/api');
        const result = await api.sendEmailOTP(loginEmail);
        if (result.success) { setStep('otp'); startTimer(); }
        else setError(result.message || 'Failed to send OTP');
      } catch (err) { setError(err.message || 'OTP send failed'); }
      setLoading(false);
    } else {
      if (loginPhone.length < 10) return setError('Enter a valid 10-digit phone number');
      setError(''); setLoading(true);
      setOtpTarget(loginPhone); setOtpChannel('phone');
      try {
        const { api } = await import('../config/api');
        const result = await api.sendPhoneOTP(loginPhone);
        if (result.success) { setStep('otp'); startTimer(); }
        else setError(result.message || 'Failed to send OTP');
      } catch (err) { setError(err.message || 'OTP send failed'); }
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length < 6) return setError('Enter all 6 digits');
    setError(''); setLoading(true);
    if (DEMO_MODE) {
      setTimeout(() => { setLoading(false); setSuccess(true); setTimeout(() => login(role), 1000); }, 800);
      return;
    }
    try {
      const { api } = await import('../config/api');
      const result = otpChannel === 'phone'
        ? await api.verifyPhoneOTP(loginPhone, code, role)
        : await api.verifyEmailOTP(loginEmail, code, role);
      if (result.success) {
        localStorage.setItem('stayease_token', result.token);
        setSuccess(true);
        setTimeout(() => login(role, result.user), 1000);
      } else setError(result.message);
    } catch (err) { setError(err.message || 'Verification failed'); }
    setLoading(false);
  };

  const btnStyle = (disabled) => ({
    background: 'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)', border:'none', color:'#fff',
    padding:'13px', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer',
    fontFamily:'inherit', width:'100%', display:'flex', alignItems:'center',
    justifyContent:'center', gap:8, opacity:(disabled||loading)?0.65:1,
    boxShadow:'0 4px 20px rgba(139,92,246,0.35)'
  });

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#04020f', overflow:'hidden' }}>

      {/* LEFT panel */}
      <div style={{ flex:1, position:'relative', display:'flex', flexDirection:'column', justifyContent:'flex-end', overflow:'hidden' }} className="auth-left">
        {ROLES.map(r => (
          <div key={r.key} style={{ position:'absolute', inset:0, backgroundImage:`url(${ROLE_IMAGES[r.key]})`, backgroundSize:'cover', backgroundPosition:'center', opacity:role===r.key?1:0, transition:'opacity 0.8s ease', zIndex:0 }}/>
        ))}
        <div style={{ position:'absolute', inset:0, zIndex:1, background:'linear-gradient(to top,rgba(4,2,15,0.93) 0%,rgba(4,2,15,0.55) 40%,rgba(4,2,15,0.2) 100%)' }}/>
        <div style={{ position:'absolute', top:0, right:0, bottom:0, width:100, zIndex:2, background:'linear-gradient(to right,transparent,#04020f)' }}/>
        <div style={{ position:'absolute', top:24, left:32, zIndex:4 }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:900, background:'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:3 }}>STAYEASE</div>
        </div>
        <button onClick={goToLandingFromAuth} style={{ position:'absolute', top:24, right:120, zIndex:4, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.55)', padding:'7px 14px', borderRadius:8, fontSize:12, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:5 }}>
          <ArrowLeft size={13}/>Back
        </button>
        <div style={{ position:'relative', zIndex:3, padding:'0 48px 52px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:sel?.grad, padding:'5px 14px', borderRadius:50, marginBottom:14 }}>
            {sel && <sel.icon size={13} style={{ color:'#fff' }}/>}
            <span style={{ fontSize:11, fontWeight:700, color:'#fff', letterSpacing:'0.06em' }}>{sel?.label}</span>
          </div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'clamp(18px,2.5vw,26px)', fontWeight:900, color:'#fff', lineHeight:1.2, marginBottom:8 }}>{ROLE_QUOTES[role]?.headline}</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)' }}>{ROLE_QUOTES[role]?.sub}</div>
        </div>
      </div>

      {/* RIGHT form panel */}
      <div style={{ width:460, flexShrink:0, background:'rgba(6,3,18,0.98)', borderLeft:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', justifyContent:'center', padding:'36px', overflowY:'auto', minHeight:'100vh' }}>

        <div style={{ textAlign:'center', marginBottom:22 }}>
          <div style={{ fontSize:20, fontWeight:800, color:'#fff', marginBottom:4 }}>
            {step==='role' && (mode==='login' ? 'Welcome back 👋' : 'Create account')}
            {step==='reg_form' && 'Create your account'}
            {step==='login_otp' && 'Login with OTP'}
            {step==='otp' && 'Verify OTP'}
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>
            {step==='otp' ? `OTP sent to ${otpTarget}` : 'StayEase PG & Co-Living Platform'}
          </div>
        </div>

        {step==='role' && (
          <div style={{ display:'flex', background:'rgba(0,0,0,0.3)', borderRadius:10, padding:3, marginBottom:20, gap:3 }}>
            {[{k:'login',l:'Sign In'},{k:'register',l:'Register'}].map(t => (
              <button key={t.k} onClick={() => switchMode(t.k)}
                style={{ flex:1, padding:'9px', borderRadius:8, border:'none', fontSize:13, fontWeight:600, fontFamily:'inherit', cursor:'pointer', background:mode===t.k?'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)':'transparent', color:mode===t.k?'#fff':'rgba(255,255,255,0.3)' }}>
                {t.l}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.25)', borderRadius:8, padding:'9px 14px', marginBottom:14, fontSize:12, color:'#f87171' }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ textAlign:'center', padding:'32px 0' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 0 30px rgba(139,92,246,0.45)' }}>
              <CheckCircle2 size={28} style={{ color:'#fff' }}/>
            </div>
            <div style={{ fontSize:18, fontWeight:700, color:'#fff', marginBottom:6 }}>
              {mode==='register' ? 'Account Created! 🎉' : 'Login Successful! 🎉'}
            </div>
            {mode==='register' ? (
              <>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Check your email for a welcome message!</div>
                <div style={{ fontSize:12, color:'rgba(167,139,250,0.7)', marginBottom:6 }}>✉️ Welcome email sent to {regEmail}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>Redirecting to login page...</div>
              </>
            ) : (
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>Loading your dashboard...</div>
            )}
          </div>
        )}

        {/* ROLE SELECT */}
        {!success && step==='role' && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.28)', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:6 }}>
              {mode==='login' ? 'Login As' : 'Register As'}
            </div>
            {ROLES.map(r => {
              const Icon = r.icon;
              const active = role === r.key;
              return (
                <button key={r.key} onClick={() => setRole(r.key)} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 15px', borderRadius:13, border:`1.5px solid ${active?r.border:'rgba(255,255,255,0.06)'}`, background:active?`linear-gradient(135deg,${r.glow},rgba(255,255,255,0.02))`:'rgba(255,255,255,0.02)', cursor:'pointer', fontFamily:'inherit', textAlign:'left', width:'100%' }}>
                  <div style={{ width:40, height:40, borderRadius:10, flexShrink:0, background:active?r.grad:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={17} style={{ color:active?'#fff':'rgba(255,255,255,0.22)' }}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:active?'#fff':'rgba(255,255,255,0.42)', fontFamily:'inherit' }}>{r.label}</span>
                      <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:20, background:active?r.grad:'rgba(255,255,255,0.05)', color:active?'#fff':'rgba(255,255,255,0.18)' }}>{r.tag}</span>
                    </div>
                    <div style={{ fontSize:11, color:active?'rgba(255,255,255,0.45)':'rgba(255,255,255,0.18)', marginTop:2 }}>{r.sub}</div>
                  </div>
                  {active && <CheckCircle2 size={16} style={{ color:'#a78bfa', flexShrink:0 }}/>}
                </button>
              );
            })}
            <div style={{ height:1, background:'rgba(255,255,255,0.05)', margin:'8px 0' }}/>
            <button onClick={() => mode==='register' ? setStep('reg_form') : setStep('login_otp')} style={btnStyle(false)}>
              Continue <ChevronRight size={15}/>
            </button>
          </div>
        )}

        {/* REGISTER FORM */}
        {!success && step==='reg_form' && (
          <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
            <button onClick={() => { setStep('role'); setError(''); }} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:12, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:5, padding:0, marginBottom:4 }}>
              <ArrowLeft size={13}/>← Back
            </button>
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:5 }}>First Name *</div>
                <input className="input" placeholder="Arjun" value={firstName} onChange={e => setFirstName(e.target.value)} autoFocus/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:5 }}>Last Name *</div>
                <input className="input" placeholder="Mehta" value={lastName} onChange={e => setLastName(e.target.value)}/>
              </div>
            </div>
            <div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:5 }}>Phone Number *</div>
              <div style={{ display:'flex', gap:8 }}>
                <div style={{ background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'11px 14px', fontSize:13, color:'rgba(255,255,255,0.6)', flexShrink:0 }}>+91</div>
                <input className="input" type="tel" placeholder="10-digit mobile number" value={regPhone} onChange={e => setRegPhone(e.target.value.replace(/\D/g,'').slice(0,10))}/>
              </div>
            </div>
            <div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:5 }}>Email Address *</div>
              <div style={{ position:'relative' }}>
                <Mail size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.2)', pointerEvents:'none' }}/>
                <input className="input" type="email" placeholder="your@email.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} style={{ paddingLeft:36 }}/>
              </div>
            </div>
            <div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:5 }}>Password *</div>
              <div style={{ position:'relative' }}>
                <Lock size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.2)', pointerEvents:'none' }}/>
                <input type={showRegPass?'text':'password'} className="input" style={{ paddingLeft:36, paddingRight:40 }}
                  placeholder="Min 6 characters" value={regPass} onChange={e => setRegPass(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && handleRegister()}/>
                <button onClick={() => setShowRegPass(!showRegPass)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.25)', padding:2 }}>
                  {showRegPass ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>
            <button onClick={handleRegister} disabled={!firstName||!lastName||regPhone.length<10||!regEmail||regPass.length<6||loading} style={btnStyle(!firstName||!lastName||regPhone.length<10||!regEmail||regPass.length<6)}>
              {loading ? 'Please wait...' : <> Create Account <ChevronRight size={15}/> </>}
            </button>
          </div>
        )}

        {/* LOGIN — Email or Phone OTP */}
        {!success && step==='login_otp' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <button onClick={() => { setStep('role'); setError(''); }} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:12, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:5, padding:0, marginBottom:4 }}>
              <ArrowLeft size={13}/>← Back
            </button>

            {/* Email / Phone toggle */}
            <div style={{ display:'flex', background:'rgba(0,0,0,0.3)', borderRadius:10, padding:3, gap:3 }}>
              {[{k:'email',l:'Email',Icon:Mail},{k:'phone',l:'Phone',Icon:Smartphone}].map(t => (
                <button key={t.k} onClick={() => { setLoginMethod(t.k); setError(''); }}
                  style={{ flex:1, padding:'9px', borderRadius:8, border:'none', fontSize:13, fontWeight:600, fontFamily:'inherit', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:loginMethod===t.k?'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)':'transparent', color:loginMethod===t.k?'#fff':'rgba(255,255,255,0.3)' }}>
                  <t.Icon size={14}/>{t.l}
                </button>
              ))}
            </div>

            {loginMethod === 'email' ? (
              <div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:5 }}>Email Address</div>
                <div style={{ position:'relative' }}>
                  <Mail size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.2)', pointerEvents:'none' }}/>
                  <input className="input" type="email" placeholder="your@email.com" value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    onKeyDown={e => e.key==='Enter' && handleSendOTP()}
                    style={{ paddingLeft:36 }} autoFocus/>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:5 }}>Phone Number</div>
                <div style={{ display:'flex', gap:8 }}>
                  <div style={{ background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'11px 14px', fontSize:13, color:'rgba(255,255,255,0.6)', flexShrink:0 }}>+91</div>
                  <input className="input" type="tel" placeholder="10-digit mobile number" value={loginPhone}
                    onChange={e => setLoginPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                    onKeyDown={e => e.key==='Enter' && handleSendOTP()}
                    autoFocus/>
                </div>
              </div>
            )}

            <button
              onClick={handleSendOTP}
              disabled={loading || (loginMethod==='email' ? !loginEmail.includes('@') : loginPhone.length<10)}
              style={btnStyle(loginMethod==='email' ? !loginEmail.includes('@') : loginPhone.length<10)}>
              {loading ? 'Sending...' : <> Send OTP <ChevronRight size={15}/> </>}
            </button>
          </div>
        )}

        {/* OTP VERIFY */}
        {!success && step==='otp' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <button onClick={() => { setStep('login_otp'); setError(''); resetOtp(); }} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:12, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:5, padding:0, marginBottom:4 }}>
              <ArrowLeft size={13}/>← Back
            </button>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:16 }}>
                {DEMO_MODE ? '🔧 Demo: Enter any 6 digits' : `Enter the 6-digit code sent to ${otpTarget}`}
              </div>
              <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
                {otp.map((digit, i) => (
                  <input key={i} ref={el => otpRefs.current[i] = el} type="tel" maxLength={1} value={digit}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => { if(e.key==='Backspace' && !digit && i>0) otpRefs.current[i-1]?.focus(); }}
                    style={{ width:46, height:52, textAlign:'center', fontSize:22, fontWeight:700, background:'rgba(255,255,255,0.05)', border:`2px solid ${digit?'rgba(139,92,246,0.55)':'rgba(255,255,255,0.1)'}`, borderRadius:10, color:'#fff', outline:'none', caretColor:'transparent', fontFamily:'monospace' }}
                  />
                ))}
              </div>
            </div>
            <button onClick={handleVerifyOTP} disabled={otp.join('').length<6||loading} style={btnStyle(otp.join('').length<6)}>
              {loading ? 'Verifying...' : <> Verify OTP <ChevronRight size={15}/> </>}
            </button>
            <div style={{ textAlign:'center' }}>
              {resendTimer > 0 ? (
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>Resend in {resendTimer}s</span>
              ) : (
                <button onClick={() => { resetOtp(); handleSendOTP(); }} style={{ background:'none', border:'none', color:'rgba(167,139,250,0.7)', fontSize:12, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:4 }}>
                  <RefreshCw size={12}/> Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
        @media(max-width:800px) { .auth-left { display:none!important } }
        input::placeholder { color:rgba(255,255,255,0.16)!important }
      `}</style>
    </div>
  );
}
