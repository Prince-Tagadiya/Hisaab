'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';
import { 
  Search, Bell, Filter, Plus, MoreHorizontal, Users, 
  Wallet, ArrowUpDown, ChevronDown 
} from 'lucide-react';

export default function GroupsPage() {
  const { user, loading, getIdToken, signOut } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (user) {
        fetchGroups();
    }
  }, [user]);

  const fetchGroups = async () => {
      try {
          const token = await getIdToken();
          const res = await fetch('/api/groups', {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) {
            setGroups(data.groups || []);
          }
      } catch (e) {
          console.error("Failed to fetch groups", e);
      } finally {
          setIsLoadingGroups(false);
      }
  };

  const handleCreateGroup = () => router.push('/groups/create');
  // 'Join Group' usually implies checking invites or entering code. 
  // For now, we redirect to 'Requests' where invites appear.
  const handleJoinGroup = () => router.push('/requests'); 
  const handleAddFriend = () => router.push('/profile'); // Placeholder for now

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
            onCreateGroup={handleCreateGroup}
            onJoinGroup={handleJoinGroup}
            onAddFriend={handleAddFriend}
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
            {/* Top Navigation Bar from User HTML */}
            <header className="sticky top-0 z-30 w-full bg-white dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-800 shadow-sm flex-none">
                <div className="px-6 lg:px-10 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-8">
                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                            onClick={() => setMobileOpen(true)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>

                        {/* Logo (Mobile Only mainly) */}
                        <div className="flex items-center gap-3 md:hidden">
                            <div className="size-8 flex items-center justify-center">
                                <img src="/icons/icon-192.png" alt="Hisab" className="w-full h-full object-contain" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Hisab</h2>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg h-10 w-64 lg:w-96 px-3 gap-2 focus-within:ring-2 focus-within:ring-[#2b8cee]/50 transition-all">
                            <Search className="text-slate-400" size={20} />
                            <input 
                                className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-0" 
                                placeholder="Search groups or friends" 
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
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

            {/* Main Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-10 py-8 scroll-smooth flex flex-col">
                <div className={`max-w-[1440px] mx-auto w-full flex-1 flex flex-col ${groups.length === 0 && !isLoadingGroups ? 'items-center justify-center' : ''}`}>
                    
                    {/* Empty State */}
                    {groups.length === 0 && !isLoadingGroups ? (
                        <div className="flex w-full max-w-[480px] flex-col items-center gap-8 text-center animate-in fade-in duration-500 my-auto">
                            {/* Illustration */}
                            <div className="relative flex aspect-video w-full items-center justify-center rounded-xl bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                {/* Abstract visual */}
                                <div className="relative z-10 flex flex-col items-center gap-4">
                                    <div className="flex -space-x-4">
                                        <div className="flex size-16 items-center justify-center rounded-full border-4 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 text-slate-400">
                                            <Users size={32} />
                                        </div>
                                        <div className="flex size-16 items-center justify-center rounded-full border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-600 text-slate-300">
                                            <Users size={32} />
                                        </div>
                                        <div className="flex size-16 items-center justify-center rounded-full border-4 border-white dark:border-slate-800 bg-[#2b8cee]/10 text-[#2b8cee] z-10">
                                            <Plus size={32} />
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative background */}
                                <div className="absolute inset-0 overflow-hidden rounded-xl opacity-30 pointer-events-none">
                                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#2b8cee]/20 blur-3xl"></div>
                                    <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl"></div>
                                </div>
                            </div>
                            
                            {/* Text Content */}
                            <div className="space-y-3">
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">No groups yet!</h2>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Start by creating one to manage your shared expenses with friends, roommates, or for your next trip.
                                </p>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex w-full flex-col gap-4 sm:w-auto">
                                <button 
                                    onClick={handleCreateGroup}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#2b8cee] px-8 text-sm font-semibold text-white shadow-md shadow-[#2b8cee]/20 transition-all hover:bg-[#1a6bbd] hover:shadow-lg hover:shadow-[#2b8cee]/30 active:scale-[0.98]"
                                >
                                    <Plus size={20} />
                                    <span>Create New Group</span>
                                </button>
                                <button 
                                    onClick={handleJoinGroup}
                                    className="text-sm font-medium text-[#2b8cee] hover:text-[#1a6bbd] hover:underline underline-offset-4"
                                >
                                    Join an existing group
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Existing Content */
                        <>
                            {/* Page Header Section */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">My Groups</h1>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your shared expenses and balances.</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Sort Dropdown */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <ArrowUpDown className="text-slate-400" size={20} />
                                        </div>
                                        <select className="h-10 pl-10 pr-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-[#2b8cee]/20 focus:border-[#2b8cee] outline-none cursor-pointer appearance-none shadow-sm min-w-[160px]">
                                            <option>Most Recent</option>
                                            <option>Highest Balance</option>
                                            <option>Alphabetical</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                            <ChevronDown className="text-slate-400" size={20} />
                                        </div>
                                    </div>
                                    {/* Create Button */}
                                    <button 
                                        onClick={handleCreateGroup}
                                        className="h-10 px-5 bg-[#2b8cee] hover:bg-[#1a6bbd] text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                                    >
                                        <Plus size={20} />
                                        <span>Create New Group</span>
                                    </button>
                                </div>
                            </div>

                            {/* Groups Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {isLoadingGroups && (
                                     [1,2,3].map(i => (
                                        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl h-[300px] animate-pulse shadow-sm" />
                                     ))
                                )}

                                {groups.map((group) => (
                                    <Link href={`/group/${group._id}`} key={group._id}>
                                        <article className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md hover:border-[#2b8cee]/30 transition-all duration-200 cursor-pointer h-full">
                                            <div className="h-32 bg-slate-200 bg-cover bg-center relative" style={{ backgroundImage: group.icon ? `url(${group.icon})` : 'none' }}>
                                                {/* Fallback specific pattern if no icon? Or random gradient? */}
                                                {!group.icon && (
                                                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 opacity-80" />
                                                )}
                                                <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-md text-white p-1 rounded-full hover:bg-black/40 transition-colors">
                                                    <MoreHorizontal size={20} />
                                                </div>
                                            </div>
                                            <div className="p-5 flex flex-col flex-1 gap-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#2b8cee] transition-colors line-clamp-1">{group.name}</h3>
                                                        <div className="flex items-center gap-1.5 mt-1 text-slate-500 dark:text-slate-400 text-sm">
                                                            <Users size={16} />
                                                            <span>{group.memberCount} members</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Status</span>
                                                        <span className={`font-bold text-sm ${
                                                            group.status === 'owed' ? 'text-emerald-600 dark:text-emerald-400' : 
                                                            group.status === 'owe' ? 'text-rose-600 dark:text-rose-400' :
                                                            'text-slate-500 dark:text-slate-400'
                                                        }`}>
                                                            {group.status === 'owed' ? 'You are owed' : group.status === 'owe' ? 'You owe' : 'All settled up'}
                                                        </span>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full font-bold text-sm border ${
                                                        group.status === 'owed' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800' :
                                                        group.status === 'owe' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-800' :
                                                        'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                                                    }`}>
                                                        {group.status === 'settled' ? 'Settled' : `${group.currency || '$'}${Math.abs(group.myBalance).toFixed(2)}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}

                                {/* Add New Placeholder Card (Only showed if groups exist, to keep grid flow) */}
                                {groups.length > 0 && (
                                    <article 
                                        onClick={handleCreateGroup}
                                        className="group flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 min-h-[300px] hover:border-[#2b8cee] hover:bg-[#2b8cee]/5 transition-all cursor-pointer"
                                    >
                                        <div className="flex flex-col items-center gap-4 text-center p-6">
                                            <div className="size-16 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <Plus className="text-[#2b8cee]" size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#2b8cee] transition-colors">Create New Group</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Start tracking expenses for a new activity</p>
                                            </div>
                                        </div>
                                    </article>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
       </main>
    </div>
  );
}
