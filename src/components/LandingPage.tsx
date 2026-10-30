import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  LogIn, 
  Building2, 
  TrendingUp, 
  Users, 
  GitCompare, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  FileCheck2,
  Sparkles,
  Layers,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { EnterpriseFooter } from './EnterpriseFooter';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenDisclaimer?: () => void;
  onOpenTutorial?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onOpenDisclaimer,
  onOpenTutorial,
}) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1A73E8] shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-gray-900">
                  Enterprise OS
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider rounded-full bg-blue-50 border border-blue-200 text-[#1A73E8] uppercase">
                  Sentinel &amp; Synthetics
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                Operations &bull; Sales &bull; Cybersecurity &bull; HR
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>Log In</span>
            </button>

            <button
              onClick={onOpenRegister}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1A73E8] hover:bg-[#1557b0] transition-all shadow-sm hover:shadow-md"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Register Enterprise</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col justify-center">
        {/* Value Proposition Badge & Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1A73E8] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span>CROSS-DEPARTMENTAL ENTERPRISE INTELLIGENCE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Unified Multi-Year Analytics for Commercial, Threat &amp; Workforce Operations
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Dismantle departmental data silos. Enterprise OS analyzes fragmented departmental reports across <strong>Sales revenue trends</strong>, <strong>Cybersecurity vulnerability vectors</strong>, and <strong>HR compensation distributions</strong> into actionable executive debriefs with strict Role-Based Access Control.
          </p>

          {/* TWO PRIMARY CALL TO ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg group"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In to Existing Enterprise</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm transition-all border border-gray-300 shadow-xs"
            >
              <Building2 className="w-4 h-4 text-[#1A73E8]" />
              <span>Register New Enterprise</span>
            </button>
          </div>
        </div>

        {/* PROMINENT MANDATORY SECURITY DISCLAIMER */}
        <div className="mt-10 max-w-4xl mx-auto w-full p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-sm">
          <div className="flex items-start space-x-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h3 className="font-bold text-sm text-amber-900 flex items-center space-x-2">
                <span>Security Governance Notice &bull; Multi-Tenant Advisory</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                  STANDARD SERVER CAUTION
                </span>
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed font-mono">
                &ldquo;Cautionary Notice: This web app uses standard server architecture. Do not upload classified, HIPAA, or unencrypted PII without secondary encryption layers.&rdquo;
              </p>
              <div className="pt-1 flex items-center space-x-4 text-xs font-semibold">
                <button
                  onClick={onOpenDisclaimer}
                  className="text-amber-800 hover:text-amber-900 underline flex items-center space-x-1"
                >
                  <span>Review Complete Compliance Governance Guidelines</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                {onOpenTutorial && (
                  <button
                    onClick={onOpenTutorial}
                    className="text-blue-700 hover:text-blue-800 underline"
                  >
                    Take Onboarding Tour
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3 CORE MODULE CARDS + RBAC */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              Module 1 &bull; Commercial Operations
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Sales &amp; Marketing Analytics
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Upload multi-year financial/sales reports (PDF, CSV, TXT) or log entries manually. Generates dynamic growth comparisons, margins, and AI forecast summaries.
            </p>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Role Gate:</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">Sales Director &amp; CEO</span>
            </div>
          </div>

          {/* Module 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider mb-1">
              Module 2 &bull; SecOps &amp; Defense
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Cybersecurity Threat Model
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Upload penetration audits or vulnerability logs (PDF, CSV, TXT) or manually log perimeter findings. Evaluates attack surfaces and compiles remediation roadmaps.
            </p>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Role Gate:</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium">InfoSec VP &amp; CEO</span>
            </div>
          </div>

          {/* Module 3 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1A73E8] mb-4">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-[11px] font-semibold text-[#1A73E8] uppercase tracking-wider mb-1">
              Module 3 &bull; Workforce Analytics
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              HR &amp; Resource Management
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Manage employees &amp; department heads, analyze compensation bands, and monitor departmental headcount allocations with full batch import support.
            </p>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Role Gate:</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#1A73E8] font-medium">HR Lead &amp; CEO</span>
            </div>
          </div>
        </div>

        {/* Password-Protected RBAC Explainer */}
        <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  Role-Based Access Control (RBAC) with 8+ Character Password Enforcement
                </h4>
                <p className="text-xs text-gray-600">
                  Each departmental tier is protected with distinct credentials. CEO sovereignty unlocks all modules, while departmental directors are locked to their domain.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-xs"
              >
                Access Portal
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Pinned Enterprise Footer */}
      <EnterpriseFooter
        onOpenDisclaimer={onOpenDisclaimer}
        onOpenTutorial={onOpenTutorial}
      />
    </div>
  );
};
