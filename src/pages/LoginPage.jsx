import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState('login');

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      alert("Failed to login. Please try again.");
    }
  };

  return (
    <div className="font-display bg-[#f6f7f8] text-slate-900 min-h-screen flex flex-col antialiased overflow-hidden relative selection:bg-[#2b8cee]/20">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Abstract gradient blob top right */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#2b8cee]/5 blur-3xl opacity-60"></div>
        {/* Abstract gradient blob bottom left */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-3xl opacity-60"></div>
      </div>

      {/* Main Navigation (Simplified for Login) */}
      <header className="relative z-10 w-full px-8 py-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#2b8cee] text-white shadow-lg shadow-[#2b8cee]/30">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Hisaab</h2>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 w-full max-w-7xl mx-auto h-[calc(100vh-88px)] min-h-[600px]">
        <div className="grid lg:grid-cols-2 gap-12 w-full max-w-5xl items-center">
          {/* Left Column: Value Prop (Desktop only) */}
          <div className="hidden lg:flex flex-col gap-8 pr-12">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-[1.15] text-slate-900 tracking-tight">
                The easiest way to <span className="text-[#2b8cee]">split expenses</span> with friends.
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-md">
                Track bills, settle debts, and manage shared finances without the awkward conversations. Simple, transparent, and fair.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <span className="material-symbols-outlined text-[#2b8cee] text-3xl mb-1">group</span>
                <h3 className="font-semibold text-slate-900">Group Tracking</h3>
                <p className="text-sm text-slate-500">Perfect for roommates & trips.</p>
              </div>
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <span className="material-symbols-outlined text-[#2b8cee] text-3xl mb-1">sync_alt</span>
                <h3 className="font-semibold text-slate-900">Instant Sync</h3>
                <p className="text-sm text-slate-500">Real-time updates for everyone.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 text-sm text-slate-400 font-medium">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-[#f6f7f8] object-cover bg-slate-200" alt="Smiling user" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAm_2Nrz3FrHFqpHjattikMr3GaFMu_SX6sHMXBpsWd0cbsR2xMNVkavVY787rCDajAgJULyppKSEaHcj7G6_Pa5K7z6CP4A3BCY6Q7E9hNRnnyWyJCvWPI7MtX6T9cD6-NRSg9m0Fl03sednFngixSTG-EYnKLIpyaAQAATwt70MkXrQL1bzy8YWrJb2rgWEvZO5vzo1oZcBC9m3UIvRki9lbnMoz-F1Vq1Lo21T0V6WL1U6k-ZT40I9n5ZwDK9AXW6V4iZnajDg"/>
                <img className="w-10 h-10 rounded-full border-2 border-[#f6f7f8] object-cover bg-slate-200" alt="Serious user" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8UAhkOQmb9j2XLSw0izwl2Eybdu9rMwvcC8xHlFAAxMYj0iBhxzklrvTvASXYXRIBGZAwrWIyO5AQpsnaznSAxiF_LwW5wdXGW31JY6Xcx6DvJkSF0goqBy9e-aj19sKvL6sBdEVwRY6asevgMmlGTiPCYEYRwNjqW-CCjJEmU5YE-914X0soDXZGHjPqSBiv915zcfMo70n9qV2xDAsMCloy8UZKhFJPLSWHCdXQZ0yx3S0xz4SieseJRxNiieKPVVSraeuuNsA"/>
                <img className="w-10 h-10 rounded-full border-2 border-[#f6f7f8] object-cover bg-slate-200" alt="Happy user" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9GEUn5UJKVIS0pxOrYBou7YC2bR8SxeQXj-1OdI5cYdbQjohFXK3DiymOc7IffrDCNspFpGJbVSaVuTdLE2ZUdcRTpJQc8va3f01YGt3A5r-QFtIMbtGBQMgAnQ7_slnVFyI01u5N6qzU3xE7dwdRhLVCe3nrDDtUYqtCkBw9J10UbivXFITZGeqapru3vq-9FcBdFByYwKoAueVa9SKTq2S8C-1p5IlRVx9lO7JIUJQwyntIyFtozH43V3aq6reywRWJbjHcGHI"/>
                <div className="w-10 h-10 rounded-full border-2 border-[#f6f7f8] bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">+2k</div>
              </div>
              <span>Trusted by thousands</span>
            </div>
          </div>

          {/* Right Column: Auth Card */}
          <div className="w-full flex justify-center lg:justify-end">
             <AuthCard 
                view={view} 
                setView={setView} 
                handleLogin={handleLogin} 
              />
          </div>
        </div>
      </main>

      {/* Simple Footer for legal/copyright */}
      <footer className="relative z-10 w-full py-6 text-center">
        <p className="text-xs text-slate-400">© 2023 Hisaab Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';

function AuthCard({ view, setView, handleLogin }) {
  return (
    <div className="w-full flex justify-center lg:justify-end">
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-[420px] bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group/card z-10"
      >
        {/* Decorative top gradient on card */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#2b8cee]/60 via-[#2b8cee] to-[#2b8cee]/60 z-20"></div>

        <AnimatePresence mode="wait" initial={false}>
          {view === 'login' && (
            <LoginView key="login" setView={setView} handleLogin={handleLogin} />
          )}
          {view === 'help' && (
            <HelpView key="help" setView={setView} />
          )}
          {view === 'troubleshooting' && (
            <TroubleshootingView key="troubleshooting" setView={setView} handleLogin={handleLogin} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function LoginView({ setView, handleLogin }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="p-8 sm:p-10"
    >
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-[#2b8cee]/10 flex items-center justify-center text-[#2b8cee] mb-4">
          <span className="material-symbols-outlined text-[28px]">lock</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Hisaab</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-[280px]">
          Sign in to track shared expenses and settle up effortlessly.
        </p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={handleLogin}
          className="relative w-full flex items-center justify-center gap-3 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl h-12 px-6 transition-all duration-200 shadow-sm hover:shadow group/btn"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          <span className="font-medium tracking-wide">Continue with Google</span>
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase font-medium">Secured by Google</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <div className="text-center pt-2">
          <button onClick={() => setView('help')} className="text-sm font-medium text-[#2b8cee] hover:text-[#2b8cee]/80 transition-colors">
            Need help signing in?
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400 leading-relaxed px-4">
          By continuing, you agree to Hisaab's 
          <Link className="text-slate-600 hover:text-[#2b8cee] underline decoration-slate-300 underline-offset-2 ml-1" to="/terms">Terms of Service</Link> 
          and acknowledge our 
          <Link className="text-slate-600 hover:text-[#2b8cee] underline decoration-slate-300 underline-offset-2 ml-1" to="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </motion.div>
  );
}

function HelpView({ setView }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="p-8 sm:p-10"
    >
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-[#2b8cee]/10 flex items-center justify-center text-[#2b8cee] mb-4">
          <span className="material-symbols-outlined text-[28px]">contact_support</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Trouble signing in?</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-[280px]">
           Select an issue below to get help accessing your account.
        </p>
      </div>
      <div className="space-y-3">
        <button 
          onClick={() => setView('troubleshooting')}
          className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-[#2b8cee] hover:bg-slate-50 transition-all duration-200 group/item text-left shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover/item:text-[#2b8cee] group-hover/item:bg-[#2b8cee]/5 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900 text-sm">Trouble with Google Sign-In?</span>
              <span className="text-xs text-slate-500">Account recovery steps</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover/item:text-[#2b8cee] text-[20px] transition-colors">arrow_forward</span>
        </button>
        
        <a href="mailto:princetagadiya11@gmail.com" className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-[#2b8cee] hover:bg-slate-50 transition-all duration-200 group/item text-left shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover/item:text-[#2b8cee] group-hover/item:bg-[#2b8cee]/5 transition-colors">
              <span className="material-symbols-outlined text-[22px]">support_agent</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900 text-sm">Contact support</span>
              <span className="text-xs text-slate-500">Chat with our team</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover/item:text-[#2b8cee] text-[20px] transition-colors">arrow_forward</span>
        </a>
      </div>
      <div className="my-6 border-t border-slate-100"></div>
      <div className="text-center">
        <button onClick={() => setView('login')} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#2b8cee] transition-colors group/link">
          <span className="material-symbols-outlined text-[18px] group-hover/link:-translate-x-0.5 transition-transform">arrow_back</span>
          Back to Sign In
        </button>
      </div>
    </motion.div>
  );
}

function TroubleshootingView({ setView, handleLogin }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="p-8 sm:p-10"
    >
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 mb-4">
          <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Google Sign-In Help</h2>
        <p className="text-slate-500 text-sm leading-relaxed">
           Common reasons why you might be having trouble signing in with Google.
        </p>
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="material-symbols-outlined text-amber-500 mt-0.5 shrink-0">warning</span>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-900">Browser Blocking Pop-ups</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Ensure your browser isn't blocking the Google sign-in pop-up window. Check the address bar for a blocked pop-up icon.</p>
          </div>
        </div>
        <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="material-symbols-outlined text-amber-500 mt-0.5 shrink-0">cookie</span>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-900">Third-party Cookies</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Some browsers block third-party cookies needed for authentication. Try allowing them for <span className="font-mono bg-slate-200 px-1 rounded">accounts.google.com</span>.</p>
          </div>
        </div>
        <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="material-symbols-outlined text-amber-500 mt-0.5 shrink-0">history</span>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-900">Cached Data Conflict</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Old session data might be causing conflicts. Try clearing your browser cache or opening Hisaab in an Incognito window.</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <button onClick={handleLogin} className="w-full py-2.5 px-4 bg-[#2b8cee] text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-[#2b8cee]/25">
           Retry Google Sign-In
        </button>
        <a className="block w-full text-center py-2.5 px-4 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors" href="mailto:princetagadiya11@gmail.com">
           Contact Support
        </a>
      </div>
      <div className="mt-6 text-center">
        <button onClick={() => setView('login')} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#2b8cee] transition-colors group/link">
          <span className="material-symbols-outlined text-[18px] group-hover/link:-translate-x-0.5 transition-transform">arrow_back</span>
           Back to Sign In
        </button>
      </div>
    </motion.div>
  );
}

