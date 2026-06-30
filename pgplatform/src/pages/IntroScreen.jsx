import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

export default function IntroScreen() {
  const { goToLanding } = useApp();
  const canvasRef = useRef(null);
  const [step, setStep] = useState(0);
  // 0=black, 1=stars appear, 2=name drop, 3=tagline, 4=button, 5=exit

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 1400);
    const t3 = setTimeout(() => setStep(3), 2600);
    const t4 = setTimeout(() => setStep(4), 3500);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, stars = [], particles = [], animId;
    let frame = 0;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      stars = Array.from({ length: 400 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.6 + 0.2,
        a: Math.random() * 0.8 + 0.1,
        tw: Math.random() * Math.PI * 2,
        tws: Math.random() * 0.02 + 0.005,
        sp: Math.random() * 0.08 + 0.02,
      }));
      // shooting particles
      particles = Array.from({ length: 6 }, (_, i) => ({
        x: Math.random() * W * 0.5 + W * 0.1,
        y: Math.random() * H * 0.4,
        len: Math.random() * 120 + 60,
        sp: Math.random() * 8 + 4,
        a: Math.random() * 0.7 + 0.3,
        delay: i * 80,
        active: false, progress: 0,
      }));
    }

    function draw() {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // Deep space bg
      const bg = ctx.createRadialGradient(W/2, H*0.4, 0, W/2, H*0.6, Math.max(W,H));
      bg.addColorStop(0, '#150040');
      bg.addColorStop(0.4, '#08001f');
      bg.addColorStop(1, '#04020f');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Nebula
      [[W*0.3,H*0.4,300,200,'rgba(100,20,200,0.1)'],[W*0.7,H*0.6,220,160,'rgba(200,0,100,0.07)'],[W*0.5,H*0.2,400,150,'rgba(50,0,180,0.08)']].forEach(([nx,ny,rx,ry,c]) => {
        ctx.save();
        ctx.translate(nx + Math.sin(frame*0.002)*25, ny + Math.cos(frame*0.0015)*18);
        const rg = ctx.createRadialGradient(0,0,0,0,0,rx);
        rg.addColorStop(0, c); rg.addColorStop(1, 'transparent');
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2); ctx.fill();
        ctx.restore();
      });

      // Stars
      if (step >= 1) {
        stars.forEach(s => {
          s.tw += s.tws;
          const al = s.a * (0.5 + 0.5 * Math.sin(s.tw));
          const px = (s.x + frame * s.sp * 0.3 + W) % W;
          const py = (s.y + Math.sin(frame * s.sp * 0.05) * 0.5 + H) % H;
          ctx.beginPath(); ctx.arc(px, py, s.r, 0, Math.PI*2);
          ctx.fillStyle = `rgba(255,255,255,${al})`; ctx.fill();
          if (s.r > 1.2) {
            ctx.strokeStyle = `rgba(200,150,255,${al*0.3})`; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(px-5,py); ctx.lineTo(px+5,py); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(px,py-5); ctx.lineTo(px,py+5); ctx.stroke();
          }
        });
      }

      // Shooting stars
      particles.forEach((p, i) => {
        if (frame > p.delay / 16 + 60) {
          p.progress = Math.min(1, p.progress + 0.03);
          const px = p.x + p.progress * p.len * 2;
          const py = p.y + p.progress * p.len * 0.5;
          const grad = ctx.createLinearGradient(px - p.len, py - p.len*0.25, px, py);
          grad.addColorStop(0, 'transparent');
          grad.addColorStop(1, `rgba(200,150,255,${p.a * (1 - p.progress)})`);
          ctx.strokeStyle = grad; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(px - p.len, py - p.len*0.25); ctx.lineTo(px, py); ctx.stroke();
          if (p.progress >= 1) { p.progress = 0; p.x = Math.random()*W*0.5+W*0.1; p.y = Math.random()*H*0.4; }
        }
      });

      animId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize(); draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [step]);

  const handleEnter = () => {
    setStep(5);
    setTimeout(goToLanding, 600);
  };

  return (
    <div style={{ position:'fixed', inset:0, overflow:'hidden', background:'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80) center/cover no-repeat #04020f' }}>
      {/* Property image dark overlay */}
      <div style={{ position:'absolute', inset:0, background:'rgba(4,2,15,0.72)', zIndex:0 }}/>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, zIndex:1 }} />

      {/* Content overlay */}
      <div style={{
        position:'absolute', inset:0, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', gap:0,
        transition:'opacity 0.6s', opacity: step === 5 ? 0 : 1,
      }}>
        {/* Orbit rings behind logo */}
        {step >= 1 && (
          <div style={{ position:'absolute', width:320, height:320, animation:'spinSlow 12s linear infinite' }}>
            {[130,105,80].map((r,i) => (
              <div key={i} style={{
                position:'absolute', inset:`${(320-r*2)/2}px`,
                borderRadius:'50%', border:`1px dashed rgba(168,85,247,${0.2+i*0.1})`,
                animation:`spinSlow ${8+i*4}s linear infinite ${i%2===0?'':'reverse'}`,
              }} />
            ))}
            <div style={{
              position:'absolute', inset:'110px', borderRadius:'50%',
              background:'radial-gradient(circle, rgba(120,40,220,0.3) 0%, transparent 70%)',
              animation:'pulseBig 3s ease-in-out infinite',
            }} />
          </div>
        )}

        {/* Logo name */}
        <div style={{
          fontFamily:"'Orbitron', monospace",
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: 900,
          letterSpacing: '0.15em',
          textAlign: 'center',
          transform: step >= 2 ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.8)',
          opacity: step >= 2 ? 1 : 0,
          transition: 'all 1.2s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative', zIndex: 2,
          background: 'linear-gradient(135deg, #c084fc 0%, #e879f9 40%, #fb7185 80%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: step >= 2 ? 'drop-shadow(0 0 40px rgba(168,85,247,0.8))' : 'none',
        }}>
          STAYEASE
        </div>

        {/* Tagline */}
        <div style={{
          marginTop: 20,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(13px, 2vw, 16px)',
          fontWeight: 400,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'rgba(200,160,255,0.7)',
          opacity: step >= 3 ? 1 : 0,
          transform: step >= 3 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease',
          position: 'relative', zIndex: 2,
        }}>
          Next-Gen PG & Co-Living Platform
        </div>

        {/* Divider line */}
        <div style={{
          marginTop: 32,
          width: step >= 3 ? 200 : 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.8), transparent)',
          transition: 'width 1s ease 0.3s',
          position: 'relative', zIndex: 2,
        }} />

        {/* Enter button */}
        <button
          onClick={handleEnter}
          style={{
            marginTop: 40,
            opacity: step >= 4 ? 1 : 0,
            transform: step >= 4 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease',
            position: 'relative', zIndex: 2,
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            border: 'none',
            color: '#fff',
            padding: '14px 48px',
            borderRadius: 50,
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 0 40px rgba(168,85,247,0.5), 0 0 80px rgba(168,85,247,0.2)',
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        >
          Enter Platform →
        </button>

        {/* Bottom flicker text */}
        {step >= 4 && (
          <div style={{ marginTop: 16, fontSize: 10, color: 'rgba(168,85,247,0.4)', letterSpacing: '0.3em', fontFamily:"'Orbitron',monospace" }}>
            BANGALORE · HYDERABAD · PUNE · MUMBAI
          </div>
        )}
      </div>

      <style>{`
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulseBig { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.15);opacity:1} }
      `}</style>
    </div>
  );
}
