'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Receipt, 
  ArrowLeft, 
  Info, 
  Database, 
  Settings, 
  Shield, 
  Gavel, 
  Mail, 
  User, 
  Monitor, 
  Lock 
} from 'lucide-react';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['introduction', 'collection', 'usage', 'security', 'rights', 'contact'];
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
    <div className="bg-[#f6f7f8] text-slate-900 font-sans min-h-screen flex flex-col antialiased selection:bg-[#2b8cee]/20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#2b8cee]/10 text-[#2b8cee]">
                <Receipt size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Hisaab</span>
            </Link>
            {/* Action Button */}
            <Link href="/" className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#2b8cee] hover:bg-[#2b8cee]/90 transition-colors text-white text-sm font-bold shadow-sm ring-offset-2 focus:ring-2 focus:ring-[#2b8cee]/50">
              <ArrowLeft size={18} />
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
                    <Info size={20} className={activeSection === 'introduction' ? 'fill-current' : ''} />
                    <span className="text-sm">Introduction</span>
                  </a>
                  
                  <a 
                    href="#collection"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === 'collection' ? 'bg-[#2b8cee]/10 text-[#2b8cee] font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <Database size={20} />
                    <span className="text-sm">Data Collection</span>
                  </a>
                  
                  <a 
                    href="#usage"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === 'usage' ? 'bg-[#2b8cee]/10 text-[#2b8cee] font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <Settings size={20} />
                    <span className="text-sm">How We Use Data</span>
                  </a>
                  
                  <a 
                    href="#security"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === 'security' ? 'bg-[#2b8cee]/10 text-[#2b8cee] font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <Shield size={20} />
                    <span className="text-sm">Data Security</span>
                  </a>
                  
                  <a 
                    href="#rights"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === 'rights' ? 'bg-[#2b8cee]/10 text-[#2b8cee] font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <Gavel size={20} />
                    <span className="text-sm">User Rights</span>
                  </a>
                  
                  <a 
                    href="#contact"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === 'contact' ? 'bg-[#2b8cee]/10 text-[#2b8cee] font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <Mail size={20} />
                    <span className="text-sm">Contact Us</span>
                  </a>
                </nav>
              </div>
              {/* Small Help Box */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
                <p className="text-xs font-medium text-slate-500 mb-2">Need immediate help?</p>
                <a className="text-sm font-bold text-[#2b8cee] hover:underline" href="#">Visit Support Center →</a>
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
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Privacy Policy</h1>
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
                      At Hisaab, we prioritize the trust and privacy of our users above all else. This Privacy Policy document outlines the types of personal information we receive and collect when you use Hisaab to manage your shared expenses, as well as some of the steps we take to safeguard your information.
                    </p>
                    <p className="mt-4">
                      By using Hisaab, you agree to the collection and use of information in accordance with this policy. We will not use or share your information with anyone except as described in this Privacy Policy.
                    </p>
                  </div>
                </section>

                {/* Information We Collect */}
                <section className="scroll-mt-28" id="collection">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    2. Information We Collect
                  </h2>
                  <div className="text-slate-600 leading-relaxed">
                    <p className="mb-4">
                      We collect several different types of information for various purposes to provide and improve our Service to you.
                    </p>
                    <ul className="space-y-4 mt-6">
                      <li className="flex gap-4">
                        <div className="flex-shrink-0 size-6 rounded-full bg-slate-100 flex items-center justify-center text-[#2b8cee] mt-0.5">
                          <User size={16} />
                        </div>
                        <div>
                          <strong className="block text-slate-900 font-semibold">Personal Data</strong>
                          <span>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you, such as your email address and name.</span>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <div className="flex-shrink-0 size-6 rounded-full bg-slate-100 flex items-center justify-center text-[#2b8cee] mt-0.5">
                          <Receipt size={16} />
                        </div>
                        <div>
                          <strong className="block text-slate-900 font-semibold">Transaction Data</strong>
                          <span>We collect details of transactions you upload to the app, including amounts, dates, descriptions, and the participants involved in each expense.</span>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <div className="flex-shrink-0 size-6 rounded-full bg-slate-100 flex items-center justify-center text-[#2b8cee] mt-0.5">
                          <Monitor size={16} />
                        </div>
                        <div>
                          <strong className="block text-slate-900 font-semibold">Usage Data</strong>
                          <span>We may also collect information on how the Service is accessed and used ("Usage Data"). This may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, and version.</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* How We Use Data */}
                <section className="scroll-mt-28" id="usage">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    3. How We Use Data
                  </h2>
                  <div className="text-slate-600 leading-relaxed space-y-4">
                    <p>
                      Hisaab uses the collected data for various purposes:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="block text-sm font-bold text-slate-900 mb-1">To provide service</span>
                        <span className="text-sm">To maintain our Service and calculate expense splits accurately.</span>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="block text-sm font-bold text-slate-900 mb-1">To notify you</span>
                        <span className="text-sm">To notify you about changes to our Service or new expenses added to your groups.</span>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="block text-sm font-bold text-slate-900 mb-1">To support you</span>
                        <span className="text-sm">To provide customer care and support when you encounter issues.</span>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="block text-sm font-bold text-slate-900 mb-1">To improve Hisaab</span>
                        <span className="text-sm">To provide analysis or valuable information so that we can improve the Service.</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Data Security */}
                <section className="scroll-mt-28" id="security">
                  <div className="flex items-start gap-4 p-6 bg-[#2b8cee]/5 border border-[#2b8cee]/20 rounded-xl">
                    <div className="flex-shrink-0 text-[#2b8cee]">
                       <Lock size={32} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-2">4. Data Security</h2>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, including encryption at rest and in transit, we cannot guarantee its absolute security.
                      </p>
                    </div>
                  </div>
                </section>

                {/* User Rights */}
                <section className="scroll-mt-28" id="rights">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    5. Your Data Rights
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Hisaab aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    If you wish to be informed what Personal Data we hold about you or if you want it to be removed from our systems, please contact us. You have the right:
                  </p>
                  <ul className="list-disc pl-5 mt-4 space-y-2 text-slate-600">
                    <li>To access and receive a copy of the Personal Data we hold about you.</li>
                    <li>To rectify any Personal Data held about you that is inaccurate.</li>
                    <li>To request the deletion of Personal Data held about you.</li>
                  </ul>
                </section>

                {/* Contact Us */}
                <section className="scroll-mt-28 pt-8 border-t border-slate-100" id="contact">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    6. Contact Us
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    If you have any questions about this Privacy Policy, please contact us by email:
                  </p>
                  <a className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors" href="mailto:privacy@hisab.app">
                    <Mail size={20} />
                    privacy@hisab.app
                  </a>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">
              © 2023 Hisaab Inc. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm font-medium">
              <Link className="text-slate-600 hover:text-[#2b8cee] transition-colors" href="/terms">Terms of Service</Link>
              <Link className="text-slate-600 hover:text-[#2b8cee] transition-colors" href="/cookies">Cookies</Link>
              <Link className="text-slate-600 hover:text-[#2b8cee] transition-colors" href="/support">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
