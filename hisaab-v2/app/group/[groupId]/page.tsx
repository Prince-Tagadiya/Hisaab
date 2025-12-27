'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import AddExpenseModal from '../../../components/AddExpenseModal';
import Link from 'next/link';
import { 
  Search, Bell, Filter, Plus, MoreHorizontal, Users, 
  Wallet, ArrowRight, ChevronRight, Calendar, BarChart3, 
  Utensils, Fuel, Home, Film, Eye, EyeOff, Copy
} from 'lucide-react';

export default function GroupDetailsPage() {
  const { user, loading, getIdToken, signOut } = useAuth();
  const router = useRouter();
  const params = useParams();
  const groupId = params?.groupId as string;

  const [group, setGroup] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showJoinCode, setShowJoinCode] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  useEffect(() => {
    if (user && groupId) {
        fetchGroupDetails();
    }
  }, [user, groupId]);

  const fetchGroupDetails = async () => {
      try {
          const token = await getIdToken();
          const res = await fetch(`/api/groups/${groupId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) {
            setGroup(data.group);
            setExpenses(data.expenses || []);
          }
      } catch (e) {
          console.error("Failed to fetch group details", e);
      } finally {
          setIsLoading(false);
      }
  };

  const handleSaveExpense = async (expenseData: any) => {
      try {
          const token = await getIdToken();
          const res = await fetch(`/api/expenses`, {
              method: 'POST',
              headers: { 
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  ...expenseData,
                  groupId: groupId
              })
          });
          
          if (res.ok) {
              // Refresh group details to show new expense
              fetchGroupDetails();
          } else {
              const error = await res.json();
              console.error('Failed to save expense:', error);
          }
      } catch (e) {
          console.error("Failed to save expense", e);
      }
  };

  const copyToClipboard = () => {
      if (group?.joinCode) {
          navigator.clipboard.writeText(group.joinCode);
          // Optional: Show toast
      }
  };

  if (loading || (!group && isLoading)) return (
      <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
  );

  if (!user) {
      if (typeof window !== 'undefined') router.push('/');
      return null;
  }

  if (!group && !isLoading) return <div>Group not found</div>;

  return (
    <div className="flex h-screen bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white transition-colors font-sans">
       {/* Sidebar */}
       <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1a2632] border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar 
            mobileOpen={mobileOpen} 
            setMobileOpen={setMobileOpen}
            onLogout={signOut}
            onCreateGroup={() => router.push('/groups/create')}
            onJoinGroup={() => router.push('/requests')} // Or join modal
            onAddFriend={() => router.push('/profile')}
          />
       </aside>

       {/* Overlay for mobile sidebar */}
       {mobileOpen && (
         <div 
           className="fixed inset-0 bg-black/50 z-40 md:hidden"
           onClick={() => setMobileOpen(false)}
         />
       )}

       <main className="flex-1 flex flex-col overflow-hidden w-full">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 w-full bg-white dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-800 shadow-sm flex-none">
                <div className="px-6 lg:px-10 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-8">
                        <button 
                            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                            onClick={() => setMobileOpen(true)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg h-10 w-64 lg:w-96 px-3 gap-2 focus-within:ring-2 focus-within:ring-[#2b8cee]/50 transition-all">
                            <Search className="text-slate-400" size={20} />
                            <input 
                                className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-0" 
                                placeholder="Search groups..." 
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors relative">
                            <Bell size={20} />
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

            {/* Main Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-10 scroll-smooth">
                <div className="max-w-[1280px] mx-auto w-full">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 mb-6 text-sm">
                        <Link href="/dashboard" className="text-[#4c739a] dark:text-slate-400 hover:text-[#2b8cee] transition-colors">Dashboard</Link>
                        <ChevronRight size={16} className="text-[#4c739a] dark:text-slate-400" />
                        <Link href="/groups" className="text-[#4c739a] dark:text-slate-400 hover:text-[#2b8cee] transition-colors">Groups</Link>
                        <ChevronRight size={16} className="text-[#4c739a] dark:text-slate-400" />
                        <span className="font-medium text-[#0d141b] dark:text-white truncate">{group.name}</span>
                    </div>

                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl md:text-4xl font-black text-[#0d141b] dark:text-white tracking-tight">{group.name}</h1>
                            <div className="flex items-center gap-2 text-[#4c739a] dark:text-slate-400">
                                <Calendar size={18} />
                                <span className="text-sm font-medium">Created {group.createdAt}</span>
                                <span className="mx-1">•</span>
                                <Users size={18} />
                                <span className="text-sm font-medium">{group.members?.length || 0} Members</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none h-11 px-5 rounded-lg bg-white dark:bg-[#1a2632] border border-[#cfdbe7] dark:border-[#2a3845] text-[#0d141b] dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-[#23303d] transition-colors flex items-center justify-center gap-2">
                                <BarChart3 size={20} />
                                <span className="hidden sm:inline">Report</span>
                            </button>
                            <button 
                                onClick={() => setShowExpenseModal(true)}
                                className="flex-1 md:flex-none h-11 px-6 rounded-lg bg-[#2b8cee] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                Add Expense
                            </button>
                        </div>
                    </div>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Left Column: Transactions (2/3 width) */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/* Search & Filters */}
                            <div className="bg-white dark:bg-[#1a2632] p-2 rounded-xl shadow-sm border border-[#e7edf3] dark:border-[#2a3845] flex items-center gap-2">
                                <div className="flex-1 flex items-center h-10 px-3 bg-[#f6f7f8] dark:bg-[#23303d] rounded-lg">
                                    <Search className="text-[#4c739a] dark:text-slate-400" size={20} />
                                    <input className="w-full bg-transparent border-none focus:ring-0 text-sm ml-2 placeholder:text-[#4c739a] dark:placeholder:text-slate-400 text-[#0d141b] dark:text-white" placeholder="Search expenses by name, category..."/>
                                </div>
                                <button className="size-10 flex items-center justify-center rounded-lg hover:bg-[#f6f7f8] dark:hover:bg-[#23303d] text-[#4c739a] dark:text-slate-400 transition-colors" title="Filter">
                                    <Filter size={20} />
                                </button>
                            </div>

                            {/* Transaction List */}
                            <div className="flex flex-col gap-8">
                                {/* Recent Transactions */}
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-sm font-bold text-[#4c739a] dark:text-slate-400 uppercase tracking-wider px-2">Recent Activity</h3>
                                    
                                    {expenses.length === 0 ? (
                                        <div className="text-center py-10 text-slate-400">No expenses yet.</div>
                                    ) : (
                                        expenses.map((expense) => (
                                            <div key={expense._id} className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e7edf3] dark:border-[#2a3845] p-4 flex items-center gap-4 hover:border-[#2b8cee]/30 transition-colors cursor-pointer group">
                                                <div className="size-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                                                    <Utensils size={24} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-bold text-[#0d141b] dark:text-white truncate pr-4 group-hover:text-[#2b8cee] transition-colors">{expense.title}</h4>
                                                        <span className="font-bold text-[#0d141b] dark:text-white">${expense.amount.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <span className="text-sm text-[#4c739a] dark:text-slate-400 truncate">{expense.date} • {expense.paidBy.id === user.uid ? 'You' : expense.paidBy.name.split(' ')[0]} paid</span>
                                                        {/* Status Badge Mockup */}
                                                        {/* <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded">You borrowed $15.00</span> */}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {expenses.length > 0 && (
                                    <button className="w-full py-3 text-sm font-bold text-[#2b8cee] hover:bg-[#2b8cee]/5 rounded-lg transition-colors">View older transactions</button>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Sidebar (1/3 width) */}
                        <div className="flex flex-col gap-6 sticky top-24">
                            
                            {/* Join Code Widget */}
                            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e7edf3] dark:border-[#2a3845] p-5">
                                <h3 className="font-bold text-sm text-[#0d141b] dark:text-white mb-2 uppercase tracking-wider">Join Code</h3>
                                <div className="flex items-center gap-2 bg-[#f6f7f8] dark:bg-[#23303d] rounded-lg p-2 border border-slate-200 dark:border-slate-700">
                                    <span className={`flex-1 font-mono text-lg font-bold text-center tracking-widest ${showJoinCode ? 'text-slate-900 dark:text-white' : 'blur-sm select-none text-slate-400'}`}>
                                        {group.joinCode}
                                    </span>
                                    <button onClick={() => setShowJoinCode(!showJoinCode)} className="p-2 text-slate-500 hover:text-[#2b8cee] transition-colors">
                                        {showJoinCode ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                    <button onClick={copyToClipboard} className="p-2 text-slate-500 hover:text-[#2b8cee] transition-colors">
                                        <Copy size={20} />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Share this code with friends to let them join.</p>
                            </div>

                            {/* Balances Card */}
                            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e7edf3] dark:border-[#2a3845] overflow-hidden flex flex-col">
                                <div className="p-5 border-b border-[#e7edf3] dark:border-[#2a3845] flex items-center justify-between bg-slate-50/50 dark:bg-[#23303d]/50">
                                    <h2 className="font-bold text-lg text-[#0d141b] dark:text-white">Group Balances</h2>
                                    <Link href={`/group/${groupId}/members`} className="text-[#2b8cee] text-sm font-bold hover:underline">See details</Link>
                                </div>
                                <div className="p-2 flex flex-col">
                                    {group.memberBalances?.map((member: any) => {
                                        const memberInfo = group.members.find((m: any) => m.userId === member.userId);
                                        const isMe = member.userId === user.uid;
                                        return (
                                            <div key={member.userId} className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#23303d] transition-colors ${isMe ? 'bg-slate-50 dark:bg-[#23303d]/50' : ''}`}>
                                                <div className="size-10 rounded-full bg-slate-200 overflow-hidden">
                                                     {memberInfo?.photoURL ? (
                                                         <img src={memberInfo.photoURL} alt={memberInfo.name} className="w-full h-full object-cover" />
                                                     ) : (
                                                         <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-500 font-bold text-xs">
                                                             {memberInfo?.name?.charAt(0) || '?'}
                                                         </div>
                                                     )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-[#0d141b] dark:text-white">{isMe ? 'You' : memberInfo?.name}</p>
                                                    <p className={`text-xs font-medium ${member.balance > 0 ? 'text-emerald-600 dark:text-emerald-400' : member.balance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
                                                        {member.balance > 0 ? `Gets back $${member.balance.toFixed(2)}` : member.balance < 0 ? `Owes $${Math.abs(member.balance).toFixed(2)}` : 'Settled'}
                                                    </p>
                                                </div>
                                                <ChevronRight size={20} className="text-[#cfdbe7] dark:text-slate-600" />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="p-4 border-t border-[#e7edf3] dark:border-[#2a3845] bg-slate-50/50 dark:bg-[#23303d]/50">
                                    <button className="w-full h-10 rounded-lg bg-white dark:bg-[#1a2632] border border-[#cfdbe7] dark:border-[#2a3845] text-[#0d141b] dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-[#23303d] transition-colors flex items-center justify-center gap-2">
                                        Settle Up
                                    </button>
                                </div>
                            </div>

                            {/* Total Spend Widget */}
                            <div className="bg-[#2b8cee] rounded-xl shadow-lg shadow-blue-500/10 p-5 flex flex-col gap-4 text-white relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Wallet size={120} />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-blue-100 text-sm font-medium mb-1">Total Group Spend</p>
                                    <h3 className="text-3xl font-black tracking-tight">${group.totalSpend?.toFixed(2) || '0.00'}</h3>
                                </div>
                                <div className="relative z-10 w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-white h-full w-[70%] rounded-full"></div>
                                </div>
                                <p className="relative z-10 text-xs text-blue-100 font-medium">70% of budget used</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Add Expense Modal */}
            <AddExpenseModal
                isOpen={showExpenseModal}
                onClose={() => setShowExpenseModal(false)}
                groupId={groupId}
                members={group?.members || []}
                currentUserId={user?.uid}
                onSave={handleSaveExpense}
            />
       </main>
    </div>
  );
}
