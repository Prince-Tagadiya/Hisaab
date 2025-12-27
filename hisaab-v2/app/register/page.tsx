'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import { CheckCircle, ShieldCheck, ChevronDown, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function RegisterPage() {
  const { user, loading, getIdToken } = useAuth();
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Username Validity
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Pre-fill
  useEffect(() => {
    if (user) {
        // Split displayName
        const parts = (user.displayName || '').split(' ');
        if (parts.length > 0 && !firstName) setFirstName(parts[0]);
        if (parts.length > 1 && !lastName) setLastName(parts.slice(1).join(' '));
        
        // Suggest username from email if empty
        if (!username && user.email) {
            const suggestion = user.email.split('@')[0];
            setUsername(suggestion);
        }
    }
  }, [user]); // Run when user loads

  // Debounced Check
  useEffect(() => {
    const timer = setTimeout(async () => {
        if (username.length < 3) {
            setUsernameAvailable(null);
            return;
        }
        setCheckingUsername(true);
        try {
            const res = await fetch(`/api/users/check-username?username=${encodeURIComponent(username)}`);
            const data = await res.json();
            setUsernameAvailable(data.available);
        } catch (e) {
            console.error(e);
        } finally {
            setCheckingUsername(false);
        }
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async () => {
      if (!username || !firstName || !lastName || !agreed) return;
      if (usernameAvailable === false) return;

      setSubmitting(true);
      try {
          const token = await getIdToken();
          const res = await fetch('/api/users/profile', {
              method: 'PUT',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  username,
                  firstName,
                  lastName,
                  mobile
              })
          });
          
          if (!res.ok) throw new Error('Failed to update profile');
          
          // Redirect to dashboard
          router.push('/dashboard');
      } catch (e) {
          console.error(e);
          alert("Failed to complete registration. Please try again.");
      } finally {
          setSubmitting(false);
      }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8] dark:bg-[#101922]">Loading...</div>;
  if (!user) return null; // Should redirect to login by AuthContext eventually, or show nothing

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101922] font-sans text-[#0d141b] dark:text-slate-200 antialiased min-h-screen flex flex-col transition-colors">
        {/* Main Layout Container */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Logo Area */}
            <div className="mb-8 flex items-center gap-3">
                <div className="size-8 text-[#2b8cee]">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
                    </svg>
                </div>
                <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">Hisab</h2>
            </div>

            {/* Registration Card */}
            <div className="w-full max-w-[560px] bg-white dark:bg-[#1a2632] rounded-xl shadow-lg border border-[#e7edf3] dark:border-slate-700 overflow-hidden">
                {/* Header Section */}
                <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center">
                    {/* User Avatar from Google */}
                    <div className="relative mb-5">
                        <div className="size-20 rounded-full border-4 border-[#e7edf3] dark:border-slate-600 overflow-hidden relative">
                             {user.photoURL ? (
                                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                             ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-2xl">
                                    {firstName[0]}
                                </div>
                             )}
                        </div>
                        {/* Small Google Icon Badge */}
                        <div className="absolute bottom-0 right-0 bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-sm border border-[#e7edf3] dark:border-slate-600 flex items-center justify-center">
                            <svg className="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.2 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-[#0d141b] dark:text-white text-[28px] font-bold leading-tight tracking-tight">Complete your profile</h1>
                    <p className="text-[#4c739a] dark:text-slate-400 text-base font-normal mt-2 leading-normal max-w-sm mx-auto">
                        Welcome back, {firstName || 'Guest'}! One last step to get you started with Hisab.
                    </p>
                </div>

                {/* Form Section */}
                <div className="px-8 pb-10 pt-2 space-y-6">
                    {/* Username Input (Validated State) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#0d141b] dark:text-slate-200">Username</label>
                        <div className="relative flex items-center">
                            <input 
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                className={`w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border-2 ${usernameAvailable === false ? 'border-red-400 focus:border-red-500' : 'border-[#2b8cee]/50 dark:border-[#2b8cee]/50'} text-[#0d141b] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2b8cee]/20 focus:border-[#2b8cee] transition-all pr-12`}
                                placeholder="@username"
                            />
                            {/* Indicators */}
                            <div className="absolute right-4 flex items-center justify-center pointer-events-none">
                                {checkingUsername ? (
                                    <Loader2 className="animate-spin text-[#2b8cee]" size={20} />
                                ) : usernameAvailable === true ? (
                                    <CheckCircle className="text-[#2b8cee] fill-[#2b8cee] text-white" size={24} />
                                ) : usernameAvailable === false ? (
                                    <AlertCircle className="text-red-500" size={24} />
                                ) : null}
                            </div>
                        </div>
                        {/* Feedback Text */}
                        {usernameAvailable === true && (
                            <p className="text-sm text-[#2b8cee] font-medium flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">
                                <ShieldCheck size={18} />
                                Username is available
                            </p>
                        )}
                        {usernameAvailable === false && (
                            <p className="text-sm text-red-500 font-medium flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">
                                <AlertCircle size={18} />
                                Username is taken or invalid
                            </p>
                        )}
                    </div>

                    {/* First & Last Name Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#0d141b] dark:text-slate-200">First Name</label>
                            <input 
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-[#cfdbe7] dark:border-slate-600 text-[#0d141b] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2b8cee]/20 focus:border-[#2b8cee] transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#0d141b] dark:text-slate-200">Last Name</label>
                            <input 
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-[#cfdbe7] dark:border-slate-600 text-[#0d141b] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2b8cee]/20 focus:border-[#2b8cee] transition-all"
                            />
                        </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-2">
                        <label className="flex justify-between text-sm font-medium text-[#0d141b] dark:text-slate-200">
                            <span>Mobile Number</span>
                            <span className="text-slate-400 font-normal">Optional</span>
                        </label>
                        <div className="flex rounded-lg shadow-sm">
                            <div className="flex items-center justify-center px-3 rounded-l-lg border border-r-0 border-[#cfdbe7] dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 select-none">
                                <span className="text-sm font-medium flex items-center gap-1">
                                    US <ChevronDown size={16} />
                                </span>
                            </div>
                            <input 
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="flex-1 w-full h-12 px-4 rounded-r-lg bg-slate-50 dark:bg-slate-800 border border-[#cfdbe7] dark:border-slate-600 text-[#0d141b] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2b8cee]/20 focus:border-[#2b8cee] transition-all"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="flex items-start gap-3 pt-2">
                        <div className="flex items-center h-6">
                            <input 
                                id="terms" 
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-[#2b8cee] focus:ring-[#2b8cee]/20 cursor-pointer"
                            />
                        </div>
                        <label className="text-sm text-[#4c739a] dark:text-slate-400 leading-normal cursor-pointer select-none" htmlFor="terms">
                            I agree to the <a href="/terms" className="text-[#2b8cee] hover:text-[#2b8cee]/80 font-medium hover:underline" target="_blank">Terms & Conditions</a> and <a href="/privacy" className="text-[#2b8cee] hover:text-[#2b8cee]/80 font-medium hover:underline" target="_blank">Privacy Policy</a>.
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button 
                        onClick={handleSubmit}
                        disabled={!agreed || !firstName || !lastName || !username || usernameAvailable === false || submitting}
                        className={`w-full h-12 bg-[#2b8cee] hover:bg-[#2b8cee]/90 text-white text-base font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${(!agreed || !firstName || !lastName || !username || usernameAvailable === false) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                <span>Complete Registration</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Footer Links */}
            <div className="mt-8 flex gap-6 text-sm text-[#4c739a] dark:text-slate-500">
                <a href="#" className="hover:text-[#2b8cee] transition-colors">Help Center</a>
                <a href="#" className="hover:text-[#2b8cee] transition-colors">Contact Support</a>
            </div>
        </div>
    </div>
  );
}
