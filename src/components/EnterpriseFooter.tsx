import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface EnterpriseFooterProps {
  onOpenDisclaimer?: () => void;
  onOpenTutorial?: () => void;
  onLockSession?: () => void;
  isAuthenticated?: boolean;
  companyName?: string;
  industry?: string;
}

export const EnterpriseFooter: React.FC<EnterpriseFooterProps> = ({
  onOpenDisclaimer,
  onOpenTutorial,
  onLockSession,
  isAuthenticated = false,
  companyName,
  industry,
}) => {
  return (
    <footer className="border-t border-gray-200 bg-white py-5 px-4 sm:px-6 lg:px-8 text-xs text-gray-500 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Branding & Status */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs">
          <div className="flex items-center space-x-1.5 text-gray-800 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#1A73E8]" />
            <span>Enterprise OS</span>
          </div>
          <span className="text-gray-300">&bull;</span>
          {companyName ? (
            <span className="text-gray-600 truncate max-w-xs">{companyName} {industry ? `(${industry})` : ''}</span>
          ) : (
            <span className="text-gray-500">Sentinel &amp; Synthetics Platform</span>
          )}
          <span className="text-gray-300">&bull;</span>
          <span className="text-emerald-700 font-medium">Zero-Trust Active</span>
        </div>

        {/* Center: MANDATORY SIGNATURE & BRAND CREDIT WITH HIGHLIGHTED BADGE */}
        <div className="flex items-center justify-center text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gray-50 border border-gray-200 shadow-xs">
            <span className="text-gray-600 text-[11px] font-medium tracking-wide">
              Designed &amp; Engineered by
            </span>
            <span className="relative inline-block font-semibold text-[#1A73E8] text-xs px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 shadow-xs tracking-wider">
              Maanvitha Kodati
            </span>
            <span className="text-gray-300 hidden sm:inline">&bull;</span>
            <span className="text-gray-600 text-[11px] font-medium tracking-wide hidden sm:inline">
              Enterprise Intelligence Architecture
            </span>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3.5 text-xs">
          {onOpenDisclaimer && (
            <button
              onClick={onOpenDisclaimer}
              className="text-amber-700 hover:text-amber-800 hover:underline flex items-center space-x-1 font-medium transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Hosting Advisory</span>
            </button>
          )}

          {onOpenTutorial && (
            <>
              <span className="text-gray-300">&bull;</span>
              <button
                onClick={onOpenTutorial}
                className="text-gray-500 hover:text-gray-800 transition-colors font-medium"
              >
                Guide
              </button>
            </>
          )}

          {isAuthenticated && onLockSession && (
            <>
              <span className="text-gray-300">&bull;</span>
              <button
                onClick={onLockSession}
                className="text-rose-600 hover:text-rose-700 hover:underline transition-colors font-semibold"
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};
