import React from 'react';
import { Sparkles, ShieldCheck, KeyRound, X, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface WelcomeBannerProps {
  onDismiss: () => void;
  currentRole: UserRole;
  onExploreCeoView: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  onDismiss,
  currentRole,
  onExploreCeoView,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-blue-200 p-5 sm:p-6 mb-6 shadow-xs">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1A73E8] shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1A73E8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Welcome to Enterprise OS
              </span>
              <span className="text-xs text-gray-500 hidden sm:inline">
                Sentinel &amp; Synthetics Platform
              </span>
            </div>
            
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mt-1">
              Cross-Departmental Intelligence with Strict Role-Based Access Control
            </h2>
            
            <p className="text-xs sm:text-sm text-gray-600 mt-1.5 max-w-3xl leading-relaxed">
              Enterprise OS provides AI-powered analytics across Sales, Cybersecurity, and HR with strict Role-Based Access Control (RBAC). Select your role in the top header or navigate through authorized departmental modules.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-3.5">
              <button
                onClick={onExploreCeoView}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white text-xs font-semibold transition-all shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Default CEO Overview</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <KeyRound className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Switch persona in header: <strong>CEO, Sales Director, InfoSec VP, HR Lead</strong></span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
