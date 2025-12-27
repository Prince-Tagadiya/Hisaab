'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { 
  Search, Bell, Filter, Plus, ChevronRight, UserPlus, 
  Wallet, TrendingUp, CheckCircle2, MoreVertical, Menu,
  ChevronDown, Film, Plane, ShoppingCart, User
} from 'lucide-react';

export default function FriendsPage() {
  const { user, loading, getIdToken, signOut } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const [friends, setFriends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
        fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
      try {
          const token = await getIdToken();
          const res = await fetch('/api/friends', {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) {
            setFriends(data.friends || []);
          }
      } catch (e) {
          console.error("Failed to fetch friends", e);
      } finally {
          setIsLoading(false);
      }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) {
      if (typeof window !== 'undefined') router.push('/');
      return null;
  }

  return (
    <div className="flex h-screen bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white transition-colors font-sans">
       {/* Sidebar */}
       <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1a2632] border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar 
            mobileOpen={mobileOpen} 
            setMobileOpen={setMobileOpen}
            onLogout={signOut}
            onCreateGroup={() => router.push('/groups/create')}
            onJoinGroup={() => router.push('/requests')}
            onAddFriend={() => router.push('/profile')}
          />
       </aside>

       {mobileOpen && (
         <div 
           className="fixed inset-0 bg-black/50 z-40 md:hidden"
           onClick={() => setMobileOpen(false)}
         />
       )}

       <main className="flex-1 flex flex-col overflow-hidden w-full">
            {/* Top Navigation */}
            <header className="sticky top-0 z-30 w-full bg-white dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-800 shadow-sm flex-none">
                <div className="px-6 lg:px-10 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-8">
                        <button 
                            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                     <div className="flex items-center gap-4">
                        <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1a2632]"></span>
                        </button>
                        <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-600">
                             {user?.photoURL ? (
                                 <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                             ) : (
                                 <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-500 font-bold">
                                     {user?.displayName?.charAt(0) || 'U'}
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 md:px-10 py-8 scroll-smooth">
                <div className="max-w-[960px] mx-auto w-full flex flex-col gap-6 pb-20">
                    
                    {/* Header Section */}
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Direct Splits</h2>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                <span>Total Balance:</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">You are owed $120.50</span>
                            </div>
                        </div>
                        <button className="flex items-center justify-center gap-2 bg-[#2b8cee] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-500/20">
                            <Plus size={20} />
                            <span>Add Expense</span>
                        </button>
                    </header>

                    {/* Filters & Search Toolbar */}
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-[#cfdbe7] dark:border-slate-700 p-4 mb-2 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="text-slate-400" size={20} />
                                </div>
                                <input 
                                    className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-[#f6f7f8] dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#2b8cee] text-sm transition-all" 
                                    placeholder="Search by friend or description..." 
                                    type="text"
                                />
                            </div>
                            {/* Chips/Filters */}
                            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                                <button className="flex items-center gap-1 px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg text-sm font-medium whitespace-nowrap transition-colors">
                                    All Splits
                                </button>
                                <button className="flex items-center gap-1 px-4 py-2 bg-[#f6f7f8] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-600">
                                    You owe
                                    <ChevronDown size={16} />
                                </button>
                                <button className="flex items-center gap-1 px-4 py-2 bg-[#f6f7f8] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-600">
                                    You are owed
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Splits List */}
                    <div className="flex flex-col gap-3">
                        {friends.length === 0 && !isLoading && (
                            <div className="text-center py-10 text-slate-500 flex flex-col items-center gap-2">
                                <User size={48} className="text-slate-300" />
                                <p>No friends yet. Start by adding a friend!</p>
                            </div>
                        )}
                        {friends.map((friend) => (
                            <div key={friend.id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-[#1a2632] rounded-xl border border-[#cfdbe7] dark:border-slate-700 hover:border-[#2b8cee]/50 dark:hover:border-[#2b8cee]/50 shadow-sm transition-all cursor-pointer">
                                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                    <div className="relative">
                                        {friend.photoURL ? (
                                             <div className="size-12 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${friend.photoURL})` }}></div>
                                        ) : (
                                            <div className="size-12 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-500">
                                                <User size={24} />
                                            </div>
                                        )}
                                        {friend.online && (
                                            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5">
                                                <div className="bg-emerald-500 size-2.5 rounded-full border-2 border-white dark:border-slate-800"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-[#2b8cee] transition-colors">{friend.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                            <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-medium">{friend.category}</span>
                                            <span>•</span>
                                            <span>{friend.date}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-6 pl-16 sm:pl-0">
                                    {friend.status === 'Settled' && (
                                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">Settled</span>
                                    )}
                                    {friend.status === 'Pending' && (
                                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">Pending</span>
                                    )}
                                    {friend.status === 'Archived' && (
                                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Archived</span>
                                    )}
                                    
                                    <div className="text-right">
                                        <p className={`text-base font-bold ${
                                            friend.type === 'lent' ? 'text-emerald-600 dark:text-emerald-400' :
                                            friend.type === 'borrowed' ? 'text-orange-600 dark:text-orange-400' :
                                            'text-slate-400 dark:text-slate-500 line-through'
                                        }`}>
                                            {friend.type === 'lent' ? `+$${friend.amount.toFixed(2)}` : `-$${friend.amount.toFixed(2)}`}
                                            {friend.type === 'settled' && ` +$${friend.amount.toFixed(2)}`}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                            {friend.type === 'lent' ? 'you lent' : friend.type === 'borrowed' ? 'you borrowed' : 'settled'}
                                        </p>
                                    </div>
                                    <ChevronRight className="text-slate-400 group-hover:text-[#2b8cee] hidden sm:block" size={20} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="mt-4 flex justify-center">
                        <button className="text-sm font-medium text-slate-500 hover:text-[#2b8cee] dark:text-slate-400 dark:hover:text-[#2b8cee] transition-colors flex items-center gap-2">
                            <span>Show more activity</span>
                            <ChevronDown size={20} />
                        </button>
                    </div>

                </div>
            </div>
       </main>
    </div>
  );
}
