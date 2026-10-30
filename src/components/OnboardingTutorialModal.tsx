import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  ShieldCheck, 
  KeyRound, 
  TrendingUp, 
  ShieldAlert, 
  Users, 
  GitCompare, 
  AlertTriangle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { UserRole } from '../types';

interface OnboardingTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
}

interface TutorialStep {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  highlightText?: string;
  tips: string[];
  actionLabel?: string;
  isDisclaimer?: boolean;
}

export const OnboardingTutorialModal: React.FC<OnboardingTutorialModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const steps: TutorialStep[] = [
    {
      id: 'intro',
      badge: 'Step 1 of 6 &bull; Platform Architecture',
      title: 'Welcome to Enterprise OS (Sentinel & Synthetics)',
      description: 'An executive intelligence platform unifying fragmented multi-year departmental reports into automated, correlated manager debriefs. Built for Enterprise Operations & IT leadership.',
      icon: Sparkles,
      iconBg: 'bg-blue-50 border border-blue-200',
      iconColor: 'text-[#1A73E8]',
      highlightText: 'Dismantle data silos across Sales, Cybersecurity, and Human Resources with high-speed AI synthesis.',
      tips: [
        'Default view opens directly to the CEO Unified Multi-Departmental Overview.',
        'Explore individual modules or simulate cross-departmental impact in real-time.',
        'Export unified manager debriefs anytime from the header.',
      ],
    },
    {
      id: 'rbac',
      badge: 'Step 2 of 6 &bull; Access Security',
      title: 'Role-Based Access Control (RBAC) & Clearance Tiers',
      description: 'Zero-Trust compartmentalization safeguards sensitive corporate data. Each role possesses distinct clearance boundaries enforced with 8+ character passwords.',
      icon: KeyRound,
      iconBg: 'bg-purple-50 border border-purple-200',
      iconColor: 'text-purple-600',
      highlightText: 'Switch personas anytime via the header dropdown. Elevating to higher tiers requires password verification.',
      tips: [
        'CEO Sovereign: Full unrestricted oversight across all 3 modules.',
        'Sales Director: Strictly Module 1 (Sales & Commercial Forecasting).',
        'CISO / InfoSec VP: Strictly Module 2 (Penetration Audits & Perimeter Defense).',
        'HR Lead: Strictly Module 3 (Workforce Allocations & Compensation).',
      ],
    },
    {
      id: 'disclaimer',
      badge: 'Step 3 of 6 &bull; Architecture Advisory',
      title: 'Mandatory Security Governance Notice',
      description: 'Clear architectural guidance regarding corporate data boundaries and multi-tenant hosting guidelines.',
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 border border-amber-200',
      iconColor: 'text-amber-700',
      isDisclaimer: true,
      highlightText: 'Cautionary Notice: This web app uses standard server architecture. Do not upload classified, HIPAA, or unencrypted PII without secondary encryption layers.',
      tips: [
        'Always sanitize employee social security numbers and customer credentials.',
        'Ensure financial figures comply with organizational public-readiness policies.',
        'Review the complete advisory anytime in the Security Portal or footer.',
      ],
    },
    {
      id: 'sales-module',
      badge: 'Step 4 of 6 &bull; Module 1',
      title: 'Sales & Marketing Analytics Engine',
      description: 'Multi-year commercial analysis that calculates year-over-year revenue growth, gross margins, and projected targets.',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50 border border-emerald-200',
      iconColor: 'text-emerald-700',
      tips: [
        'Ingest up to 3 PDF/CSV/TXT reports with custom period naming.',
        'Identify high-margin catalysts and revenue drivers.',
        'Synthesize executive demand forecasts with integrated Gemini AI.',
      ],
    },
    {
      id: 'cyber-module',
      badge: 'Step 5 of 6 &bull; Module 2',
      title: 'Cybersecurity Threat Modeling',
      description: 'Audit report synthesis tracking vulnerability perimeters, attack surface drifts, and remediation milestones.',
      icon: ShieldAlert,
      iconBg: 'bg-rose-50 border border-rose-200',
      iconColor: 'text-rose-700',
      tips: [
        'Monitor active critical threat vectors across API and identity clusters.',
        'Benchmark against SOC 2 Type II and ISO 27001 readiness standards.',
        'Track mean-time-to-detect (MTTD) and mean-time-to-remediate (MTTR).',
      ],
    },
    {
      id: 'hr-cross',
      badge: 'Step 6 of 6 &bull; Module 3 & Insights',
      title: 'HR Management & Cross-Module Correlations',
      description: 'Analyze departmental compensation budgets and simulate how rapid sales expansion impacts perimeter cybersecurity risk.',
      icon: GitCompare,
      iconBg: 'bg-blue-50 border border-blue-200',
      iconColor: 'text-[#1A73E8]',
      highlightText: 'Interactive "What-If" simulator: dynamically test headcount expansion vs SecOps risk.',
      tips: [
        'Add employees and department leads with batch import capability.',
        'Examine Pearson correlation coefficients between sales surges and cyber alerts.',
        'Simulate net profit vs defensive staffing to eliminate operational bottlenecks.',
      ],
    },
  ];

  const currentStep = steps[currentStepIndex];
  const StepIcon = currentStep.icon;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-xl w-full bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#1A73E8] uppercase tracking-wider">
              {currentStep.badge}
            </span>
            <span className="text-[11px] font-medium text-gray-500">
              {currentStepIndex + 1} of {steps.length}
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {steps.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-1.5 rounded-full cursor-pointer transition-all ${
                  idx === currentStepIndex
                    ? 'bg-[#1A73E8]'
                    : idx < currentStepIndex
                    ? 'bg-emerald-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div>
          <div className="flex items-start space-x-4 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${currentStep.iconBg}`}>
              <StepIcon className={`w-6 h-6 ${currentStep.iconColor}`} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {currentStep.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Highlight Callout Box */}
          {currentStep.highlightText && (
            <div className={`p-4 rounded-xl mb-4 text-xs sm:text-sm leading-relaxed ${
              currentStep.isDisclaimer
                ? 'bg-amber-50 border border-amber-200 text-amber-900 font-mono'
                : 'bg-blue-50 border border-blue-200 text-blue-900 font-medium'
            }`}>
              {currentStep.highlightText}
            </div>
          )}

          {/* Key Takeaway Bullets */}
          <div className="space-y-2 mb-6">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-700 block">
              Key Operational Guidelines:
            </span>
            <div className="space-y-1.5 text-xs text-gray-600">
              {currentStep.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-gray-800 transition-colors font-medium"
          >
            Skip Tutorial
          </button>

          <div className="flex items-center space-x-2.5">
            {!isFirst && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white text-xs font-semibold transition-all shadow-xs"
            >
              <span>{isLast ? 'Complete & Enter Workspace' : 'Continue'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
