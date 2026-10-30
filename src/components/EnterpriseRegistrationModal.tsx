import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  KeyRound, 
  ShieldCheck, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { EnterpriseProfile, EnterpriseCredentials, UserRole } from '../types';

interface EnterpriseRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterComplete: (enterprise: EnterpriseProfile) => void;
}

export const EnterpriseRegistrationModal: React.FC<EnterpriseRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPasswords, setShowPasswords] = useState(false);

  // Form Fields
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Technology & Cloud Infrastructure');
  const [customIndustry, setCustomIndustry] = useState('');
  const [operationalScope, setOperationalScope] = useState('Global Enterprise (1,000+ FTEs)');
  const [description, setDescription] = useState('');

  // Credentials - all 4 required with >= 8 characters
  const [ceoPassword, setCeoPassword] = useState('');
  const [salesPassword, setSalesPassword] = useState('');
  const [secPassword, setSecPassword] = useState('');
  const [hrPassword, setHrPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isPasswordValid = (pwd: string) => pwd.trim().length >= 8;

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setErrorMsg('Please enter your Company / Organization Name.');
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];
    if (!isPasswordValid(ceoPassword)) {
      errors.push('CEO / Sovereign password must be at least 8 characters.');
    }
    if (!isPasswordValid(salesPassword)) {
      errors.push('Sales & Revenue Director password must be at least 8 characters.');
    }
    if (!isPasswordValid(secPassword)) {
      errors.push('Information Security Officer password must be at least 8 characters.');
    }
    if (!isPasswordValid(hrPassword)) {
      errors.push('HR & Workforce Lead password must be at least 8 characters.');
    }

    if (errors.length > 0) {
      setErrorMsg(errors.join(' '));
      return;
    }

    setErrorMsg(null);
    setStep(3);
  };

  const handleFinalSubmit = () => {
    const finalIndustry = industry === 'Other' && customIndustry.trim() ? customIndustry.trim() : industry;

    const newEnterprise: EnterpriseProfile = {
      id: `ent-${Date.now()}`,
      companyName: companyName.trim(),
      industry: finalIndustry,
      operationalScope: operationalScope.trim(),
      description: description.trim() || `${companyName} operational workspace.`,
      registeredAt: new Date().toISOString(),
      credentials: {
        CEO: ceoPassword.trim(),
        SALES_MANAGER: salesPassword.trim(),
        SECURITY_DIRECTOR: secPassword.trim(),
        HR_LEAD: hrPassword.trim(),
      },
    };

    onRegisterComplete(newEnterprise);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-xl w-full bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Multi-Step Header Indicator */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-[#1A73E8] tracking-wider uppercase">
              <Building2 className="w-3.5 h-3.5" />
              <span>Enterprise Setup &bull; Step {step} of 3</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1">
              {step === 1 && 'Company Profile & Sector'}
              {step === 2 && 'Set Role-Based Passwords (RBAC)'}
              {step === 3 && 'Security Governance & Confirmation'}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  s === step
                    ? 'bg-[#1A73E8] text-white shadow-sm ring-2 ring-blue-200'
                    : s < step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {s < step ? <Check className="w-3.5 h-3.5" /> : s}
              </div>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="leading-relaxed font-medium">{errorMsg}</div>
          </div>
        )}

        {/* STEP 1: COMPANY PROFILE */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 font-semibold mb-1.5">
                Company / Organization Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Global Systems Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent text-sm transition-all shadow-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-gray-700 font-semibold mb-1.5">
                  Industry Sector
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent text-xs transition-all shadow-xs"
                >
                  <option value="Technology & Cloud Infrastructure">Technology &amp; Cloud</option>
                  <option value="Cybersecurity & Defense">Cybersecurity &amp; Defense</option>
                  <option value="Healthcare & Life Sciences">Healthcare &amp; Life Sciences</option>
                  <option value="Financial Services & Banking">Financial Services &amp; Banking</option>
                  <option value="Retail & E-Commerce">Retail &amp; E-Commerce</option>
                  <option value="Manufacturing & Supply Chain">Manufacturing &amp; Supply</option>
                  <option value="Other">Other Sector...</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1.5">
                  Operational Scope
                </label>
                <select
                  value={operationalScope}
                  onChange={(e) => setOperationalScope(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent text-xs transition-all shadow-xs"
                >
                  <option value="Global Enterprise (1,000+ FTEs)">Global Enterprise (1,000+ FTEs)</option>
                  <option value="Mid-Market Enterprise (250 - 999 FTEs)">Mid-Market (250 - 999 FTEs)</option>
                  <option value="Growth Stage Enterprise (50 - 249 FTEs)">Growth Stage (50 - 249 FTEs)</option>
                </select>
              </div>
            </div>

            {industry === 'Other' && (
              <div>
                <label className="block text-gray-700 font-semibold mb-1.5">
                  Specify Custom Industry
                </label>
                <input
                  type="text"
                  placeholder="e.g. Renewable Energy & Utilities"
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] text-xs transition-all shadow-xs"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-semibold mb-1.5">
                Company Description &amp; Scope
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary of operations, product verticals, and operational debrief requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] text-xs leading-relaxed transition-all shadow-xs"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold text-xs transition-all shadow-md hover:shadow-lg"
              >
                <span>Continue to Role Passwords</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PASSWORD-PROTECTED RBAC CREDENTIALS (MINIMUM 8 CHARACTERS) */}
        {step === 2 && (
          <form onSubmit={handleStep2Next} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-blue-900">
                <Lock className="w-4 h-4 text-[#1A73E8]" />
                <span className="font-semibold">Security Rule: Every role requires an individual password of at least 8 characters.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="flex items-center space-x-1 text-xs text-[#1A73E8] hover:underline font-medium shrink-0 ml-2"
              >
                {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPasswords ? 'Hide' : 'Reveal'}</span>
              </button>
            </div>

            {/* CEO Password */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-gray-900 font-bold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span>1. Chief Executive Officer (CEO / Sovereign)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full ${
                  isPasswordValid(ceoPassword) 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {ceoPassword.length}/8+ chars
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Unrestricted access to all 3 modules (Sales, Cybersecurity, HR) and Cross-Module Insights.
              </p>
              <input
                type={showPasswords ? 'text' : 'password'}
                required
                placeholder="Enter 8+ character password for CEO..."
                value={ceoPassword}
                onChange={(e) => setCeoPassword(e.target.value)}
                className={`w-full bg-white border rounded-xl px-3.5 py-2 text-gray-900 focus:outline-none focus:ring-2 font-mono text-xs transition-all ${
                  ceoPassword.length > 0 && !isPasswordValid(ceoPassword)
                    ? 'border-rose-300 focus:ring-rose-400'
                    : isPasswordValid(ceoPassword)
                    ? 'border-emerald-400 focus:ring-emerald-400'
                    : 'border-gray-300 focus:ring-[#1A73E8]'
                }`}
              />
            </div>

            {/* Sales Manager Password */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-gray-900 font-bold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>2. Sales &amp; Revenue Director</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full ${
                  isPasswordValid(salesPassword) 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {salesPassword.length}/8+ chars
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Strictly unlocks Module 1: Sales &amp; Marketing Analytics ONLY.
              </p>
              <input
                type={showPasswords ? 'text' : 'password'}
                required
                placeholder="Enter 8+ character password for Sales Director..."
                value={salesPassword}
                onChange={(e) => setSalesPassword(e.target.value)}
                className={`w-full bg-white border rounded-xl px-3.5 py-2 text-gray-900 focus:outline-none focus:ring-2 font-mono text-xs transition-all ${
                  salesPassword.length > 0 && !isPasswordValid(salesPassword)
                    ? 'border-rose-300 focus:ring-rose-400'
                    : isPasswordValid(salesPassword)
                    ? 'border-emerald-400 focus:ring-emerald-400'
                    : 'border-gray-300 focus:ring-[#1A73E8]'
                }`}
              />
            </div>

            {/* Security Director Password */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-gray-900 font-bold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  <span>3. Information Security Officer (CISO / InfoSec)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full ${
                  isPasswordValid(secPassword) 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {secPassword.length}/8+ chars
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Strictly unlocks Module 2: Cybersecurity Threat Model ONLY.
              </p>
              <input
                type={showPasswords ? 'text' : 'password'}
                required
                placeholder="Enter 8+ character password for InfoSec VP..."
                value={secPassword}
                onChange={(e) => setSecPassword(e.target.value)}
                className={`w-full bg-white border rounded-xl px-3.5 py-2 text-gray-900 focus:outline-none focus:ring-2 font-mono text-xs transition-all ${
                  secPassword.length > 0 && !isPasswordValid(secPassword)
                    ? 'border-rose-300 focus:ring-rose-400'
                    : isPasswordValid(secPassword)
                    ? 'border-emerald-400 focus:ring-emerald-400'
                    : 'border-gray-300 focus:ring-[#1A73E8]'
                }`}
              />
            </div>

            {/* HR Lead Password */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-gray-900 font-bold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>4. HR &amp; Workforce Lead</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full ${
                  isPasswordValid(hrPassword) 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {hrPassword.length}/8+ chars
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Strictly unlocks Module 3: HR &amp; Workforce Management ONLY.
              </p>
              <input
                type={showPasswords ? 'text' : 'password'}
                required
                placeholder="Enter 8+ character password for HR Lead..."
                value={hrPassword}
                onChange={(e) => setHrPassword(e.target.value)}
                className={`w-full bg-white border rounded-xl px-3.5 py-2 text-gray-900 focus:outline-none focus:ring-2 font-mono text-xs transition-all ${
                  hrPassword.length > 0 && !isPasswordValid(hrPassword)
                    ? 'border-rose-300 focus:ring-rose-400'
                    : isPasswordValid(hrPassword)
                    ? 'border-emerald-400 focus:ring-emerald-400'
                    : 'border-gray-300 focus:ring-[#1A73E8]'
                }`}
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-800 font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold text-xs transition-all shadow-md hover:shadow-lg"
              >
                <span>Continue to Governance</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SECURITY & GOVERNANCE CONFIRMATION */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center space-x-2 text-amber-800 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Mandatory Architecture Notice Agreement</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-900/90 font-mono">
                &ldquo;Cautionary Notice: This web app uses standard server architecture. Do not upload classified, HIPAA, or unencrypted PII without secondary encryption layers.&rdquo;
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2.5">
              <h4 className="font-semibold text-gray-900 uppercase tracking-wider text-[11px]">
                Registration Summary
              </h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                  <span className="font-medium text-gray-500">Enterprise:</span>
                  <span className="text-gray-900 font-bold">{companyName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                  <span className="font-medium text-gray-500">Industry Sector:</span>
                  <span className="text-gray-800">{industry === 'Other' ? customIndustry : industry}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                  <span className="font-medium text-gray-500">Operational Scope:</span>
                  <span className="text-gray-800">{operationalScope}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-gray-500">RBAC Security Policy:</span>
                  <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>4 Unique Passwords Enforced (8+ characters)</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] leading-relaxed">
              <strong>Zero-Trust Protocol:</strong> Upon submission, you will be automatically logged out and returned to the role-specific login gate to authenticate with your role password.
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-800 font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md hover:shadow-lg"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Save Credentials &amp; Proceed to Login</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
