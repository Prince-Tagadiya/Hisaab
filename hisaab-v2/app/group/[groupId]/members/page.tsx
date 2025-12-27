'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import { 
  Search, Bell, Filter, Plus, ChevronRight, UserPlus, 
  Wallet, Landmark, CheckCircle2, MoreVertical, Menu
} from 'lucide-react';

export default function GroupMembersPage() {
  const { user, loading, getIdToken, signOut } = useAuth();
  const router = useRouter();
  const params = useParams();
  const groupId = params?.groupId as string;

  const [group, setGroup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'owes' | 'owed' | 'settled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

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
          }
      } catch (e) {
          console.error("Failed to fetch group details", e);
      } finally {
          setIsLoading(false);
      }
  };

  const calculateMemberStats = (memberId: string) => {
      const balanceObj = group?.memberBalances?.find((m: any) => m.userId === memberId);
      return {
          contributed: balanceObj?.paid || 0,
          balance: balanceObj?.balance || 0,
          status: balanceObj?.balance === 0 ? 'Settled' : 'Active'
      };
  };

  const getFilteredMembers = () => {
      if (!group?.members) return [];
      let members = group.members.map((m: any) => {
          const stats = calculateMemberStats(m.userId);
          return { ...m, ...stats };
      });

      if (searchTerm) {
          const lower = searchTerm.toLowerCase();
          members = members.filter((m: any) => 
              m.name.toLowerCase().includes(lower) || m.email?.toLowerCase().includes(lower)
          );
      }

      if (filter === 'owes') return members.filter((m: any) => m.balance < 0);
      if (filter === 'owed') return members.filter((m: any) => m.balance > 0);
      if (filter === 'settled') return members.filter((m: any) => Math.abs(m.balance) < 0.01);

      return members;
  };

  if (loading || (!group && isLoading)) return <div>Loading...</div>;
  if (!user) return null;
  if (!group && !isLoading) return <div>Group not found</div>;

  const filteredMembers = getFilteredMembers();
  const myBalance = group.memberBalances?.find((m: any) => m.userId === user.uid)?.balance || 0;
  const settledCount = group.memberBalances?.filter((m: any) => Math.abs(m.balance) < 0.01).length || 0;

  return (
    <div className="flex h-screen bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white transition-colors font-sans">
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
            <header className="sticky top-0 z-30 w-full bg-white dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-800 shadow-sm flex-none">
                <div className="px-6 lg:px-10 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 md:px-10 py-8 scroll-smooth">
                <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8 pb-20">
                    
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-2 text-sm text-[#4c739a] mb-1">
                                <Link href="/groups" className="hover:text-[#2b8cee]">My Groups</Link>
                                <ChevronRight size={14} />
                                <Link href={`/group/${groupId}`} className="hover:text-[#2b8cee]">{group.name}</Link>
                                <ChevronRight size={14} />
                                <span>Members</span>
                             </div>
                             <h1 className="text-[#0d141b] dark:text-white text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em]">{group.name}</h1>
                             <p className="text-[#4c739a] text-base font-normal">Manage group members and settle debts.</p>
                        </div>
                        <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-[#2b8cee] hover:bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm shadow-[#2b8cee]/30">
                            <UserPlus size={20} />
                            <span className="truncate">Add Member</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1a2632] border border-[#cfdbe7] dark:border-slate-700 shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/30 text-[#2b8cee]">
                                    <Wallet size={20} />
                                </div>
                                <p className="text-[#4c739a] text-sm font-medium uppercase tracking-wider">Total Spend</p>
                            </div>
                            <p className="text-[#0d141b] dark:text-white tracking-tight text-2xl font-bold mt-1">${(group.totalSpend || 0).toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1a2632] border border-[#cfdbe7] dark:border-slate-700 shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                                    <Landmark size={20} />
                                </div>
                                <p className="text-[#4c739a] text-sm font-medium uppercase tracking-wider">Your Balance</p>
                            </div>
                            <p className="text-[#0d141b] dark:text-white tracking-tight text-2xl font-bold mt-1">
                                {myBalance >= 0 ? `+$${myBalance.toFixed(2)}` : `-$${Math.abs(myBalance).toFixed(2)}`}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1a2632] border border-[#cfdbe7] dark:border-slate-700 shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600">
                                    <CheckCircle2 size={20} />
                                </div>
                                <p className="text-[#4c739a] text-sm font-medium uppercase tracking-wider">Settled Members</p>
                            </div>
                            <div className="flex items-end gap-2 mt-1">
                                <p className="text-[#0d141b] dark:text-white tracking-tight text-2xl font-bold">{settledCount}</p>
                                <p className="text-[#4c739a] text-sm font-medium mb-1.5">/ {group.members?.length || 0} Members</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-[#1a2632] p-2 rounded-xl border border-[#cfdbe7] dark:border-slate-700 shadow-sm">
                        <div className="flex w-full md:w-auto overflow-x-auto gap-2 p-1 no-scrollbar">
                            {['all', 'owes', 'owed', 'settled'].map(f => (
                                <button 
                                    key={f}
                                    onClick={() => setFilter(f as any)}
                                    className={`flex h-9 px-4 shrink-0 items-center justify-center rounded-lg transition-colors text-sm font-medium capitalize ${filter === f ? 'bg-[#e7edf3] dark:bg-slate-700 text-[#0d141b] dark:text-white' : 'text-[#4c739a] hover:bg-[#e7edf3] dark:hover:bg-slate-700'}`}
                                >
                                    {f === 'all' ? 'All Members' : f === 'owes' ? 'Owes Money' : f === 'owed' ? 'Owed Money' : 'Settled'}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-80">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#4c739a]">
                                <Search size={20} />
                            </div>
                            <input 
                                className="w-full h-10 pl-10 pr-4 text-sm bg-[#f6f7f8] dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#2b8cee] text-[#0d141b] dark:text-white placeholder-[#4c739a]" 
                                placeholder="Search by name or email..." 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-[#cfdbe7] dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#cfdbe7] dark:border-slate-700 bg-slate-50 dark:bg-[#23303d]">
                                        <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#4c739a]">Member</th>
                                        <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#4c739a] text-right">Contributed</th>
                                        <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#4c739a] text-right">Balance</th>
                                        <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#4c739a] text-center">Status</th>
                                        <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#4c739a] text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#cfdbe7] dark:divide-gray-800">
                                    {filteredMembers.map((member: any) => (
                                        <tr key={member.userId} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-slate-200 overflow-hidden text-xs">
                                                        {member.photoURL ? <img src={member.photoURL} alt={member.name} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-500 font-bold">{member.name[0]}</div>}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-semibold text-[#0d141b] dark:text-white">{member.name} {member.userId === user.uid && '(You)'}</p>
                                                        <p className="text-xs text-[#4c739a]">{member.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <p className="text-sm font-medium text-[#0d141b] dark:text-white">${(member.contributed || 0).toFixed(2)}</p>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex flex-col items-end">
                                                    <p className={`text-sm font-bold ${member.balance > 0 ? 'text-[#2b8cee]' : member.balance < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                        {member.balance > 0 ? `+$${member.balance.toFixed(2)}` : member.balance < 0 ? `-$${Math.abs(member.balance).toFixed(2)}` : '$0.00'}
                                                    </p>
                                                    <p className="text-[10px] text-[#4c739a]">
                                                        {member.balance > 0 ? 'Gets back' : member.balance < 0 ? 'Owes' : 'Settled'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${Math.abs(member.balance) < 0.01 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                                                    {Math.abs(member.balance) < 0.01 ? 'Settled' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button className="text-[#4c739a] hover:text-[#2b8cee] transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                                                    <MoreVertical size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between px-6 py-4 border-t border-[#cfdbe7] dark:border-slate-700 bg-slate-50 dark:bg-[#1a2634]">
                            <p className="text-sm text-[#4c739a]">Showing <span className="font-medium text-[#0d141b] dark:text-white">1</span> to <span className="font-medium text-[#0d141b] dark:text-white">{filteredMembers.length}</span> of <span className="font-medium text-[#0d141b] dark:text-white">{group.members?.length}</span> results</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 rounded border border-[#cfdbe7] dark:border-slate-700 text-sm font-medium text-[#4c739a] disabled:opacity-50 hover:bg-white dark:hover:bg-slate-700 transition-colors" disabled>Previous</button>
                                <button className="px-3 py-1 rounded border border-[#cfdbe7] dark:border-slate-700 text-sm font-medium text-[#0d141b] dark:text-white hover:bg-white dark:hover:bg-slate-700 transition-colors">Next</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
       </main>
    </div>
  );
}
