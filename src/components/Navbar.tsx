import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UploadCloud, 
  Search, 
  Clock, 
  GitFork, 
  FileSpreadsheet, 
  History, 
  Settings, 
  FileText,
  UserCheck,
  ChevronDown,
  Inbox,
  Send
} from 'lucide-react';
import { UserRole } from '../types/correspondence';

interface NavbarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  currentRole,
  onRoleChange,
  pendingCount,
}) => {
  const roles: UserRole[] = [
    'Correspondence Registrar',
    'Administrator',
    'Reviewer / Department',
    'Read-Only Auditor'
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Building2 },
    { id: 'upload', label: 'Upload & Extract', icon: UploadCloud, highlight: true },
    { id: 'register-incoming', label: 'Register Incoming', icon: Inbox },
    { id: 'register-outgoing', label: 'Register Outgoing', icon: Send },
    { id: 'search', label: 'Search & Records', icon: Search },
    { id: 'pending', label: 'Pending Replies', icon: Clock, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'threads', label: 'Threads & History', icon: GitFork },
    { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet },
    { id: 'audit', label: 'Audit Trail', icon: History },
    { id: 'cloud', label: 'Storage & Config', icon: Settings },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 select-none shadow-md">
      {/* Top Banner: Brand & Role Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand lockup */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-inner tracking-wider">
              AB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">airblue</span>
                <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded font-mono">
                  PCAA PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">
                Civil Aviation Regulatory Correspondence System
              </p>
            </div>
          </div>

          {/* User Role Switcher & Status */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>PCAA Compliant</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 font-mono">CARs 1994</span>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Role</span>
                <select
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value as UserRole)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-4"
                >
                  {roles.map(r => (
                    <option key={r} value={r} className="bg-slate-800 text-white">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 pt-1 border-t border-slate-800/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || 
              (item.id === 'upload' && currentView === 'upload') ||
              (item.id === 'register-incoming' && currentView === 'register-incoming') ||
              (item.id === 'register-outgoing' && currentView === 'register-outgoing');

            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                } ${item.highlight && !isActive ? 'text-blue-300 bg-blue-900/30 border border-blue-700/40' : ''}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-red-500 text-white' : 'bg-red-600/90 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
