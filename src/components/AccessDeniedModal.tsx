import React from 'react';
import { ShieldAlert, Lock, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { NavigationTab, UserRole } from '../types';
import { ENTERPRISE_ROLES } from '../data/mockData';

interface AccessDeniedModalProps {
  targetTab: NavigationTab | null;
  currentRole: UserRole;
  onClose: () => void;
  onElevateRole: (role: UserRole) => void;
}

export const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({
  targetTab,
  currentRole,
  onClose,
  onElevateRole,
}) => {
  if (!targetTab) return null;

  const currentRoleConfig = ENTERPRISE_ROLES[currentRole];

  // Determine which role is required for the requested tab
  const getRequiredRole = (tab: NavigationTab): { role: UserRole; name: string } => {
    switch (tab) {
      case 'sales-analytics':
        return { role: 'SALES_MANAGER', name: 'Sales & Revenue Director' };
      case 'cyber-threats':
        return { role: 'SECURITY_DIRECTOR', name: 'Chief Information Security Officer (CISO)' };
      case 'hr-management':
        return { role: 'HR_LEAD', name: 'VP of Human Resources' };
      case 'ceo-overview':
      default:
        return { role: 'CEO', name: 'Chief Executive Officer (CEO)' };
    }
  };

  const requiredRole = getRequiredRole(targetTab);

  const getTabFriendlyName = (tab: NavigationTab): string => {
    switch (tab) {
      case 'ceo-overview':
        return 'CEO Executive Command (Unified Multi-Departmental Overview)';
      case 'cross-module-insights':
        return 'Cross-Module Insights & Correlation Matrix';
      case 'sales-analytics':
        return 'Module 1: Sales & Marketing Analytics';
      case 'cyber-threats':
        return 'Module 2: Cybersecurity Threat Model';
      case 'hr-management':
        return 'Module 3: HR & Workforce Management';
      case 'security-portal':
        return 'Security & Compliance Portal';
      default:
        return 'Restricted Enterprise Module';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-rose-700 uppercase bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Clearance Level Restricted
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-1">
              Access Restricted
            </h3>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 mb-4 space-y-2 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
            <span className="text-gray-500">Target Module:</span>
            <span className="font-semibold text-gray-800 text-right">
              {getTabFriendlyName(targetTab)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
            <span className="text-gray-500">Current Role:</span>
            <span className="font-semibold text-amber-700">
              {currentRoleConfig.label} ({currentRoleConfig.clearanceBadge})
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Required Clearance:</span>
            <span className="font-semibold text-[#1A73E8]">
              {requiredRole.name} or CEO Sovereign
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-6 leading-relaxed">
          Zero-Trust Role-Based Access Control (RBAC) is enforced across the platform. To inspect this module, switch to the authorized departmental role or authenticate with CEO sovereign credentials.
        </p>

        <div className="space-y-2.5">
          <button
            onClick={() => {
              onElevateRole('CEO');
              onClose();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold text-xs transition-all shadow-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Elevate to CEO Sovereign (Full Access)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {requiredRole.role !== 'CEO' && (
            <button
              onClick={() => {
                onElevateRole(requiredRole.role);
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium transition-colors border border-gray-200"
            >
              <span>Switch to {requiredRole.name}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 text-center text-xs text-gray-500 hover:text-gray-800 transition-colors"
          >
            Return to Authorized View
          </button>
        </div>
      </div>
    </div>
  );
};
