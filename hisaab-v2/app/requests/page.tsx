'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { Check, X, Bell, UserPlus, Users, Home, Plane, Ticket, User } from 'lucide-react';

export default function RequestsPage() {
  const { user, loading, getIdToken, signOut } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'groups' | 'friends'>('groups');
  
  // Modal States
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const gradients = [
    'bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-300 via-violet-600 to-indigo-600',
    'bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-blue-600 to-violet-800',
    'bg-[col-start-1_row-start-1] bg-[linear-gradient(45deg,theme(colors.purple.500),theme(colors.pink.500)_50%,theme(colors.yellow.500)_100%)]',
    'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-300 via-teal-500 to-purple-600',
    'bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-200 via-red-500 to-purple-800',
    'bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-200 via-violet-600 to-sky-900',
    'bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-violet-600'
  ];
  
  const getGradient = (name: string) => {
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) hash = (name || '').charCodeAt(i) + ((hash << 5) - hash);
    return gradients[Math.abs(hash) % gradients.length];
  };

  const getRotation = (name: string) => {
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) hash = (name || '').charCodeAt(i) + ((hash << 5) - hash);
    return (Math.abs(hash) % 10) - 5; // -5 to 4 degrees
  };

  useEffect(() => {
    if (user) {
        fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
      try {
          const token = await getIdToken();
          const res = await fetch('/api/requests', {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) {
            setRequests(data.requests || []);
          }
      } catch (e) {
          console.error("Failed to fetch requests", e);
      } finally {
          setIsLoading(false);
      }
  };

  const handleAction = async (requestId: string, action: 'accept' | 'decline') => {
      setProcessingId(requestId);
      try {
        const token = await getIdToken();
        const res = await fetch(`/api/requests/${requestId}`, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action })
        });
        
        if (res.ok) {
            setRequests(prev => prev.filter(r => r._id !== requestId));
        }
      } catch (e) {
        console.error("Action failed", e);
      } finally {
        setProcessingId(null);
      }
  };

  const handleJoinGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setIsSubmitting(true);
    setFormError(null);
    try {
        const token = await getIdToken();
        const res = await fetch('/api/groups/join', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ joinCode })
        });
        const data = await res.json();
        if (res.ok) {
            setShowJoinModal(false);
            setJoinCode('');
            router.push(`/group/${data.groupId}`);
        } else {
            setFormError(data.error || 'Failed to join group');
        }
    } catch (err) {
        setFormError('Something went wrong');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleFriendRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendEmail.trim()) return;
    setIsSubmitting(true);
    setFormError(null);
    try {
        const token = await getIdToken();
        const res = await fetch('/api/requests', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ type: 'friend', toEmail: friendEmail })
        });
        const data = await res.json();
        if (res.ok) {
            setShowFriendModal(false);
            setFriendEmail('');
            alert('Friend request sent!');
        } else {
            setFormError(data.error || 'Failed to send request');
        }
    } catch (err) {
        setFormError('Something went wrong');
    } finally {
        setIsSubmitting(false);
    }
  };

  // Debounced search for users
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const token = await getIdToken();
          const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) {
            setSearchResults(data.users || []);
          }
        } catch (err) {
          console.error('Search failed', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectUser = (selectedUser: any) => {
    setFriendEmail(selectedUser.email);
    setSearchQuery('');
    setSearchResults([]);
  };

  const groupRequests = requests.filter(r => r.type === 'group_invite');
  const friendRequests = requests.filter(r => r.type === 'friend');

  if (loading) return <div>Loading...</div>;
  if (!user) {
      if (typeof window !== 'undefined') router.push('/');
      return null;
  }

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
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div>
                             <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Pending Invitations</h1>
                             <p className="text-xs text-slate-500 dark:text-slate-400">You have {requests.length} pending requests</p>
                        </div>
                    </div>
                    <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-600">
                             <img src={user?.photoURL || ''} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 md:px-10 py-8 scroll-smooth">
                <div className="max-w-[1280px] mx-auto w-full">
                    
                    {/* Tabs */}
                    {/* Tabs & Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-slate-700 mb-8 gap-4">
                        <div className="flex gap-8">
                            <button 
                                onClick={() => setActiveTab('groups')}
                                className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === 'groups' ? 'text-[#2b8cee]' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                            >
                                Group Invitations
                                {groupRequests.length > 0 && <span className="ml-2 bg-[#2b8cee] text-white text-[10px] px-1.5 py-0.5 rounded-full">{groupRequests.length}</span>}
                                {activeTab === 'groups' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2b8cee] rounded-t-full"></div>}
                            </button>
                            <button 
                                onClick={() => setActiveTab('friends')}
                                className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === 'friends' ? 'text-[#2b8cee]' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                            >
                                Friend Requests
                                {friendRequests.length > 0 && <span className="ml-2 bg-[#2b8cee] text-white text-[10px] px-1.5 py-0.5 rounded-full">{friendRequests.length}</span>}
                                {activeTab === 'friends' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2b8cee] rounded-t-full"></div>}
                            </button>
                        </div>
                        <div className="flex gap-3 pb-2">
                             <button 
                                onClick={() => setShowJoinModal(true)}
                                className="px-4 py-2 bg-[#2b8cee] hover:bg-[#1a6bbd] text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2"
                             >
                                <Ticket size={16} /> Join Group via Code
                             </button>
                             <button 
                                onClick={() => setShowFriendModal(true)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                             >
                                <UserPlus size={16} /> Add Friend
                             </button>
                        </div>
                    </div>

                    {/* Content */}
                    {activeTab === 'groups' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groupRequests.length === 0 ? (
                                <div className="col-span-full text-center py-20 text-slate-400">No group invitations.</div>
                            ) : (
                                groupRequests.map((req) => (
                                    <div key={req._id} className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                                        {/* Group Card Design (Full Image) */}
                                        <div className="h-40 bg-slate-200 relative bg-cover bg-center" style={{ backgroundImage: req.groupIcon ? `url(${req.groupIcon})` : 'none' }}>
                                            {!req.groupIcon && (
                                                <>
                                                    <div className={`w-full h-full ${getGradient(req.groupName)}`} />
                                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                                        <h3 
                                                            className="text-4xl font-black text-white text-center leading-none tracking-tighter break-words line-clamp-2 uppercase drop-shadow-lg"
                                                            style={{ 
                                                                transform: `rotate(${getRotation(req.groupName)}deg) scale(1.1)`,
                                                                textShadow: '4px 4px 0px rgba(0,0,0,0.2)'
                                                            }}
                                                        >
                                                            {req.groupName}
                                                        </h3>
                                                    </div>
                                                </>
                                            )}
                                            <div className="absolute inset-0 bg-black/20"></div>
                                            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">
                                                Group
                                            </div>
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{req.groupName}</h3>
                                                <p className="text-white/80 text-xs flex items-center gap-1">
                                                    <UserPlus size={12} />
                                                    Invited by {req.fromUser?.name || 'Someone'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-5 flex gap-3 mt-auto">
                                            <button 
                                                onClick={() => handleAction(req._id, 'decline')}
                                                disabled={processingId === req._id}
                                                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                Decline
                                            </button>
                                            <button 
                                                onClick={() => handleAction(req._id, 'accept')}
                                                disabled={processingId === req._id}
                                                className="flex-1 py-2.5 rounded-xl bg-[#2b8cee] hover:bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all"
                                            >
                                                {processingId === req._id ? 'Joining...' : 'Join Group'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {friendRequests.length === 0 ? (
                                <div className="col-span-full text-center py-20 text-slate-400">No friend requests.</div>
                            ) : (
                                friendRequests.map((req) => (
                                    <div key={req._id} className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col items-center text-center">
                                        {/* Friend Card Design (Pastel Banner + Avatar) */}
                                        <div className="w-full h-24 bg-gradient-to-r from-pink-100 to-blue-100 dark:from-slate-700 dark:to-slate-800"></div>
                                        <div className="-mt-12 mb-3 relative">
                                            <div className="size-24 rounded-full border-4 border-white dark:border-[#1a2632] overflow-hidden bg-slate-200 shadow-sm">
                                                 {req.fromUser?.photoURL ? (
                                                     <img src={req.fromUser.photoURL} className="w-full h-full object-cover" />
                                                 ) : (
                                                     <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-500 font-bold text-2xl">
                                                         {req.fromUser?.name?.charAt(0) || 'U'}
                                                     </div>
                                                 )}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{req.fromUser?.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{req.fromUser?.email}</p>
                                        
                                        <div className="w-full px-5 pb-6 flex gap-3">
                                            <button 
                                                onClick={() => handleAction(req._id, 'decline')}
                                                disabled={processingId === req._id}
                                                className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 transition-colors"
                                            >
                                                Delete
                                            </button>
                                            <button 
                                                onClick={() => handleAction(req._id, 'accept')}
                                                disabled={processingId === req._id}
                                                className="flex-1 py-2 rounded-lg bg-[#2b8cee] hover:bg-blue-600 text-white font-semibold text-sm shadow-md transition-all"
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                </div>
             </div>
       </main>

       {/* Join Group Modal */}
       {showJoinModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
               <div className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                   <div className="flex justify-between items-center mb-6">
                       <h3 className="text-xl font-bold text-slate-900 dark:text-white">Join Group</h3>
                       <button onClick={() => setShowJoinModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                           <X size={24} />
                       </button>
                   </div>
                   <form onSubmit={handleJoinGroupSubmit} className="space-y-4">
                       <div>
                           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Group Join Code</label>
                           <input 
                               type="text" 
                               value={joinCode}
                               onChange={(e) => setJoinCode(e.target.value)}
                               placeholder="e.g. A1B2C3"
                               className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2b8cee] outline-none uppercase tracking-widest font-mono text-center text-lg"
                               required
                           />
                       </div>
                       {formError && <p className="text-red-500 text-sm font-medium">{formError}</p>}
                       <button 
                           type="submit" 
                           disabled={isSubmitting}
                           className="w-full py-3 rounded-xl bg-[#2b8cee] hover:bg-[#1a6bbd] text-white font-bold transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
                       >
                           {isSubmitting ? 'Joining...' : 'Join Group'}
                       </button>
                   </form>
               </div>
           </div>
       )}

        {/* Add Friend Modal */}
        {showFriendModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Friend</h3>
                        <button onClick={() => { setShowFriendModal(false); setSearchQuery(''); setSearchResults([]); }} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                            <X size={24} />
                        </button>
                    </div>
                    
                    {/* Search Box */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Search by username or email</label>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Type to search..."
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2b8cee] outline-none"
                        />
                        {isSearching && <p className="text-xs text-slate-400 mt-2">Searching...</p>}
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="mb-4 max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                            {searchResults.map((user) => (
                                <button
                                    key={user.userId}
                                    onClick={() => handleSelectUser(user)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left border-b last:border-b-0 border-slate-100 dark:border-slate-700"
                                >
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold">
                                            {user.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                                        <p className="text-xs text-slate-500 truncate">@{user.username}</p>
                                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    <UserPlus size={18} className="text-[#2b8cee]" />
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                        <p className="text-sm text-slate-500 mb-4 text-center py-4">No users found</p>
                    )}

                    <form onSubmit={handleFriendRequestSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Or enter email directly</label>
                            <input 
                                type="email" 
                                value={friendEmail}
                                onChange={(e) => setFriendEmail(e.target.value)}
                                placeholder="friend@example.com"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2b8cee] outline-none"
                                required
                            />
                            <p className="text-xs text-slate-500 mt-2">We'll send them an invitation to connect.</p>
                        </div>
                        {formError && <p className="text-red-500 text-sm font-medium">{formError}</p>}
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full py-3 rounded-xl bg-[#2b8cee] hover:bg-[#1a6bbd] text-white font-bold transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Sending Request...' : 'Send Friend Request'}
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
