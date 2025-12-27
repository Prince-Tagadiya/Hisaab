'use client';
import { useAuth } from '../components/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  Receipt, 
  PlayCircle, 
  CheckCircle2, 
  Settings, 
  Utensils, 
  Plane, 
  ShoppingCart, 
  Plus, 
  Check, 
  Smartphone, 
  Scale, 
  Banknote,
  ReceiptText
} from 'lucide-react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f6f7f8] text-[#111827] font-sans antialiased selection:bg-[#2b8cee]/20 selection:text-[#2b8cee] transition-colors duration-300">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e5e7eb] bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-[#2b8cee] flex items-center justify-center">
                <Receipt size={28} />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[#111827]">Hisaab</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a className="text-sm font-medium text-[#6b7280] hover:text-[#2b8cee] transition-colors" href="#features">Features</a>
              <a className="text-sm font-medium text-[#6b7280] hover:text-[#2b8cee] transition-colors" href="#testimonials">Testimonials</a>
              <a className="text-sm font-medium text-[#6b7280] hover:text-[#2b8cee] transition-colors" href="#pricing">Pricing</a>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:flex text-sm font-medium text-[#111827] hover:text-[#2b8cee] transition-colors">
                Log In
              </Link>
              <Link href="/login" className="flex items-center justify-center rounded-lg bg-[#2b8cee] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#1a6bb5] transition-all active:scale-95">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            {/* Content */}
            <div className="flex flex-col gap-6 max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-[#111827]">
                Split bills. <br className="hidden sm:block"/>
                <span className="text-[#2b8cee]">Not friendships.</span>
              </h1>
              <p className="text-lg sm:text-xl leading-relaxed text-[#6b7280] max-w-lg">
                The easiest way to track shared expenses with roommates, partners, and friends. Track bills, split costs, and settle up without the awkward conversations.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/login" className="flex h-12 items-center justify-center rounded-lg bg-[#2b8cee] px-8 text-base font-bold text-white shadow-lg hover:bg-[#1a6bb5] hover:shadow-xl transition-all active:scale-95">
                  Start Tracking Free
                </Link>
                <button className="flex h-12 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white px-6 text-base font-medium text-[#111827] hover:bg-[#f6f7f8] transition-all">
                  <PlayCircle className="mr-2" size={20} />
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6b7280] pt-2">
                <CheckCircle2 className="text-green-500" size={18} />
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <CheckCircle2 className="text-green-500" size={18} />
                <span>Free for small groups</span>
              </div>
            </div>

            {/* App Preview (Mockup) */}
            <div className="relative w-full flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                {/* Decorative background blur */}
                <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-[#2b8cee]/20 blur-3xl"></div>
                <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl"></div>
                
                {/* Card Mockup */}
                <div className="relative overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05),0_4px_6px_-2px_rgba(0,0,0,0.025)] transform rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
                  {/* App Header */}
                  <div className="border-b border-[#e5e7eb] bg-white px-6 py-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6b7280]">Current Group</h3>
                      <h2 className="text-xl font-bold text-[#111827]">Trip to Cabo 🌴</h2>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-[#2b8cee]/10 flex items-center justify-center text-[#2b8cee]">
                      <Settings size={16} />
                    </div>
                  </div>
                  
                  {/* App Content List */}
                  <div className="flex flex-col p-2">
                    {/* Item 1 */}
                    <div className="flex items-center gap-4 rounded-xl p-4 hover:bg-[#f6f7f8] transition-colors cursor-pointer group/item">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <Utensils size={20} />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-semibold text-[#111827]">Taco Dinner</span>
                        <span className="text-xs text-[#6b7280]">Alice paid $124.50</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-orange-500">you owe</span>
                        <span className="text-sm font-bold text-[#111827]">$41.50</span>
                      </div>
                    </div>
                    
                    {/* Item 2 */}
                    <div className="flex items-center gap-4 rounded-xl p-4 hover:bg-[#f6f7f8] transition-colors cursor-pointer group/item">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <Plane size={20} />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-semibold text-[#111827]">Flights</span>
                        <span className="text-xs text-[#6b7280]">You paid $850.00</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-[#2b8cee]">lent</span>
                        <span className="text-sm font-bold text-[#111827]">$425.00</span>
                      </div>
                    </div>
                    
                    {/* Item 3 */}
                    <div className="flex items-center gap-4 rounded-xl p-4 hover:bg-[#f6f7f8] transition-colors cursor-pointer group/item">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <ShoppingCart size={20} />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-semibold text-[#111827]">Snacks &amp; Drinks</span>
                        <span className="text-xs text-[#6b7280]">Bob paid $45.20</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-orange-500">you owe</span>
                        <span className="text-sm font-bold text-[#111827]">$15.06</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* App Footer Action */}
                  <div className="p-4 bg-[#f6f7f8]/50 border-t border-[#e5e7eb]">
                    <button className="w-full flex items-center justify-center rounded-lg bg-[#2b8cee] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#1a6bb5] transition-colors">
                      <Plus className="mr-2" size={18} />
                      Add Expense
                    </button>
                  </div>
                </div>
                
                {/* Floating Element */}
                <div className="absolute -bottom-6 -right-4 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05),0_4px_6px_-2px_rgba(0,0,0,0.025)] flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#6b7280] uppercase">Total Settled</p>
                    <p className="text-sm font-bold text-[#111827]">All expenses cleared!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full border-y border-[#e5e7eb] bg-white">
          <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#e5e7eb]">
              <div className="flex flex-col items-center gap-2 p-2">
                <span className="text-3xl font-bold text-[#111827] tracking-tight">$1M+</span>
                <span className="text-sm font-medium text-[#6b7280]">Expenses Settled</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-2">
                <span className="text-3xl font-bold text-[#111827] tracking-tight">50k+</span>
                <span className="text-sm font-medium text-[#6b7280]">Active Groups</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-2">
                <span className="text-3xl font-bold text-[#111827] tracking-tight">4.9/5</span>
                <span className="text-sm font-medium text-[#6b7280]">App Store Rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8" id="features">
          <div className="flex flex-col gap-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">Why use Hisaab?</h2>
            <p className="text-lg text-[#6b7280] max-w-2xl mx-auto">
              Simple tools to manage your shared financial life. Designed to keep things fair and transparent.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="group flex flex-col items-start gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05),0_4px_6px_-2px_rgba(0,0,0,0.025)] hover:border-[#2b8cee]/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2b8cee]/10 text-[#2b8cee] group-hover:bg-[#2b8cee] group-hover:text-white transition-colors">
                <Smartphone size={24} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-[#111827]">Track Anywhere</h3>
                <p className="text-[#6b7280] leading-relaxed">
                  Access your expenses from any device. Cloud sync ensures everyone sees the same numbers instantly.
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="group flex flex-col items-start gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05),0_4px_6px_-2px_rgba(0,0,0,0.025)] hover:border-[#2b8cee]/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2b8cee]/10 text-[#2b8cee] group-hover:bg-[#2b8cee] group-hover:text-white transition-colors">
                <Scale size={24} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-[#111827]">Split Fairly</h3>
                <p className="text-[#6b7280] leading-relaxed">
                  Split by percentage, shares, or exact amounts. Handle complex splits with simple controls.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="group flex flex-col items-start gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05),0_4px_6px_-2px_rgba(0,0,0,0.025)] hover:border-[#2b8cee]/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2b8cee]/10 text-[#2b8cee] group-hover:bg-[#2b8cee] group-hover:text-white transition-colors">
                <Banknote size={24} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-[#111827]">Settle Up</h3>
                <p className="text-[#6b7280] leading-relaxed">
                  Record cash payments or integrate with payment apps to settle debts instantly and close the books.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8 text-center" id="testimonials">
          <blockquote className="text-2xl font-medium text-[#111827] sm:text-3xl italic">
            "Hisaab saved my relationship with my roommates. No more passive-aggressive sticky notes on the fridge about electricity bills."
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
              <img
                alt="User avatar"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr-xErxZ0CrJ8rLoBznolRFhz42lHGwNQll9fTN4pbDzem8XMB8TEzc_t8aYkVLGfmFjB6ec3Qigo9dvP6ZQHKOBq-wjtZnfpQMXaSQyjc1XN-zrgXwVHz0x9O0TUc1nRth7cCkZKZSZ_nZDTs5tTiTThTg6BJ7NYeuZVCNcvl01-kYknPpod_hnHvI-Ec8Bbfqp2Kwwa69bC_qUUjrq-BgJ4CRZIPtVrvUbc4bXqdokbCgGc0K4nFWTssSxmqT9-HsfTjAC_P1Wo"
              />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-[#111827]">Sarah Jenkins</div>
              <div className="text-xs text-[#6b7280]">Verified User</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-[#2b8cee] text-white shadow-2xl">
            <div className="flex flex-col items-center gap-8 px-6 py-16 text-center sm:px-12 md:py-20">
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                  Ready to get organized?
                </h2>
                <p className="text-lg font-medium text-blue-100 max-w-2xl mx-auto">
                  Join thousands of others who are simplifying their shared expenses today. It's free to get started.
                </p>
              </div>
              <Link href="/login" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-bold text-[#2b8cee] shadow-lg hover:bg-blue-50 transition-colors active:scale-95">
                Get Started Free
              </Link>
              <p className="text-xs text-blue-200">No credit card required. Cancel anytime.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#e5e7eb] bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="text-[#2b8cee]">
                  <Receipt size={24} />
                </div>
                <h2 className="text-lg font-bold text-[#111827]">Hisaab</h2>
              </div>
              <p className="text-sm text-[#6b7280]">
                Making shared finances simple, transparent, and fair for everyone.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Product</h3>
              <ul className="mt-4 flex flex-col gap-2">
                <li><a className="text-sm text-[#6b7280] hover:text-[#2b8cee] transition-colors" href="#features">Features</a></li>
                <li><a className="text-sm text-[#6b7280] hover:text-[#2b8cee] transition-colors" href="#">Pricing</a></li>
                <li><a className="text-sm text-[#6b7280] hover:text-[#2b8cee] transition-colors" href="#">Download App</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Company</h3>
              <ul className="mt-4 flex flex-col gap-2">
                <li><a className="text-sm text-[#6b7280] hover:text-[#2b8cee] transition-colors" href="#">About</a></li>
                <li><a className="text-sm text-[#6b7280] hover:text-[#2b8cee] transition-colors" href="#">Blog</a></li>
                <li><a className="text-sm text-[#6b7280] hover:text-[#2b8cee] transition-colors" href="#">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Legal</h3>
              <ul className="mt-4 flex flex-col gap-2">
                <li><Link className="text-sm text-[#6b7280] hover:text-[#2b8cee] transition-colors" href="/privacy">Privacy</Link></li>
                <li><Link className="text-sm text-[#6b7280] hover:text-[#2b8cee] transition-colors" href="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-[#e5e7eb] pt-8">
            <p className="text-center text-sm text-[#6b7280]">
              © 2024 Hisaab Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
