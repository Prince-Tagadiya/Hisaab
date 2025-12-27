'use client';

import Link from 'next/link';
import { Flag, Menu } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-screen bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white font-sans transition-colors duration-200">
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
             
             {/* Header Mockup */}
             <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 lg:px-10 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2632]">
                <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                    <button className="flex items-center justify-center p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors md:hidden">
                         <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="size-8 flex items-center justify-center">
                             <img src="/icons/icon-192.png" alt="Hisab" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Hisab</h2>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                         <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn-9JIbglkiz6mYUOkI65E5jj2NrjnifOl904TecdFFouuHDSbjGEN4wFGYiiOaEfThCFNdF3gCfWjYgxIsT28Noht8Bv4WrSilUbpPXEkjjNAad-fQtQSWMeVqJBjAim3sfv8uz4q8VneWBlAs4zpmHZWYuRqGMN0EQmjTKUBYJ_8XmM7NtACMeyudB34m-bhTBvAc-hfw4gD35j7LdbvCfHQivmxMXk6b0h0117G1TMWorrrhpWf7DPKKCB1qOg4UuS3zFYmEps" className="w-full h-full object-cover" alt="Avatar" />
                    </div>
                </div>
             </header>

            <div className="flex flex-col max-w-[600px] w-full items-center gap-8 mt-16 animate-in fade-in zoom-in duration-500">
                {/* Illustration Area */}
                <div className="w-full max-w-[320px] aspect-square relative flex items-center justify-center">
                    {/* Decorative background blob */}
                    <div className="absolute inset-0 bg-[#2b8cee]/10 dark:bg-[#2b8cee]/5 rounded-full blur-3xl transform scale-75"></div>
                    {/* Main Illustration */}
                    <div 
                        className="bg-center bg-contain bg-no-repeat w-full h-full relative z-10 drop-shadow-xl" 
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDcq3Ie5Tq2M25eM_cFQ7fpQaGs5vi2UB8PP8OH-TlZAD_aITDDvVNYj12jFXCqKqGSAQV6115khX-upUTWoglErlhlf2GIKXu5ZAKc4wCvLbQU89peK9cEITWpkzTSrflkcsaceUJeutrnOM4uFjIq3wOPAqg9ARDQn_xeeHUZLbUyIQVJ8BFXnxdgWUqIFSD-O2Cv0NbbYdil-PdGoPABoilZlmE80kgShqa3OIcSSrwkund9MNnk_IS_IBEdMK9XlzFOO9A5kEY")' }}
                    >
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-center gap-3 text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        404: Missing Funds?
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-normal leading-relaxed max-w-[480px]">
                        Oops! Looks like this page ran off with the bill! We can't find the page you're looking for, but we can help you split the next check.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-center gap-4 w-full max-w-[320px]">
                    <Link href="/" className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-[#2b8cee] hover:bg-[#1a6bbd] text-white text-base font-bold transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
                        Go to Home Dashboard
                    </Link>
                    <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold transition-colors group">
                        <span className="mr-2">Report this missing page</span>
                        <Flag className="group-hover:translate-x-0.5 transition-transform" size={18} />
                    </button>
                </div>
            </div>
        </main>
    </div>
  );
}
