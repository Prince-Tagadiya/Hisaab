import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserGroups, createGroup, joinGroup } from '../services/groupService';
import { getGroupBalances } from '../services/expenseService';
import { getUserFriends } from '../services/friendService';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Users, Menu, Bell, ArrowUpRight, ArrowDownLeft, Umbrella, Home, Briefcase, Utensils, LogOut, X, Receipt, LayoutDashboard, UserCircle, Settings } from 'lucide-react';
import AddFriendModal from '../components/AddFriendModal';

import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ owe: 0, owed: 0 });
  
  // Modals & Navigation State
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false); 
  
  // Form States
  const [newGroupName, setNewGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  
  const loadData = useCallback(async () => {
    try {
      // 1. Load Groups & Balances
      const g = await getUserGroups(currentUser.uid);
      
      let totalOwe = 0;
      let totalOwed = 0;
      
      const groupsWithBalances = await Promise.all(g.map(async (grp) => {
          const bals = await getGroupBalances(grp.id);
          const myBal = bals[currentUser.uid] || 0;
          
          if (myBal > 0) totalOwed += myBal;
          if (myBal < 0) totalOwe += Math.abs(myBal);
          
          return { ...grp, myBalance: myBal };
      }));
      
      setSummary({ owe: totalOwe, owed: totalOwed });
      setGroups(groupsWithBalances);

      // 2. Load Friends
      const f = await getUserFriends(currentUser.uid);
      setFriends(f);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser.uid]);

  // Handlers
  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      await createGroup(newGroupName, currentUser);
      setNewGroupName("");
      setShowCreate(false);
      loadData();
    } catch (error) {
       alert(error.message);
    }
  }

  async function handleJoin(e) {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    try {
      await joinGroup(inviteCode.trim(), currentUser);
      setInviteCode("");
      setShowJoin(false);
      loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex">

      {/* Desktop Sidebar (Pinned) */}
      <aside className="hidden lg:flex w-[280px] bg-white border-r border-slate-100 flex-col fixed inset-y-0 z-30">
        <Sidebar 
            onLogout={logout} 
            onCreateGroup={() => setShowCreate(true)} 
            onJoinGroup={() => setShowJoin(true)} 
            onAddFriend={() => setShowAddFriend(true)}
        />
      </aside>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden pointer-events-none ${showMobileMenu ? 'pointer-events-auto' : ''}`}>
        {/* Backdrop */}
        <div 
            className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${showMobileMenu ? 'opacity-100' : 'opacity-0'}`} 
            onClick={() => setShowMobileMenu(false)}
        ></div>
        {/* Drawer */}
        <div className={`absolute top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl transition-transform duration-300 ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar 
            onLogout={logout} 
            onCreateGroup={() => setShowCreate(true)} 
            onJoinGroup={() => setShowJoin(true)} 
            onAddFriend={() => setShowAddFriend(true)}
            mobileOpen={showMobileMenu}
            setMobileOpen={setShowMobileMenu}
          />
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[280px] transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-20 w-full bg-[#FAFBFF]/80 backdrop-blur-xl border-b border-transparent lg:border-slate-100/50 px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button 
                    type="button"
                    onClick={() => setShowMobileMenu(true)}
                    className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
                {/* Branding visible only on mobile via header (Sidebar handles desktop) */}
                <div className="lg:hidden flex items-center gap-2">
                    <div className="size-8 bg-[#2b8cee] rounded-lg flex items-center justify-center text-white">
                        <div className="size-3 border-[2px] border-white rounded-sm"></div>
                    </div>
                    <span className="font-bold text-slate-900 text-lg tracking-tight">Hisaab</span>
                </div>
                {/* Page Title (Desktop only) */}
                <h2 className="hidden lg:block text-xl font-bold text-slate-800">Overview</h2>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-[#2b8cee] hover:bg-[#2b8cee]/5 rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <Link to="/profile" className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                    <span className="hidden md:block text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                        {userProfile?.firstName || "User"}
                    </span>
                    <div className="size-9 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden text-slate-400 flex items-center justify-center">
                         {currentUser.photoURL ? 
                            <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" /> :
                            <UserCircle size={24} />
                         }
                    </div>
                </Link>
            </div>
        </header>

        {/* Inner Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
           
           {/* Greeting Card */}
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                   <h1 className="text-3xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                       {getGreeting()}, <span className="text-[#2b8cee]">{userProfile?.firstName || "Friend"}</span> <span className="inline-block animate-wave">👋</span>
                   </h1>
                   <p className="text-slate-500 font-medium">Here's what's happening with your expenses.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowCreate(true)} className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#2b8cee] text-white font-bold rounded-xl shadow-lg shadow-[#2b8cee]/20 hover:bg-[#2b8cee]/90 active:scale-95 transition-all">
                        <Plus size={20} /> <span>New Expense</span>
                    </button>
                </div>
           </div>

           {/* Money Summary */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                             <ArrowUpRight size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">You Owe</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 mb-1">
                        ₹{summary.owe.toLocaleString()}
                    </div>
                    <p className="text-sm text-slate-500 font-medium">To {Object.keys(summary).length} people</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 text-green-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                             <ArrowDownLeft size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Owed to You</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 mb-1">
                        ₹{summary.owed.toLocaleString()}
                    </div>
                    <p className="text-sm text-slate-500 font-medium">From {friends.length} friends</p>
                </div>
           </div>

           {/* Groups Section */}
           <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Your Groups</h3>
                    <button className="text-sm font-bold text-[#2b8cee] hover:text-[#2b8cee]/80">View All</button>
                </div>

                {loading ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>)}
                   </div>
                ) : groups.length === 0 ? (
                    /* IMPROVED EMPTY STATE */
                    <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center hover:border-[#2b8cee]/30 transition-colors group">
                        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#2b8cee]/10 group-hover:text-[#2b8cee] transition-all duration-300">
                             <Users size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No groups yet</h3>
                        <p className="text-slate-500 mb-8 max-w-md font-medium leading-relaxed">
                            Groups are the best way to track shared expenses for trips, housemates, or projects. Create one or ask for an invite code!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button 
                                onClick={() => setShowCreate(true)} 
                                className="px-6 py-3 bg-[#2b8cee] text-white font-bold rounded-xl shadow-lg shadow-[#2b8cee]/20 hover:bg-[#2b8cee]/90 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Plus size={20} /> Create Group
                            </button>
                            <button 
                                onClick={() => setShowJoin(true)} 
                                className="px-6 py-3 bg-white text-slate-700 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <ArrowDownLeft size={20} /> Join Group
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.map((group, idx) => (
                          <Link key={group.id} to={`/group/${group.id}`} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                              <div className="flex justify-between items-start mb-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${getGroupIconColor(idx)} shadow-lg shadow-black/5`}>
                                      {getGroupIcon(idx)}
                                  </div>
                                  <div className="flex flex-col items-end">
                                      {group.myBalance < 0 ? <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-bold">You owe ₹{Math.abs(group.myBalance).toFixed(0)}</span> : 
                                       group.myBalance > 0 ? <span className="px-2.5 py-1 rounded-lg bg-green-50 text-green-600 text-xs font-bold">Owed ₹{group.myBalance.toFixed(0)}</span> : 
                                       <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold">Settled</span>}
                                  </div>
                              </div>
                              <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-[#2b8cee] transition-colors">{group.name}</h4>
                              <div className="flex items-center text-slate-400 text-sm font-medium gap-2">
                                  <span className="flex items-center gap-1"><Users size={14}/> {group.memberCount} members</span>
                              </div>
                          </Link>
                        ))}
                    </div>
                )}
           </section>

           {/* Friends Section */}
           <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Friends</h3>
                    <button className="text-sm font-bold text-[#2b8cee] hover:text-[#2b8cee]/80" onClick={() => setShowAddFriend(true)}>Add Friend</button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {/* Add Friend Card */}
                    <button 
                        onClick={() => setShowAddFriend(true)}
                        className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-[#2b8cee]/5 hover:border-[#2b8cee]/30 hover:text-[#2b8cee] transition-all group"
                    >
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm mb-3 group-hover:scale-110 group-hover:text-[#2b8cee] transition-transform">
                             <Plus size={24} />
                        </div>
                        <span className="font-bold text-sm">Add Friend</span>
                    </button>

                    {friends.map(friend => (
                        <div key={friend.uid} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                             <div className="w-14 h-14 rounded-full bg-slate-100 mb-3 overflow-hidden border-2 border-white shadow-sm">
                                 {friend.photoURL ? 
                                    <img src={friend.photoURL} alt={friend.name} className="w-full h-full object-cover"/> : 
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg">{friend.name?.[0]}</div>
                                 }
                             </div>
                             <h4 className="font-bold text-slate-900 text-sm mb-1 truncate w-full">{friend.name}</h4>
                             <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">Friend</span>
                        </div>
                    ))}
                </div>
           </section>

        </main>
      </div>

      {/* Floating Action Button (Mobile Only) */}
      <button 
        onClick={() => setShowCreate(true)}
        className="md:hidden fixed bottom-6 right-6 px-5 py-3 bg-[#2b8cee] text-white font-bold rounded-full shadow-xl shadow-[#2b8cee]/30 flex items-center gap-2 z-40 active:scale-95 transition-transform"
      >
          <Plus size={24} /> <span className="text-sm">New</span>
      </button>

      {/* --- MODALS --- */}
      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} onAction={handleCreate} name={newGroupName} setName={setNewGroupName} />}
      {showJoin && <JoinGroupModal onClose={() => setShowJoin(false)} onAction={handleJoin} code={inviteCode} setCode={setInviteCode} />}
      {showAddFriend && <AddFriendModal currentUser={currentUser} onClose={() => setShowAddFriend(false)} onAdded={loadData} />}
    </div>
  );
}

// Helpers
function getGroupIcon(idx) {
    const icons = [<Umbrella size={24}/>, <Home size={24}/>, <Utensils size={24}/>, <Briefcase size={24}/>];
    return icons[idx % icons.length];
}
function getGroupIconColor(idx) {
    const colors = ['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500'];
    return colors[idx % colors.length];
}

// Simple Components for Modals
const CreateGroupModal = ({ onClose, onAction, name, setName }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">New Group</h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={onAction} className="space-y-4">
                <div className="relative">
                    <input 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-semibold outline-none focus:bg-white focus:border-[#2b8cee] focus:ring-4 focus:ring-[#2b8cee]/10 transition-all" 
                        placeholder="Group Name (e.g. Trip to Goa)" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        autoFocus 
                    />
                </div>
                <button className="w-full py-3.5 bg-[#2b8cee] text-white font-bold rounded-xl shadow-lg shadow-[#2b8cee]/20 hover:bg-[#2b8cee]/90 active:scale-95 transition-all">
                    Create Group
                </button>
            </form>
        </div>
    </div>
);

const JoinGroupModal = ({ onClose, onAction, code, setCode }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Join Group</h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={onAction} className="space-y-4">
                <p className="text-sm text-slate-500 font-medium">Enter the 6-character code shared with you.</p>
                <div className="relative">
                    <input 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-center text-2xl uppercase tracking-[0.2em] font-bold outline-none focus:bg-white focus:border-[#2b8cee] focus:ring-4 focus:ring-[#2b8cee]/10 transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-base placeholder:font-medium" 
                        placeholder="Invite Code" 
                        maxLength={6} 
                        value={code} 
                        onChange={e => setCode(e.target.value.toUpperCase())} 
                        autoFocus 
                    />
                </div>
                <button className="w-full py-3.5 bg-[#2b8cee] text-white font-bold rounded-xl shadow-lg shadow-[#2b8cee]/20 hover:bg-[#2b8cee]/90 active:scale-95 transition-all">
                    Join Group
                </button>
            </form>
        </div>
    </div>
);
