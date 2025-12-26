import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Home, Plane, Calendar, User, Search, Bell, Menu, Plus, ArrowUpRight, CheckCircle, X, Users } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AddFriendModal from '../components/AddFriendModal';
import { createGroup, joinGroup, getUserGroupInvites, respondToGroupInvite } from '../services/groupService';
import { getIncomingFriendRequests, respondToFriendRequest } from '../services/friendService';
import { getDoc, doc } from 'firebase/firestore'; 
import { db } from '../firebase';

export default function RequestsPage() {
  const { currentUser, userProfile, logout } = useAuth();
  
  // Data State
  const [friendRequests, setFriendRequests] = useState([]);
  const [groupInvites, setGroupInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Navigation
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Forms
  const [newGroupName, setNewGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const loadRequests = useCallback(async () => {
    try {
        setLoading(true);
        // 1. Friend Requests
        const fReqs = await getIncomingFriendRequests(currentUser.uid);
        setFriendRequests(fReqs);

        // 2. Group Invites
        const gInvites = await getUserGroupInvites(currentUser.email);
        
        // Enrich Group Invites with Group Details (Image, Type)
        const enrichedInvites = await Promise.all(gInvites.map(async (invite) => {
            try {
                const gDoc = await getDoc(doc(db, "groups", invite.groupId));
                if (gDoc.exists()) {
                    return { ...invite, groupDetails: gDoc.data() };
                }
                return invite;
            } catch (e) {
                return invite;
            }
        }));
        setGroupInvites(enrichedInvites);

    } catch(err) {
        console.error("Error loading requests:", err);
    } finally {
        setLoading(false);
    }
  }, [currentUser.uid, currentUser.email]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  /* --- Handlers --- */

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      await createGroup(newGroupName, currentUser);
      setNewGroupName("");
      setShowCreate(false);
      // alert("Group Created!"); // Redirect?
    } catch (error) {
       alert(error.message);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    try {
      await joinGroup(inviteCode.trim(), currentUser);
      setInviteCode("");
      setShowJoin(false);
      // alert("Joined!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFriendResponse = async (req, action) => {
      try {
          await respondToFriendRequest(req, action);
          loadRequests(); // Refresh
      } catch (err) {
          alert(err.message);
      }
  };

  const handleGroupResponse = async (invite, action) => {
      try {
          await respondToGroupInvite(invite, action, currentUser);
          loadRequests();
      } catch (err) {
          alert(err.message);
      }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-[280px] bg-white border-r border-slate-100 flex-col fixed inset-y-0 z-30">
        <Sidebar 
            onLogout={logout} 
            onCreateGroup={() => setShowCreate(true)} 
            onJoinGroup={() => setShowJoin(true)} 
            onAddFriend={() => setShowAddFriend(true)}
        />
      </aside>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden pointer-events-none ${showMobileMenu ? 'pointer-events-auto' : ''}`}>
        <div 
            className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${showMobileMenu ? 'opacity-100' : 'opacity-0'}`} 
            onClick={() => setShowMobileMenu(false)}
        ></div>
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

      {/* Main Content */}
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
               <h2 className="text-xl font-bold text-slate-800">Requests</h2>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="size-9 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden text-slate-400 flex items-center justify-center">
                   {currentUser.photoURL ? 
                      <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" /> :
                      <User size={24} />
                   }
              </div>
           </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-12">
            
            {/* 1. Group Invitations */}
            <section>
                <div className="flex items-center justify-between gap-2 mb-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Group Requests</h1>
                        <p className="text-slate-500">
                             {groupInvites.length === 0 ? "No pending group invitations." : `You have ${groupInvites.length} pending group requests.`}
                        </p>
                    </div>
                </div>
                
                {groupInvites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {groupInvites.map(invite => (
                        <div key={invite.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                            <div className="relative h-48 w-full overflow-hidden bg-slate-200">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                                {/* Placeholder Image since we don't handle group images yet deeply */}
                                <img src={`https://source.unsplash.com/random/800x600/?house,trip&sig=${invite.groupId}`} alt="Group" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute bottom-4 left-4 z-20">
                                    <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm ring-1 ring-inset ring-white/30">
                                        {invite.groupDetails?.type || 'Group'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{invite.groupName}</h3>
                                        <div className="mt-1 flex items-center gap-2">
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
                                                {invite.fromName?.[0]}
                                            </div>
                                            <p className="text-sm text-slate-500">Invited by {invite.fromName}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-auto grid grid-cols-2 gap-3">
                                    <button onClick={() => handleGroupResponse(invite, 'declined')} className="flex items-center justify-center rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-red-500 transition-colors">Decline</button>
                                    <button onClick={() => handleGroupResponse(invite, 'accepted')} className="flex items-center justify-center rounded-lg bg-[#2b8cee] py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/30 hover:bg-[#2b8cee]/90 transition-colors">Join Group</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                        <div className="p-4 bg-slate-50 rounded-full mb-4 text-slate-300">
                            <Users size={32} />
                        </div>
                        <p className="text-slate-500 font-medium">You're all caught up! No group invites.</p>
                    </div>
                )}
            </section>

            <div className="h-px bg-slate-200 w-full"></div>

            {/* 2. Friend Requests */}
            <section>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Friend Requests</h1>
                        <p className="text-slate-500">
                            {friendRequests.length === 0 ? "No new connection requests." : "Manage your incoming connection requests."}
                        </p>
                    </div>
                </div>

                {friendRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {friendRequests.map(req => (
                        <div key={req.id} className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all">
                            {/* Deterministic Gradient based on UID */}
                            <div className={`h-24 bg-gradient-to-r relative ${req.fromUid.charCodeAt(0) % 2 === 0 ? 'from-blue-50 to-indigo-50' : 'from-purple-50 to-pink-50'}`}></div>
                            <div className="px-5 pb-5 flex flex-col items-center -mt-12 flex-1 relative z-10">
                                <div className="size-24 rounded-full border-4 border-white shadow-sm bg-slate-200 overflow-hidden text-slate-400 flex items-center justify-center text-xl font-bold">
                                    {req.fromPhotoURL ? 
                                        <img src={req.fromPhotoURL} alt={req.fromName} className="w-full h-full object-cover" /> :
                                        req.fromName?.[0]
                                    }
                                </div>
                                <div className="flex flex-col items-center mt-3 text-center w-full">
                                    <h3 className="text-slate-900 text-lg font-bold leading-tight">{req.fromName}</h3>
                                    <p className="text-slate-500 text-sm mt-1">{req.fromEmail}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 w-full mt-6">
                                    <button onClick={() => handleFriendResponse(req, 'declined')} className="flex items-center justify-center h-10 rounded-lg bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200 transition-colors">Delete</button>
                                    <button onClick={() => handleFriendResponse(req, 'accepted')} className="flex items-center justify-center h-10 rounded-lg bg-[#2b8cee] text-white font-medium text-sm hover:bg-[#2b8cee]/90 transition-colors shadow-sm shadow-blue-200">Confirm</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                        <div className="p-4 bg-slate-50 rounded-full mb-4 text-slate-300">
                            <User size={32} />
                        </div>
                        <p className="text-slate-500 font-medium">No pending friend requests.</p>
                        <button onClick={() => setShowAddFriend(true)} className="mt-4 text-[#2b8cee] font-bold hover:underline">Find new friends</button>
                    </div>
                )}
            </section>

        </main>
      </div>

       {/* --- MODALS --- */}
       {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} onAction={handleCreate} name={newGroupName} setName={setNewGroupName} />}
       {showJoin && <JoinGroupModal onClose={() => setShowJoin(false)} onAction={handleJoin} code={inviteCode} setCode={setInviteCode} />}
       {showAddFriend && <AddFriendModal currentUser={currentUser} onClose={() => setShowAddFriend(false)} onAdded={loadRequests} />}
    </div>
  );
}

// Reuse Simple Components
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
