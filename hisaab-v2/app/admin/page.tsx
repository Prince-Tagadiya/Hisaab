'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { auth } from '../../lib/firebaseClient';
import { signInWithCustomToken } from 'firebase/auth';
import { Shield, User as UserIcon, LogIn, Trash2, ArrowRight, Lock, Key } from 'lucide-react';

export default function AdminPage() {
  const { user, loading, getIdToken, signOut } = useAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [impersonating, setImpersonating] = useState<string | null>(null);
  
  // Master Key Auth State
  const [masterKey, setMasterKey] = useState('');
  const [isMasterAuthenticated, setIsMasterAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState('');

  // Check LocalStorage for key
  useEffect(() => {
     const stored = localStorage.getItem('hisaab_admin_key');
     if (stored) {
         setMasterKey(stored);
         setIsMasterAuthenticated(true);
     }
  }, []);

  // Fetch Users if authenticated (either by User or Master Key)
  useEffect(() => {
    if (user || isMasterAuthenticated) {
        fetchUsers();
    }
  }, [user, isMasterAuthenticated]);

  const handleMasterLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setMasterKey(keyInput);
      setIsMasterAuthenticated(true);
      localStorage.setItem('hisaab_admin_key', keyInput);
  };

  const getHeaders = async () => {
     const headers: any = {};
     if (user) {
         const token = await getIdToken();
         headers['Authorization'] = `Bearer ${token}`;
     }
     if (isMasterAuthenticated) {
         headers['x-admin-key'] = masterKey || localStorage.getItem('hisaab_admin_key');
     }
     return headers;
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const headers = await getHeaders();
      const res = await fetch('/api/admin/users', { headers });
      
      if (res.status === 401) {
          if (isMasterAuthenticated) {
              alert("Invalid Master Key");
              setIsMasterAuthenticated(false);
              localStorage.removeItem('hisaab_admin_key');
          }
          return;
      }

      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImpersonate = async (targetUid: string) => {
    if (!confirm("Are you sure you want to log in as this user?")) return;
    setImpersonating(targetUid);
    try {
       const headers = await getHeaders();
       headers['Content-Type'] = 'application/json';

       // 1. Get Custom Token
       // Note: If using Master Key, this works. If using User Token (that allows admin), works too.
       const res = await fetch('/api/admin/impersonate', {
           method: 'POST',
           headers,
           body: JSON.stringify({ targetUid })
       });
       const data = await res.json();
       if (data.error) throw new Error(data.error);

       // 2. Sign In
       // MUST signOut first to clear current master/auth state clashing
       await auth.signOut();
       await signInWithCustomToken(auth, data.customToken);
       
       // 3. Redirect
       router.push('/dashboard');
    } catch (e: any) {
       console.error("Impersonation Error:", e);
       alert("Impersonation failed: " + e.message);
    } finally {
       setImpersonating(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  // Render Login if not authenticated
  if (!user && !isMasterAuthenticated) {
     return (
         <div className="min-h-screen bg-[#101922] flex items-center justify-center p-4">
             <div className="bg-[#1a242d] p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
                 <div className="flex justify-center mb-6 text-[#2b8cee]">
                     <Shield size={48} />
                 </div>
                 <h1 className="text-2xl font-bold text-white text-center mb-2">Master Panel</h1>
                 <p className="text-slate-400 text-center mb-8">Access system administration without a user account.</p>
                 
                 <form onSubmit={handleMasterLogin} className="space-y-4">
                     <div>
                         <label className="text-sm font-semibold text-slate-300 block mb-2">Master Key</label>
                         <div className="relative">
                             <span className="absolute left-3 top-3 text-slate-500">
                                 <Key size={20} />
                             </span>
                             <input 
                                type="password" 
                                value={keyInput}
                                onChange={e => setKeyInput(e.target.value)}
                                className="w-full h-12 rounded-xl bg-[#0d141b] border border-slate-700 text-white pl-10 pr-4 focus:outline-none focus:border-[#2b8cee] transition-all"
                                placeholder="Enter admin secret..."
                             />
                         </div>
                     </div>
                     <button type="submit" className="w-full h-12 bg-[#2b8cee] hover:bg-blue-600 text-white font-bold rounded-xl transition-all">
                         Access Panel
                     </button>
                 </form>
             </div>
         </div>
     );
  }

  return (
    <div className="flex h-screen bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white transition-colors">
       {user && (
           <aside className="hidden md:flex w-64 bg-white dark:bg-[#1a242d] border-r border-slate-200 dark:border-slate-800">
              <Sidebar onLogout={signOut} onCreateGroup={() => {}} onJoinGroup={() => {}} onAddFriend={() => {}} />
           </aside>
       )}
       
       <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
             <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                     <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                         <Shield size={32} />
                     </div>
                     <div>
                         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                         <p className="text-slate-500 dark:text-slate-400">
                             {user ? `Logged in as ${user.email}` : 'Signed in via Master Key'}
                         </p>
                     </div>
                 </div>
                 <div className="flex gap-3">
                    {!user && (
                        <button 
                            onClick={() => {
                                localStorage.removeItem('hisaab_admin_key');
                                setIsMasterAuthenticated(false);
                            }}
                            className="text-slate-500 hover:text-white px-4 py-2"
                        >
                            Logout
                        </button>
                    )}
                    <button 
                    onClick={() => router.push('/reset')}
                    className="flex items-center gap-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium"
                    >
                        <Trash2 size={18} />
                        <span>Go to Reset Tool</span>
                        <ArrowRight size={18} />
                    </button>
                 </div>
             </div>

             <div className="bg-white dark:bg-[#1a242d] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                 <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                     <h2 className="text-lg font-bold">Registered Users ({users.length})</h2>
                 </div>
                 
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Username</th>
                                <th className="px-6 py-4 font-semibold">Registered</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${u.photoURL})` }}>
                                                {!u.photoURL && <UserIcon className="m-auto mt-2 text-slate-400" size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{u.displayName || u.firstName}</p>
                                                <p className="text-xs text-slate-500">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                        @{u.username || '—'}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        { (!user || u.email !== user.email) && (
                                            <button 
                                                onClick={() => handleImpersonate(u.firebaseUid)}
                                                disabled={!!impersonating}
                                                className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
                                            >
                                                {impersonating === u.firebaseUid ? (
                                                    <span>Switching...</span>
                                                ) : (
                                                    <>
                                                        <LogIn size={16} />
                                                        <span>Login as</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        { (user && u.email === user.email) && (
                                            <span className="text-slate-400 text-xs font-semibold px-3 py-1.5">YOU</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        {isMasterAuthenticated ? 'No users found or key invalid.' : 'No users found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                 </div>
             </div>
          </div>
       </main>
    </div>
  );
}
