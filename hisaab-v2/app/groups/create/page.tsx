'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthContext'; 
import Sidebar from '../../../components/Sidebar';
import { 
  ArrowLeft, 
  Camera, 
  ChevronDown, 
  Search, 
  Plus, 
  X, 
  ArrowRight, 
  Menu,
  Check,
  Link as LinkIcon,
  UserPlus,
  Loader2
} from 'lucide-react';

export default function CreateGroupPage() {
  const { user, loading, getIdToken } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form State
  const [groupName, setGroupName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false);
  
  const [members, setMembers] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const token = await getIdToken();
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        // Filter out already added members
        const filtered = (data.users || []).filter((u: any) => 
            !members.find(m => m.email === u.email) && u.email !== user?.email
        );
        setSearchResults(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, members, user, getIdToken]);

  const addMember = (userToAdd: any) => {
    setMembers([...members, {
        name: userToAdd.displayName || userToAdd.email.split('@')[0],
        email: userToAdd.email,
        avatar: userToAdd.photoURL
    }]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeMember = (index: number) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  const handleCopyInviteLink = () => {
      // Simulate copy action
      setInviteLinkCopied(true);
      setTimeout(() => setInviteLinkCopied(false), 3000);
      // Logic: In V2, we might not have a link until group is created.
      // But we can show a toast saying "Link will be generated once group is created"
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
        setError("Please enter a group name");
        return;
    }
    setError('');
    setSubmitting(true);

    try {
        const token = await getIdToken();
        const res = await fetch('/api/groups', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: groupName,
                currency,
                members: members.map(m => m.email)
            })
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'Failed to create group');
        }

        const data = await res.json();
        router.push(`/group/${data.group._id}`); 
    } catch (err: any) {
        console.error(err);
        setError(err.message);
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) {
     router.push('/login');
     return null;
  }

  return (
    <div className="flex h-screen w-full bg-[#f6f7f8] dark:bg-[#101922] font-sans text-slate-900 dark:text-slate-100 antialiased overflow-hidden transition-colors">
      
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-[#1a242d] border-r border-slate-200 dark:border-slate-800 z-30">
             <Sidebar 
                onLogout={() => {}} 
                onCreateGroup={() => {}}
                onJoinGroup={() => {}} 
                onAddFriend={() => {}}
             />
        </aside>

        {/* Mobile Drawer */}
        <div className={`fixed inset-0 z-50 md:hidden pointer-events-none ${mobileMenuOpen ? 'pointer-events-auto' : ''}`}>
             <div className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileMenuOpen(false)}></div>
             <div className={`absolute top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-[#1a242d] shadow-2xl transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <Sidebar 
                    mobileOpen={mobileMenuOpen}
                    setMobileOpen={setMobileMenuOpen}
                    onLogout={() => {}}
                    onCreateGroup={() => {}}
                    onJoinGroup={() => {}} 
                    onAddFriend={() => {}}
                 />
             </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
            
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#1a242d] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="size-8 flex items-center justify-center">
                        <img src="/icons/icon-192.png" alt="Hisab" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-lg dark:text-white">Hisab</span>
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(true)}
                  className="text-slate-500 dark:text-slate-400 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <Menu size={24} />
                </button>
            </header>

            <div className="flex-1 w-full max-w-[960px] mx-auto p-4 md:p-8 lg:p-12 pb-32">
                
                {/* Page Heading */}
                <div className="flex flex-col gap-2 mb-10">
                    <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-2 hover:text-[#2b8cee] transition-colors w-fit">
                        <ArrowLeft size={18} />
                        <span>Back to Dashboard</span>
                    </Link>
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Create a new group</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-normal">Start sharing expenses with friends and family.</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                {/* Form Container */}
                <div className="bg-white dark:bg-[#1a242d] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-visible">
                    <div className="p-6 md:p-10 flex flex-col gap-10">
                        
                        {/* Top Section: Avatar + Basic Info */}
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Avatar Uploader */}
                            <div className="flex flex-col items-center gap-3 shrink-0">
                                <label className="group relative size-24 md:size-32 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-[#2b8cee] hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-all">
                                    <div className="bg-white dark:bg-slate-700 p-2 rounded-full shadow-sm mb-1 group-hover:scale-110 transition-transform text-[#2b8cee]">
                                        <Camera size={24} />
                                    </div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Upload Icon</span>
                                    <input accept="image/*" className="hidden" type="file"/>
                                </label>
                            </div>
                            
                            {/* Inputs */}
                            <div className="flex-1 w-full flex flex-col gap-6">
                                {/* Group Name */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-900 dark:text-white text-sm font-semibold">Group Name</label>
                                    <input 
                                        type="text"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-[#f6f7f8] dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2b8cee]/20 focus:border-[#2b8cee] transition-all text-base"
                                        placeholder="e.g. Summer Trip 2024"
                                    />
                                </div>
                                {/* Currency */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-900 dark:text-white text-sm font-semibold">Default Currency</label>
                                    <div className="relative">
                                        <select 
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                            className="w-full h-12 px-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-[#f6f7f8] dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2b8cee]/20 focus:border-[#2b8cee] transition-all text-base appearance-none cursor-pointer"
                                        >
                                            <option value="USD">USD - US Dollar ($)</option>
                                            <option value="EUR">EUR - Euro (€)</option>
                                            <option value="GBP">GBP - British Pound (£)</option>
                                            <option value="INR">INR - Indian Rupee (₹)</option>
                                            <option value="JPY">JPY - Japanese Yen (¥)</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <ChevronDown size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-200 dark:border-slate-800"/>

                        {/* Members Section */}
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-slate-900 dark:text-white text-lg font-bold">Add Members</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Search for friends by name or email.</p>
                            </div>
                            
                            {/* Search Bar Container */}
                            <div className="relative">
                                <div className="relative flex gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            {isSearching ? <Loader2 size={20} className="animate-spin text-[#2b8cee]" /> : <Search size={20} />}
                                        </span>
                                        <input 
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-[#f6f7f8] dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2b8cee]/20 focus:border-[#2b8cee] transition-all text-base"
                                            placeholder="Enter name or email address"
                                        />
                                    </div>
                                </div>

                                {/* Search Results Dropdown */}
                                {searchQuery.length >= 3 && !isSearching && searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a242d] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-20">
                                        {searchResults.map(user => (
                                            <button 
                                                key={user.firebaseUid || user.email}
                                                onClick={() => addMember(user)}
                                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                                            >
                                                <div className="size-8 rounded-full bg-[#2b8cee]/10 text-[#2b8cee] flex items-center justify-center font-bold text-sm">
                                                    {user.displayName ? user.displayName[0] : user.email[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                        {user.displayName || 'User'} 
                                                        {user.username && <span className="text-xs font-normal text-slate-400 ml-1">(@{user.username})</span>}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                                </div>
                                                <div className="ml-auto">
                                                    <Plus size={16} className="text-slate-400" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* "Not Found" / Invite Link Option */}
                                {searchQuery.length >= 3 && !isSearching && searchResults.length === 0 && (
                                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                <UserPlus size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">User not found</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Invite them using a link instead.</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleCopyInviteLink}
                                            className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                                        >
                                            {inviteLinkCopied ? (
                                                <>
                                                    <Check size={16} className="text-green-500" />
                                                    <span>Link Enabled</span>
                                                </>
                                            ) : (
                                                <>
                                                    <LinkIcon size={16} />
                                                    <span>Invite via Link</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Invite Link Info Toast (if enabled) */}
                            {inviteLinkCopied && (
                                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
                                    <Check size={12} />
                                    An invite link will be available after you create the group.
                                </p>
                            )}

                            {/* Members List */}
                            <div className="flex flex-col gap-3 mt-2">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Group Members ({members.length + 1})</p>
                                
                                {/* You (Admin) */}
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-[#2b8cee] flex items-center justify-center text-white font-bold">
                                            {user.displayName ? user.displayName[0] : 'U'}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-slate-900 dark:text-white text-sm font-semibold">You <span className="text-xs font-normal text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full ml-2">Admin</span></p>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Added Members */}
                                {members.map((member, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                                                {member.name[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-slate-900 dark:text-white text-sm font-semibold">{member.name}</p>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs">{member.email}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => removeMember(idx)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                ))}

                            </div>
                        </div>

                    </div>
                    
                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-6 md:px-10 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                        <Link href="/dashboard" className="w-full sm:w-auto px-6 h-12 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center">
                            Cancel
                        </Link>
                        <button 
                            onClick={handleCreateGroup}
                            disabled={submitting}
                            className={`w-full sm:w-auto px-8 h-12 rounded-xl bg-[#2b8cee] text-white font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-600 hover:shadow-blue-500/40 active:scale-95 transition-all flex items-center justify-center gap-2 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {submitting ? (
                                <span>Creating...</span>
                            ) : (
                                <>
                                    <span>Create Group</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Helper Text */}
                <div className="text-center mt-8 text-slate-400 text-sm">
                    <p>By creating a group, you agree to our <a className="text-[#2b8cee] hover:underline" href="/terms">Terms of Service</a>.</p>
                </div>

            </div>
        </main>
    </div>
  );
}
