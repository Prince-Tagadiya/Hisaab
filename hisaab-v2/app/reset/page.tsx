'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { Trash2, AlertTriangle, Check, RefreshCw, ArrowLeft, Key } from 'lucide-react';

export default function ResetPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [resetUsers, setResetUsers] = useState(false);
  const [resetGroups, setResetGroups] = useState(false);
  const [resetExpenses, setResetExpenses] = useState(false);
  
  const [confirmText, setConfirmText] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Master Key Logic
  const [masterKey, setMasterKey] = useState('');
  const [isMasterAuthenticated, setIsMasterAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState('');

  useEffect(() => {
     const stored = localStorage.getItem('hisaab_admin_key');
     if (stored) {
         setMasterKey(stored);
         setIsMasterAuthenticated(true);
     }
  }, []);

  const handleMasterLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMasterKey(keyInput);
    setIsMasterAuthenticated(true);
    localStorage.setItem('hisaab_admin_key', keyInput);
  };

  const handleReset = async () => {
      if (confirmText !== 'DELETE') return;
      setIsResetting(true);
      
      let scope = 'none';
      if (resetUsers) scope = 'all';
      else if (resetGroups) scope = 'data';
      else if (resetExpenses) scope = 'transactions';

      if (scope === 'none') {
          setIsResetting(false);
          return;
      }

      try {
          const headers: any = { 'Content-Type': 'application/json' };
          
          if (user) {
              const token = await user.getIdToken();
              headers['Authorization'] = `Bearer ${token}`;
          }
          if (isMasterAuthenticated) {
              headers['x-admin-key'] = masterKey || localStorage.getItem('hisaab_admin_key');
          }

          const res = await fetch('/api/admin/reset', {
              method: 'POST',
              headers,
              body: JSON.stringify({ scope })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);

          setSuccessMsg(`Reset Successful. Deleted: ${data.stats.users} Users, ${data.stats.groups} Groups, ${data.stats.expenses} Transaction Records.`);
          setConfirmText('');
          
          if (resetUsers) {
              setTimeout(() => {
                window.location.href = '/';
              }, 3000);
          }
      } catch (e: any) {
          alert('Reset Failed: ' + e.message);
      } finally {
          setIsResetting(false);
      }
  };

  // Auth Handling
  if (loading) return <div>Loading...</div>;

  // If not User and not Master, show Master Login
  if (!user && !isMasterAuthenticated) {
     return (
         <div className="min-h-screen bg-[#101922] flex items-center justify-center p-4">
             <div className="bg-[#1a242d] p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
                 <div className="flex justify-center mb-6 text-red-500">
                     <Trash2 size={48} />
                 </div>
                 <h1 className="text-2xl font-bold text-white text-center mb-2">System Reset Tool</h1>
                 <p className="text-slate-400 text-center mb-8">Enter Master Key to access destructive actions.</p>
                 
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
                                className="w-full h-12 rounded-xl bg-[#0d141b] border border-slate-700 text-white pl-10 pr-4 focus:outline-none focus:border-red-500 transition-all"
                                placeholder="Enter admin secret..."
                             />
                         </div>
                     </div>
                     <button type="submit" className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all">
                         Authenticate
                     </button>
                 </form>
             </div>
         </div>
     );
  }

  return (
    <div className="flex h-screen bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white">
       {user && (
           <aside className="hidden md:flex w-64 bg-white dark:bg-[#1a242d] border-r border-slate-200 dark:border-slate-800">
              <Sidebar onLogout={() => {}} onCreateGroup={() => {}} onJoinGroup={() => {}} onAddFriend={() => {}} />
           </aside>
       )}

       <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
          <div className="max-w-xl w-full">
             
             <button 
               onClick={() => router.push('/admin')}
               className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors"
             >
                 <ArrowLeft size={20} />
                 <span>Back to Admin</span>
             </button>

             <div className="bg-white dark:bg-[#1a242d] rounded-2xl shadow-xl border border-red-100 dark:border-red-900/20 overflow-hidden">
                 <div className="p-8 pb-0 flex flex-col items-center text-center">
                     <div className="size-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
                         <Trash2 size={32} />
                     </div>
                     <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">System Reset</h1>
                     <p className="text-slate-500 dark:text-slate-400">
                         Select what data you want to permanently delete. <br/>
                         Authenticated as: <span className="text-slate-300 font-mono text-xs p-1 bg-slate-800 rounded">{user ? 'User' : 'Master Key'}</span>
                     </p>
                 </div>

                 <div className="p-8 space-y-4">
                     {/* Checkboxes same as before */}
                     <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${resetExpenses ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
                         <input 
                           type="checkbox" 
                           className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                           checked={resetExpenses}
                           onChange={(e) => {
                               setResetExpenses(e.target.checked);
                           }}
                         />
                         <div className="flex-1">
                             <div className="font-bold text-slate-900 dark:text-white">Clear Transactions</div>
                             <p className="text-sm text-slate-500">Deletes all spends, balances, logs, settlements, and nudges.</p>
                         </div>
                     </label>

                     <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${resetGroups ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
                         <input 
                           type="checkbox" 
                           className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                           checked={resetGroups}
                           onChange={(e) => {
                               setResetGroups(e.target.checked);
                               if (e.target.checked) setResetExpenses(true);
                           }}
                         />
                         <div className="flex-1">
                             <div className="font-bold text-slate-900 dark:text-white">Delete All Groups</div>
                             <p className="text-sm text-slate-500">Deletes all groups/memberships. Implies clearing transactions.</p>
                         </div>
                     </label>

                     <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${resetUsers ? 'border-red-600 bg-red-100 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                         <input 
                           type="checkbox" 
                           className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                           checked={resetUsers}
                           onChange={(e) => {
                               setResetUsers(e.target.checked);
                               if (e.target.checked) {
                                   setResetGroups(true);
                                   setResetExpenses(true);
                               }
                           }}
                         />
                         <div className="flex-1">
                             <div className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                                 <AlertTriangle size={18} />
                                 <span>Factory Reset (Delete Users)</span>
                             </div>
                             <p className="text-sm text-slate-500">Deletes EVERYTHING including registered user accounts. Database will be empty.</p>
                         </div>
                     </label>

                     {(resetExpenses || resetGroups || resetUsers) && (
                         <div className="mt-8 animate-in slide-in-from-bottom-2">
                             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                 Type <span className="font-mono text-red-500 font-bold">DELETE</span> to confirm
                             </label>
                             <input 
                               type="text" 
                               value={confirmText}
                               onChange={(e) => setConfirmText(e.target.value)}
                               className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 uppercase font-bold tracking-widest text-center focus:ring-2 focus:ring-red-500 outline-none"
                               placeholder="DELETE"
                             />
                             
                             <button 
                               onClick={handleReset}
                               disabled={confirmText !== 'DELETE' || isResetting}
                               className={`w-full mt-4 h-14 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${confirmText === 'DELETE' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'}`}
                             >
                                 {isResetting ? (
                                     <span>Resetting...</span>
                                 ) : (
                                     <>
                                         <Trash2 size={20} />
                                         <span>Confirm Reset</span>
                                     </>
                                 )}
                             </button>
                         </div>
                     )}

                     {successMsg && (
                         <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl flex items-center gap-3 border border-green-200 dark:border-green-900/50">
                             <Check size={24} />
                             <p className="text-sm font-medium">{successMsg}</p>
                         </div>
                     )}

                 </div>
             </div>
          </div>
       </main>
    </div>
  );
}
