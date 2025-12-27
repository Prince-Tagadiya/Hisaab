'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { Check, X, Bell, UserPlus, Users } from 'lucide-react';

export default function RequestsPage() {
  const { user, loading, getIdToken, signOut } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

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
            // Remove from list or update status
            setRequests(prev => prev.filter(r => r._id !== requestId));
            if (action === 'accept') {
                // Optionally redirect to the new group
                // But bulk accept is better UX, so just stay here.
            }
        }
      } catch (e) {
        console.error("Action failed", e);
      } finally {
        setProcessingId(null);
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

       {/* Overlay */}
       {mobileOpen && (
         <div 
           className="fixed inset-0 bg-black/50 z-40 md:hidden"
           onClick={() => setMobileOpen(false)}
         />
       )}

       <main className="flex-1 flex flex-col overflow-hidden w-full">
            {/* Header */}
            <header className="sticky top-0 z-30 w-full bg-white dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-800 shadow-sm flex-none">
                <div className="px-6 lg:px-10 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                            onClick={() => setMobileOpen(true)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Invitations</h1>
                    </div>
                    {/* User Profile */}
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
            </header>

            {/* List */}
             <div className="flex-1 overflow-y-auto px-4 md:px-10 py-8 scroll-smooth">
                <div className="max-w-[1024px] mx-auto w-full">
                    {requests.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full text-slate-400 mb-4">
                                <Bell size={48} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">No pending invitations</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">You're all caught up!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {requests.map((req) => (
                                <div key={req._id} className="relative bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                     {/* Banner / Background */}
                                    <div className="h-28 bg-gradient-to-r from-[#2b8cee] to-purple-600 relative">
                                        <div className="absolute inset-0 bg-black/10"></div>
                                        <div className="absolute -bottom-6 left-6">
                                            <div className="size-16 rounded-xl bg-white dark:bg-[#1a2632] p-1 shadow-lg">
                                                <div className="w-full h-full rounded-lg bg-[#f0f4f8] dark:bg-slate-700 flex items-center justify-center text-[#2b8cee]">
                                                    <Users size={32} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-10 pb-6 px-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{req.groupName}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                                    <UserPlus size={14} />
                                                    Invited by <span className="font-medium text-slate-800 dark:text-slate-200">{req.fromUser?.name || 'Someone'}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mt-4">
                                            <button 
                                                onClick={() => handleAction(req._id, 'accept')}
                                                disabled={processingId === req._id}
                                                className="flex-1 h-10 bg-[#2b8cee] hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                                            >
                                                {processingId === req._id ? '...' : (
                                                    <>
                                                        <Check size={18} /> Accept
                                                    </>
                                                )}
                                            </button>
                                            <button 
                                                onClick={() => handleAction(req._id, 'decline')}
                                                disabled={processingId === req._id}
                                                className="flex-1 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                                            >
                                                <X size={18} /> Decline
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
             </div>
       </main>
    </div>
  );
}
