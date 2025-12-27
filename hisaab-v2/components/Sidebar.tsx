'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserCircle, Plus, ArrowUpRight, Users, UserPlus, LogOut, Bell, UserCheck } from 'lucide-react';

export default function Sidebar({ 
  onLogout, 
  onCreateGroup, 
  onJoinGroup, 
  onAddFriend,
  mobileOpen,
  setMobileOpen
}: any) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  // @ts-ignore
  const NavItem = ({ to, icon: Icon, label, badge }) => {
    const active = isActive(to);
    return (
      <Link 
        href={to} 
        onClick={() => setMobileOpen && setMobileOpen(false)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
          active 
            ? 'bg-[#2b8cee]/10 text-[#2b8cee]' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        <Icon size={20} />
        <span className="flex-1">{label}</span>
        {badge > 0 && (
          <span className="bg-[#2b8cee] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  // @ts-ignore
  const ActionItem = ({ onClick, icon: Icon, label }) => (
    <button 
      type="button"
      onClick={() => {
        if (onClick) onClick();
        if (setMobileOpen) setMobileOpen(false);
      }}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1a2632] dark:border-r dark:border-gray-800">
      <div className="p-6 flex items-center gap-3 border-b border-transparent lg:border-none">
        <div className="size-10 flex items-center justify-center">
          <img src="/icons/icon-192.png" alt="Logo" className="w-full h-full object-contain rounded-xl" />
        </div>
        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Hisaab</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" badge={0} />
        <NavItem to="/groups" icon={Users} label="My Groups" badge={0} />
        <NavItem to="/friends" icon={UserCheck} label="My Friends" badge={0} />
        <NavItem to="/requests" icon={Bell} label="Requests" badge={0} />
        <NavItem to="/profile" icon={UserCircle} label="Profile" badge={0} />
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-gray-800">
        <button 
          type="button"
          onClick={onLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
