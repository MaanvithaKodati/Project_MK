import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Server, 
  FileCheck2, 
  Cpu, 
  TrendingUp, 
  KeyRound, 
  Download, 
  ExternalLink 
} from 'lucide-react';

interface SecurityPortalProps {
  onOpenTutorial: () => void;
  onOpenExport: () => void;
}

export const SecurityPortal: React.FC<SecurityPortalProps> = ({
  onOpenTutorial,
  onOpenExport,
}) => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-50 border border-amber-200 text-amber-800">
              Governance &amp; Architecture
            </span>
            <span className="text-xs text-gray-400">&bull;</span>
            <span className="text-xs text-gray-500 font-medium">Policy Specification: GOV-2026.04</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Security &amp; Compliance Portal
          </h1>
          <p className="text-xs text-gray-600 mt-0.5 max-w-3xl">
            Enterprise data handling rules, architectural security boundaries, and cross-departmental compliance posture.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={onOpenTutorial}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold transition-all shadow-xs"
          >
            <span>Restart Onboarding Tour</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white text-xs font-semibold transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Compliance Report</span>
          </button>
        </div>
      </div>

      {/* Mandatory Cautionary Architecture Banner */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-xs">
        <div className="flex items-start space-x-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h3 className="font-bold text-sm text-amber-900">
              Mandatory Enterprise Data Hosting Cautionary Guidance
            </h3>
            <p className="text-xs text-amber-950 font-mono leading-relaxed">
              &ldquo;Cautionary Notice: This web app uses standard server architecture. Do not upload classified, HIPAA, or unencrypted PII without secondary encryption layers.&rdquo;
            </p>
            <p className="text-[11px] text-amber-800/90 leading-relaxed pt-1">
              While our system isolates enterprise workspaces and role access credentials with local zero-trust tokens, high-security organizations must ensure uploaded documents are scrubbed of unencrypted identities and internal secret keys.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Architecture Security Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1A73E8]">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-gray-900">
            1. Standard Cloud Multi-Tenant Architecture
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            The platform is hosted on cloud container infrastructure with automated TLS 1.3 encryption in transit and AES-256 at rest. Workspaces are isolated logically by enterprise identity.
          </p>
          <div className="pt-2 text-[11px] text-[#1A73E8] font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Multi-Tenant Logical Isolation Active</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-gray-900">
            2. Enforced 8+ Character RBAC Passwords
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            All user roles are password-gated. A Sales Director cannot inspect SecOps vulnerabilities or HR compensation bands. Elevation requires verified credentials.
          </p>
          <div className="pt-2 text-[11px] text-purple-700 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Strict Role-Based Authorization</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-gray-900">
            3. Regulatory Audit Alignment (SOC 2 &amp; ISO)
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Module 2 continuously evaluates perimeter health scores against SOC 2 Type II trust principles and ISO 27001 ISMS standards to track continuous audit readiness.
          </p>
          <div className="pt-2 text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Compliance Scorecards Monitored</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-gray-900">
            4. Session Lifecycle &amp; Zero-Trust Logouts
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Clicking &ldquo;Log Out&rdquo; immediately purges active memory tokens, locks all routes, and returns users to the primary authentication gate for zero-trust hygiene.
          </p>
          <div className="pt-2 text-[11px] text-rose-700 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Automated Session Purge Enforced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
