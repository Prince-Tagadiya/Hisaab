import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function TermsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['introduction', 'definitions', 'registration', 'conduct', 'payment', 'privacy'];
      const scrollPosition = window.scrollY + 150; // Offset for header

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#f6f7f8] text-slate-900 font-display min-h-screen flex flex-col antialiased selection:bg-[#2b8cee]/20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-lg bg-[#2b8cee]/10 text-[#2b8cee]">
                <span className="material-symbols-outlined text-[24px]">receipt_long</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Hisaab</span>
            </Link>
            {/* Action Button */}
            <Link 
              to="/"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#2b8cee] hover:bg-[#2b8cee]/90 transition-colors text-white text-sm font-bold shadow-sm ring-offset-2 focus:ring-2 focus:ring-[#2b8cee]/50"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar / Table of Contents (Sticky on Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div className="space-y-4">
                <div className="px-3">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Contents</h3>
                </div>
                <nav className="flex flex-col space-y-1">
                  <a 
                    href="#introduction"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === 'introduction' ? 'bg-[#2b8cee]/10 text-[#2b8cee] font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span className={`material-symbols-outlined text-[20px] ${activeSection === 'introduction' ? 'fill-1' : ''}`}>info</span>
                    <span className="text-sm">Introduction</span>
                  </a>
                  
                  <a 
                    href="#definitions"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === 'definitions' ? 'bg-[#2b8cee]/10 text-[#2b8cee] font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">menu_book</span>
                    <span className="text-sm">Definitions</span>
                  </a>

                  <a 
                    href="#registration"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === 'registration' ? 'bg-[#2b8cee]/10 text-[#2b8cee] font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                    <span className="text-sm">Account & Registration</span>
                  </a>

                  <a 
                    href="#conduct"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === 'conduct' ? 'bg-[#2b8cee]/10 text-[#2b8cee] font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">gavel</span>
                    <span className="text-sm">User Conduct</span>
                  </a>

                  <a 
                    href="#payment"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === 'payment' ? 'bg-[#2b8cee]/10 text-[#2b8cee] font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                    <span className="text-sm">Payment Terms</span>
                  </a>

                  <a 
                    href="#privacy"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === 'privacy' ? 'bg-[#2b8cee]/10 text-[#2b8cee] font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">shield</span>
                    <span className="text-sm">Data Privacy</span>
                  </a>
                </nav>
              </div>
              
              {/* Small Help Box */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
                <p className="text-xs font-medium text-slate-500 mb-2">Have a question?</p>
                <a className="text-sm font-bold text-[#2b8cee] hover:underline" href="mailto:support@hisaab.app">Contact Support →</a>
              </div>
            </div>
          </aside>

          {/* Document Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 lg:p-16 max-w-4xl">
              {/* Page Heading */}
              <div className="border-b border-slate-100 pb-8 mb-10">
                <div className="flex flex-col gap-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#2b8cee]/10 text-[#2b8cee] w-fit">
                    Legal
                  </span>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Terms of Service</h1>
                  <p className="text-slate-500 text-base font-medium">Last updated: <span className="text-slate-900">October 24, 2023</span></p>
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-12">
                {/* Introduction */}
                <section className="scroll-mt-28" id="introduction">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    1. Introduction
                  </h2>
                  <div className="prose prose-slate text-slate-600 leading-relaxed text-lg">
                    <p>
                      Welcome to Hisaab ("Company", "we", "our", "us"). These Terms & Conditions govern your use of our shared expenses application available at hisaab.app. By accessing or using Hisaab, you agree to be bound by these Terms.
                    </p>
                    <p className="mt-4">
                      If you disagree with any part of the terms, then you may not access the Service. We reserve the right to modify these terms at any time, and we will provide notice of these changes as described below.
                    </p>
                  </div>
                </section>

                {/* Definitions */}
                <section className="scroll-mt-28" id="definitions">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    2. Definitions
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[#2b8cee]">person</span>
                        <h3 className="font-bold text-slate-900">User</h3>
                      </div>
                      <p className="text-sm text-slate-600">Any individual who registers for an account to use the Service.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[#2b8cee]">receipt_long</span>
                        <h3 className="font-bold text-slate-900">Expense</h3>
                      </div>
                      <p className="text-sm text-slate-600">A financial record created by a User intended to be split.</p>
                    </div>
                  </div>
                </section>

                {/* Account Registration */}
                <section className="scroll-mt-28" id="registration">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    3. Account Registration
                  </h2>
                  <div className="text-slate-600 leading-relaxed text-base space-y-4">
                    <p>
                      To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process.
                    </p>
                    <ul className="list-disc pl-5 mt-4 space-y-2 text-slate-600">
                      <li>You must be at least 18 years old to use the Service.</li>
                      <li>You are responsible for safeguarding your password.</li>
                      <li>You agree not to disclose your password to any third party.</li>
                    </ul>
                  </div>
                </section>

                {/* User Conduct */}
                <section className="scroll-mt-28" id="conduct">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    4. User Conduct
                  </h2>
                  <div className="text-slate-600 leading-relaxed text-base space-y-4">
                    <p>
                      You agree not to engage in any of the following prohibited activities:
                    </p>
                    <div className="space-y-3 mt-4">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0">block</span>
                        <p>Using the Service for any illegal purpose or in violation of any local, state, national, or international law.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0">block</span>
                        <p>Violating, or encouraging others to violate, any right of a third party, including by infringing or misappropriating any third-party intellectual property right.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0">block</span>
                        <p>Interfering with security-related features of the Service.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Payment Terms */}
                <section className="scroll-mt-28" id="payment">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    5. Payment Terms
                  </h2>
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100/50">
                    <p className="text-blue-900 font-bold mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">info</span> Important Notice
                    </p>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      Hisaab acts solely as a record-keeping tool. We do not hold funds, process transactions directly, or enforce debt collection. Any financial settlement is the sole responsibility of the Users involved. Hisaab assumes no liability for unpaid debts between Users.
                    </p>
                  </div>
                </section>

                {/* Data Privacy */}
                <section className="scroll-mt-28" id="privacy">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    6. Data Privacy
                  </h2>
                  <div className="text-slate-600 leading-relaxed text-base space-y-4">
                    <p>
                      Your privacy is important to us. Please review our <Link className="text-[#2b8cee] hover:underline font-bold" to="/privacy">Privacy Policy</Link> to understand how we collect, use, and share information about you.
                    </p>
                    <p>
                      By using the Service, you consent to the collection and use of your information as outlined in our Privacy Policy.
                    </p>
                  </div>
                </section>

                {/* Action Footer (Terms Specific) */}
                <div className="bg-slate-50 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100 mt-12">
                  <div className="flex items-start gap-3 w-full md:w-auto">
                    <label className="relative flex items-center p-0.5 rounded-full cursor-pointer group">
                      <input className="peer appearance-none h-6 w-6 rounded border-2 border-slate-300 bg-white checked:bg-[#2b8cee] checked:border-[#2b8cee] transition-all cursor-pointer" type="checkbox"/>
                      <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-sm opacity-0 peer-checked:opacity-100 pointer-events-none font-bold">check</span>
                    </label>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">I agree to the Terms & Conditions</span>
                      <span className="text-xs text-slate-500">You must accept the terms to continue.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                    onClick={() => navigate("/")}
                    className="flex-1 md:flex-none h-10 px-6 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">
                      Decline
                    </button>
                    <button 
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 md:flex-none h-10 px-8 rounded-lg bg-[#2b8cee] text-white font-bold text-sm shadow-lg shadow-[#2b8cee]/30 hover:bg-[#2b8cee]/90 transition-all transform active:scale-95">
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">
              © 2023 Hisaab Inc. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm font-medium">
              <Link className="text-slate-600 hover:text-[#2b8cee] transition-colors" to="/privacy">Privacy Policy</Link>
              <Link className="text-slate-600 hover:text-[#2b8cee] transition-colors" to="#">Contact Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
