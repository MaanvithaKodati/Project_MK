import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  UserCheck, 
  Download, 
  ChevronDown, 
  Lock, 
  LogOut,
  Building,
  KeyRound,
  FileText,
  Sparkles
} from 'lucide-react';
import { UserRole, RoleConfig, EnterpriseProfile } from '../types';
import { ENTERPRISE_ROLES } from '../data/mockData';

interface HeaderProps {
  currentEnterprise: EnterpriseProfile;
  currentRole: UserRole;
  onRequestRoleChange: (role: UserRole) => void;
  onLogout: () => void;
  onOpenDisclaimer: () => void;
  onOpenExport: () => void;
  hasSeenWelcome: boolean;
  onShowWelcome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentEnterprise,
  currentRole,
  onRequestRoleChange,
  onLogout,
  onOpenDisclaimer,
  onOpenExport,
  onShowWelcome,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const activeRoleConfig: RoleConfig = ENTERPRISE_ROLES[currentRole];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Enterprise Name & Industry */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1A73E8] shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#1A73E8]" />
            </div>

            <div className="min-w-0">
              {/* Enterprise Name & Industry Header */}
              <div className="flex items-center space-x-2 truncate">
                <span className="font-bold text-sm sm:text-base text-gray-900 truncate font-sans">
                  {currentEnterprise.companyName}
                </span>
                <span className="hidden md:inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-blue-50 border border-blue-200 text-[#1A73E8] shrink-0">
                  {currentEnterprise.industry}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="text-[#1A73E8] font-semibold">Logged in as:</span>
                <span className="text-gray-800 font-semibold truncate">{activeRoleConfig.label}</span>
                <span className="hidden lg:inline text-gray-300">&bull;</span>
                <span className="hidden lg:inline text-gray-600 truncate">{activeRoleConfig.clearanceBadge}</span>
              </div>
            </div>
          </div>

          {/* Right Controls: Role Switcher, Security Notice, Export, Lock Session */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Security Disclaimer Button */}
            <button
              onClick={onOpenDisclaimer}
              title="Security & Compliance Disclaimer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden xl:inline font-medium">Security Notice</span>
            </button>

            {/* Quick Export Debrief */}
            <button
              onClick={onOpenExport}
              title="Export Executive Debrief"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden lg:inline font-medium">Export Debrief</span>
            </button>

            {/* Platform Guide / Welcome */}
            <button
              onClick={onShowWelcome}
              title="View Onboarding Guide"
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Role Authenticated Badge & Switcher */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-300 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-left group shadow-xs"
                title="Switch Authenticated Role"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-xs font-bold text-[#1A73E8] font-mono">
                  {activeRoleConfig.avatarInitials}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-gray-900 group-hover:text-[#1A73E8] transition-colors leading-tight">
                    {activeRoleConfig.label}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono tracking-wide leading-tight">
                    {activeRoleConfig.clearanceBadge}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Role Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-gray-200 shadow-2xl z-50 p-2.5 divide-y divide-gray-100">
                    <div className="px-3 py-2 text-xs text-gray-500">
                      <div className="flex items-center justify-between text-gray-900 font-medium mb-1">
                        <span className="flex items-center space-x-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-[#1A73E8]" />
                          <span className="font-semibold">Password-Protected RBAC</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                          ENCRYPTED
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-gray-500">
                        Switching to another role requires entering that role&apos;s password.
                      </p>
                    </div>

                    <div className="py-1.5 space-y-1">
                      {(Object.keys(ENTERPRISE_ROLES) as UserRole[]).map((roleKey) => {
                        const role = ENTERPRISE_ROLES[roleKey];
                        const isCurrent = roleKey === currentRole;
                        return (
                          <button
                            key={roleKey}
                            onClick={() => {
                              setDropdownOpen(false);
                              if (!isCurrent) {
                                onRequestRoleChange(roleKey);
                              }
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-start space-x-2.5 ${
                              isCurrent
                                ? 'bg-blue-50 border border-blue-200 text-gray-900 font-medium'
                                : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                            }`}
                          >
                            <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-[11px] ${
                              isCurrent 
                                ? 'bg-[#1A73E8] text-white' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {role.avatarInitials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold truncate">{role.label}</span>
                                {isCurrent ? (
                                  <UserCheck className="w-3.5 h-3.5 text-[#1A73E8] shrink-0 ml-1" />
                                ) : (
                                  <Lock className="w-3 h-3 text-gray-400 shrink-0 ml-1" />
                                )}
                              </div>
                              <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                                {role.clearanceBadge}
                              </div>
                              <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
                                {role.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* MANDATORY HIGHLY VISIBLE LOG OUT BUTTON */}
            <button
              onClick={onLogout}
              title="Terminate Active Session & Log Out to Landing Page"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 hover:text-rose-800 transition-all shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
