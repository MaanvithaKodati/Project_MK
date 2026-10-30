import React from 'react';
import { 
  ShieldAlert, 
  X, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  FileCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface SecurityDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityDisclaimerModal: React.FC<SecurityDisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-2xl w-full bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-amber-800 uppercase bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Mandatory Security &amp; Compliance Notice
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-1">
                Enterprise OS Architecture &amp; Governance
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Cautionary Notice */}
        <div className="my-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 font-mono mb-1">
                Cautionary Notice: Standard Server Architecture
              </h4>
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-amber-950 font-mono">
                &ldquo;Cautionary Notice: This web app uses standard server architecture. Do not upload classified, HIPAA, or unencrypted PII without secondary encryption layers.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Architecture Governance */}
        <div className="space-y-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
            <div className="flex items-center space-x-2 text-gray-900 font-bold">
              <Server className="w-4 h-4 text-[#1A73E8]" />
              <span>1. Multi-Tenant Infrastructure Boundaries</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              Enterprise OS is designed for operational trend modeling and management debriefing. While data is sandboxed per enterprise workspace, enterprise users must exercise data hygiene when inputting sensitive financial or identity files.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
            <div className="flex items-center space-x-2 text-gray-900 font-bold">
              <Lock className="w-4 h-4 text-purple-600" />
              <span>2. Role-Based Access Control (RBAC) Integrity</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              Access tiers are guarded with individual 8+ character password encryption. Sales Directors cannot access SecOps perimeters or employee payroll files. Sovereign CEO credentials unlock unified oversight.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
            <div className="flex items-center space-x-2 text-gray-900 font-bold">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>3. Data Storage &amp; Zero-Trust Logging</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              Workspaces are encrypted in local secure storage. Logging out purges active credentials and requires role password re-authentication.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-500 font-mono">
            Enterprise OS &bull; Sentinel &amp; Synthetics
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold text-xs shadow-xs"
          >
            I Acknowledge &amp; Understand
          </button>
        </div>
      </div>
    </div>
  );
};
