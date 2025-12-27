'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import AddExpenseModal from '../../components/AddExpenseModal';
import { 
  Bell, Plus, Filter, ArrowUpRight, ArrowDownLeft, Grid3x3, List,
  ChevronDown, CircleDollarSign, User, BellRing, History
} from 'lucide-react';

export default function FriendsPage() {
  const { user, loading, getIdToken, signOut } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  // Calculate stats
  const totalYouOwe = friends
    .filter(f => f.type === 'borrowed')
    .reduce((sum, f) => sum + (f.amount || 0), 0);
  
  const totalOwedToYou = friends
    .filter(f => f.type === 'lent')
    .reduce((sum, f) => sum + (f.amount || 0), 0);

  const peopleYouOwe = friends.filter(f => f.type === 'borrowed').length;
  const peopleOweYou = friends.filter(f => f.type === 'lent').length;

  if (loading) return <div>Loading...</div>;
  if (!user) {
      if (typeof window !== 'undefined') router.push('/');
      return null;
  }

  return (
    <div className="flex h-screen bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white overflow-hidden">
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

       {/* Main Content */}
       <main className="flex-1 overflow-y-auto bg-[#f6f7f8] dark:bg-[#101922] p-6 md:p-10">
            <div className="mx-auto max-w-6xl flex flex-col gap-8">
                
                {/* Page Heading & Actions */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Direct Splits</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base">Manage your 1-on-1 expenses and balances</p>
                    </div>
                    <button 
                        onClick={() => setShowExpenseModal(true)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-[#2b8cee] hover:bg-[#2b8cee]/90 transition-colors text-white px-5 py-2.5 text-sm font-bold shadow-lg shadow-[#2b8cee]/20"
                    >
                        <Plus size={20} />
                        <span>New Split</span>
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-[#15202b] p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Total you owe</p>
                            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-1.5 text-red-600 dark:text-red-400">
                                <ArrowUpRight size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">${totalYouOwe.toFixed(2)}</p>
                        <p className="text-red-500 text-sm font-medium mt-1">across {peopleYouOwe} {peopleYouOwe === 1 ? 'person' : 'people'}</p>
                    </div>
                    
                    <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-[#15202b] p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Total owed to you</p>
                            <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-1.5 text-emerald-600 dark:text-emerald-400">
                                <ArrowDownLeft size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">${totalOwedToYou.toFixed(2)}</p>
                        <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mt-1">across {peopleOweYou} {peopleOweYou === 1 ? 'person' : 'people'}</p>
                    </div>
                </div>

                {/* Filters & Controls */}
                <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-6">
                    <button className="flex h-9 items-center gap-2 rounded-lg bg-white dark:bg-[#15202b] border border-slate-200 dark:border-slate-700 px-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Filter size={18} className="text-slate-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status: All</span>
                        <ChevronDown size={18} className="text-slate-400" />
                    </button>
                    
                    <button className="flex h-9 items-center gap-2 rounded-lg bg-white dark:bg-[#15202b] border border-slate-200 dark:border-slate-700 px-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Filter size={18} className="text-slate-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sort: Date</span>
                        <ChevronDown size={18} className="text-slate-400" />
                    </button>
                    
                    <div className="ml-auto flex items-center bg-white dark:bg-[#15202b] border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-1 rounded ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                        >
                            <Grid3x3 size={20} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-1 rounded ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                {/* Grid of Splits */}
                {friends.length === 0 && !isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <User size={48} className="text-slate-300 mb-4" />
                        <p className="text-slate-500">No friends yet. Start by adding a friend!</p>
                    </div>
                ) : (
                    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                        {friends.map((friend) => {
                            const isBorrowed = friend.type === 'borrowed';
                            const isSettled = friend.status === 'Settled' || friend.status === 'Archived';
                            
                            return (
                                <div 
                                    key={friend.id} 
                                    className={`group relative flex flex-col justify-between rounded-xl bg-white dark:bg-[#15202b] p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-[#2b8cee]/50 transition-all ${isSettled ? 'opacity-80 hover:opacity-100' : ''}`}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            {friend.photoURL ? (
                                                <img 
                                                    src={friend.photoURL} 
                                                    alt={friend.name}
                                                    className={`h-12 w-12 flex-shrink-0 rounded-full object-cover border border-slate-100 dark:border-slate-700 ${isSettled ? 'grayscale' : ''}`}
                                                />
                                            ) : (
                                                <div className={`h-12 w-12 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold border border-slate-100 dark:border-slate-700 ${isSettled ? 'grayscale' : ''}`}>
                                                    {friend.name?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bold text-slate-900 dark:text-white leading-tight truncate">{friend.name}</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                                    {isSettled ? `Settled ${friend.date}` : `Updated ${friend.date}`}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center flex-shrink-0 rounded-full px-2 py-1 text-xs font-bold whitespace-nowrap ${
                                            isSettled 
                                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' 
                                                : isBorrowed
                                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                                    : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                        }`}>
                                            {isSettled ? 'Settled' : 'Unsettled'}
                                        </span>
                                    </div>

                                    {/* Amount Box */}
                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 mb-4">
                                        <p className={`text-sm ${isSettled ? 'text-slate-500' : 'text-slate-600 dark:text-slate-300'} line-clamp-1`}>
                                            {friend.category || 'General Expense'}
                                        </p>
                                        <div className="flex items-baseline gap-1 mt-1">
                                            <span className={`text-xs font-medium ${
                                                isSettled 
                                                    ? 'text-slate-400' 
                                                    : isBorrowed 
                                                        ? 'text-red-500' 
                                                        : 'text-emerald-600 dark:text-emerald-400'
                                            }`}>
                                                {isSettled ? 'Paid' : isBorrowed ? 'You owe' : 'Owes you'}
                                            </span>
                                            <span className={`text-xl font-bold ${
                                                isSettled 
                                                    ? 'text-slate-400' 
                                                    : isBorrowed 
                                                        ? 'text-red-600 dark:text-red-500' 
                                                        : 'text-emerald-600 dark:text-emerald-500'
                                            }`}>
                                                ${friend.amount?.toFixed(2) || '0.00'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                                        <button className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white px-3 py-2">
                                            {isSettled ? 'History' : 'Details'}
                                        </button>
                                        {!isSettled && (
                                            <button className={`flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                                                isBorrowed
                                                    ? 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400'
                                                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                                            }`}>
                                                {isBorrowed ? (
                                                    <>
                                                        <CircleDollarSign size={16} />
                                                        Settle Up
                                                    </>
                                                ) : (
                                                    <>
                                                        <BellRing size={16} />
                                                        Remind
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty Space for scroll padding */}
                <div className="h-10"></div>
            </div>

            {/* Add Expense Modal */}
            <AddExpenseModal 
                isOpen={showExpenseModal} 
                onClose={() => setShowExpenseModal(false)} 
            />
       </main>
    </div>
  );
}
