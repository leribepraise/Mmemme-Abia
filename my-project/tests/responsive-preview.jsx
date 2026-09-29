// Local component preview only: no login, API, real account or payment actions.
// Open /tests/responsive-preview.html in Vite; excluded from the production entry.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../src/index.css';
import '../src/theme.css';
import { ThemeProvider } from '../src/components/context/ThemeContext';
import ThemeToggle from '../src/components/ThemeToggle';
import VerificationScreen from '../src/components/auth/VerificationScreen';
import ProfileSidebar from '../src/components/profile/ProfileSidebar';
import MobileBottomNav from '../src/components/layout/MobileBottomNav';

function Preview() {
  const [view,setView] = useState('otp');
  const [notice,setNotice] = useState('');
  return <><header className="relative z-50 flex h-[88px] items-center gap-2 bg-card px-3"><button type="button" onClick={()=>setView('otp')} className="border p-2">OTP preview</button><button type="button" onClick={()=>setView('sidebar')} className="border p-2">Sidebar preview</button><ThemeToggle compact/></header>
    {view === 'otp' ? <VerificationScreen email={'a-very-long-email-address-for-mobile-layout-checking@example.test'} onVerify={()=>setNotice('Preview code accepted')} onResend={()=>{}} onBack={()=>setNotice('Preview back button')}/>
    : <><ProfileSidebar user={{fullName:'Layout preview'}} activeSection="Dashboard" mobileMenuOpen onMenuClick={setNotice} onLogout={()=>setNotice('Logout button reached')}/><MobileBottomNav/></>}
    <output className="fixed right-2 top-24 z-50 max-w-44 rounded bg-card p-2 text-xs" aria-live="polite">{notice}</output>
  </>;
}
createRoot(document.getElementById('root')).render(<BrowserRouter><ThemeProvider><Preview/></ThemeProvider></BrowserRouter>);
