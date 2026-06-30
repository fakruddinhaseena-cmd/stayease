import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [phase, setPhase] = useState('intro'); // intro | landing | auth | app
  const [authMode, setAuthMode] = useState('login'); // login | register
  const [user, setUser] = useState(null);
  const [notifications] = useState([
    { id:1, msg:'Rent due in 3 days', type:'warning', read:false },
    { id:2, msg:'Service request updated', type:'info', read:false },
    { id:3, msg:'New announcement', type:'info', read:true },
  ]);

  const goToLanding = () => setPhase('landing');
  const goToAuth = (mode='login') => { setAuthMode(mode); setPhase('auth'); };
  const goToLandingFromAuth = () => setPhase('landing');

  // ── After register → go to login page (not dashboard)
  const afterRegister = () => {
    setAuthMode('login');
    setPhase('auth');
  };

  // ── After OTP/login verified → go to dashboard with real user data
  const login = (role, userData) => {
    if (userData) {
      setUser(userData);
    } else {
      // fallback demo only
      const profiles = {
        tenant: { id:'t1', name:'Demo Tenant', email:'tenant@demo.com', role:'tenant' },
        owner:  { id:'o1', name:'Demo Owner',  email:'owner@demo.com',  role:'owner' },
        admin:  { id:'a1', name:'Super Admin', email:'admin@demo.com',  role:'admin' },
      };
      setUser(profiles[role]);
    }
    setPhase('app');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stayease_token');
    setPhase('landing');
  };

  return (
    <AppContext.Provider value={{
      phase, authMode, user,
      goToLanding, goToAuth, goToLandingFromAuth,
      login, afterRegister, logout, notifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
