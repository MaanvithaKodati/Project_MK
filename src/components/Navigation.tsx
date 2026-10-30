import React from 'react';
import { 
  NavigationTab, 
  UserRole 
} from '../types';
import { ENTERPRISE_ROLES } from '../data/mockData';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ShieldAlert, 
  Users, 
  Lock, 
  FileCheck2,
  Sparkles,
  GitCompare
} from 'lucide-react';

interface NavigationProps {
  activeTab: NavigationTab;
  onTabSelect: (tab: NavigationTab) => void;
  currentRole: UserRole;
  onAttemptRestrictedTab: (tab: NavigationTab) => void;
}

interface TabItem {
  id: NavigationTab;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isCeoDefault?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabSelect,
  currentRole,
}) => {
  const roleConfig = ENTERPRISE_ROLES[currentRole];

  const tabs: TabItem[] = [
    {
      id: 'ceo-overview',
      label: 'CEO Executive Command',
      shortLabel: 'CEO Command',
      icon: LayoutDashboard,
      badge: 'Unified',
      isCeoDefault: true,
    },
    {
      id: 'cross-module-insights',
      label: 'Cross-Module Insights',
      shortLabel: 'Correlations',
      icon: GitCompare,
      badge: 'CEO Only',
    },
    {
      id: 'sales-analytics',
      label: 'Sales & Marketing Analytics',
      shortLabel: 'Sales & Revenue',
      icon: TrendingUp,
      badge: 'Module 1',
    },
    {
      id: 'cyber-threats',
      label: 'Cybersecurity Threat Model',
      shortLabel: 'Cyber Threats',
      icon: ShieldAlert,
      badge: 'Module 2',
    },
    {
      id: 'hr-management',
      label: 'HR & Workforce Management',
      shortLabel: 'HR & Payroll',
      icon: Users,
      badge: 'Module 3',
    },
    {
      id: 'security-portal',
      label: 'Security & Compliance Portal',
      shortLabel: 'Security Portal',
      icon: FileCheck2,
    },
  ];

  // Filter tabs to strictly those authorized for the authenticated role
  const authorizedTabs = tabs.filter(tab => roleConfig.allowedTabs.includes(tab.id));

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {authorizedTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabSelect(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 group relative ${
                  isActive
                    ? 'bg-blue-50 text-[#1A73E8] border border-blue-200 shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-[#1A73E8]'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>

                {/* Status Badges */}
                {tab.isCeoDefault && (
                  <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-[#1A73E8]">
                    <Sparkles className="w-2.5 h-2.5 mr-1" />
                    DEFAULT
                  </span>
                )}

                {tab.badge && !tab.isCeoDefault && (
                  <span className="hidden lg:inline text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
