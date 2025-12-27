'use client';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Menu, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  totals: {
    toPay: number;
    toReceive: number;
  };
  groups: Array<{
    _id: string;
    name: string;
    currency: string;
    memberCount: number;
    myBalance: {
      toPay: number;
      toReceive: number;
    };
    lastUpdated: string;
  }>;
}

export default function Dashboard() {
  const { user, loading, signOut, getIdToken } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchDashboard() {
      if (!user) return;
      try {
        setFetching(true);
        const token = await getIdToken();
        const res = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) throw new Error('Failed to fetch data');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setFetching(false);
      }
    }

    if (user && !loading) {
      fetchDashboard();
    }
  }, [user, loading, getIdToken]);

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#f9f9f9]">Loading...</div>;
  if (!user) return null; // Redirecting...

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-[#101922] flex text-[#111418] dark:text-white transition-colors duration-200">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-[280px] bg-white dark:bg-[#1a2632] border-r border-gray-200 dark:border-gray-800 flex-col fixed inset-y-0 z-30">
         <Sidebar 
            onLogout={signOut}
            onCreateGroup={() => router.push('/groups/create')} 
            onJoinGroup={() => {}} 
            onAddFriend={() => {}}
         />
      </aside>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden pointer-events-none ${mobileMenuOpen ? 'pointer-events-auto' : ''}`}>
        <div 
            className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
            onClick={() => setMobileMenuOpen(false)}
        ></div>
        <div className={`absolute top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-[#1a2632] shadow-2xl transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar 
            onLogout={signOut} 
            onCreateGroup={() => router.push('/groups/create')} 
            onJoinGroup={() => {}} 
            onAddFriend={() => {}}
            mobileOpen={mobileMenuOpen}
            setMobileOpen={setMobileMenuOpen}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[280px] transition-all duration-300">
      
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 w-full border-b border-gray-200 bg-white/95 backdrop-blur dark:bg-[#1a2632]/95 dark:border-gray-800">
          <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
            
            {/* Left: Hamburger (Mobile Only) & Logo (Mobile Only) */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="flex lg:hidden items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                <Menu size={24} />
              </button>
              
              {/* Show Logo Title on Mobile since Sidebar is hidden */}
              <div className="flex lg:hidden items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2b8cee] text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                </div>
                <h1 className="font-sans text-xl font-bold tracking-tight">Hisaab</h1>
              </div>

              <h1 className="hidden lg:block font-sans text-xl font-bold tracking-tight">Dashboard</h1>
            </div>

            {/* Right: Actions & Avatar */}
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 relative group cursor-pointer" onClick={signOut}>
                 {user.photoURL ? (
                    <img alt="Profile" className="h-full w-full object-cover" src={user.photoURL} />
                 ) : (
                    <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-lg">
                      {user.displayName ? user.displayName[0] : 'U'}
                    </div>
                 )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Greeting Header */}
          <div className="mb-10 flex flex-col gap-2">
              <h2 className="font-sans text-3xl md:text-4xl font-extrabold tracking-tight">
                  Good evening, {user.displayName?.split(' ')[0]}
              </h2>
              <p className="text-base text-gray-500 dark:text-gray-400">
                  Here’s your shared expenses overview.
              </p>
          </div>

          {fetching && !data ? (
            <div className="flex justify-center py-20">
               <RefreshCw className="animate-spin text-slate-400" size={32} />
            </div>
          ) : error ? (
             <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
               <AlertCircle size={20} />
               <span>Failed to load data: {error}</span>
             </div>
          ) : (
            <>
              {/* Quick Stats Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  <div className="rounded-xl bg-white dark:bg-[#1a2632] p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total you owe</p>
                          <p className={`mt-1 text-2xl font-bold ${data?.totals.toPay ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                            ₹{data?.totals.toPay.toLocaleString() || '0'}
                          </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                      </div>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-[#1a2632] p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total owed to you</p>
                          <p className={`mt-1 text-2xl font-bold ${data?.totals.toReceive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                            ₹{data?.totals.toReceive.toLocaleString() || '0'}
                          </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></svg>
                      </div>
                  </div>
              </div>

              {/* Groups Section */}
              <section className="mb-12">
                  <div className="flex items-center justify-between mb-5">
                      <h3 className="text-xl font-bold">Groups</h3>
                      <button className="text-sm font-semibold text-[#2b8cee] hover:text-blue-600 flex items-center gap-1">
                          View all 
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </button>
                  </div>
                  
                  {(!data?.groups || data.groups.length === 0) ? (
                    <div className="text-center py-10 bg-white dark:bg-[#1a2632] rounded-xl border border-gray-100 dark:border-gray-800">
                        <p className="text-gray-500 mb-4">You don't have any groups yet.</p>
                        <button 
                          onClick={() => router.push('/groups/create')}
                          className="bg-[#2b8cee] text-white px-4 py-2 rounded-lg font-bold text-sm"
                        >
                          Create Group
                        </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {data.groups.map((group) => (
                          <Link href={`/group/${group._id}`} key={group._id} className="group flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2632] p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-500/30 cursor-pointer">
                              <div className="flex items-start justify-between mb-4">
                                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-sm font-bold text-lg">
                                       {group.name[0]}
                                  </div>
                                  {group.myBalance.toPay > 0 && (
                                    <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
                                        You owe {group.currency}{group.myBalance.toPay}
                                    </span>
                                  )}
                                  {group.myBalance.toReceive > 0 && (
                                     <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                        Owed {group.currency}{group.myBalance.toReceive}
                                    </span>
                                  )}
                                  {group.myBalance.toPay === 0 && group.myBalance.toReceive === 0 && (
                                      <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                                          Settled up
                                      </span>
                                  )}
                              </div>
                              <h4 className="text-lg font-bold mb-1 group-hover:text-[#2b8cee] transition-colors line-clamp-1">{group.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                  {/* <span>{group.memberCount} members</span>
                                  <span className="text-gray-300">•</span> */}
                                  <span>Active recently</span>
                              </div>
                          </Link>
                        ))}
                    </div>
                  )}
              </section>
            </>
          )}

        </main>

        {/* Floating Action Button */}
        <button className="fixed bottom-8 right-8 z-40 flex h-14 w-auto items-center gap-2 rounded-full bg-[#2b8cee] px-6 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200">
           <Plus size={24} />
           <span className="font-bold text-sm tracking-wide">Add Spend</span>
        </button>

      </div>
    </div>
  );
}
