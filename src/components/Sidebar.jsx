import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserCircle, Plus, ArrowUpRight, Users, LogOut, Bell } from 'lucide-react';

export default function Sidebar({ 
  onLogout, 
  onCreateGroup, 
  onJoinGroup, 
  onAddFriend,
  mobileOpen,
  setMobileOpen
}) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, badge }) => {
    const active = isActive(to);
    return (
      <Link 
        to={to} 
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
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 flex items-center gap-3 border-b border-transparent lg:border-none">
        <div className="size-10 bg-[#2b8cee] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <div className="size-4 border-[2.5px] border-white rounded-md"></div>
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">Hisaab</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/requests" icon={Bell} label="Requests" />
        <NavItem to="/profile" icon={UserCircle} label="Profile" />

        <div className="pt-4 pb-2 px-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</p>
        </div>

        <ActionItem onClick={onCreateGroup} icon={Plus} label="New Group" />
        <ActionItem onClick={onJoinGroup} icon={ArrowUpRight} label="Join Group" />
        <ActionItem onClick={onAddFriend} icon={Users} label="Add Friend" />
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          type="button"
          onClick={onLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
