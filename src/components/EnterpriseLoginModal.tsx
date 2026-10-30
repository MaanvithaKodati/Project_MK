import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  Lock, 
  KeyRound, 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  CheckCircle2,
  Users,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { EnterpriseProfile, UserRole } from '../types';
import { ENTERPRISE_ROLES } from '../data/mockData';

interface EnterpriseLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  enterprises: EnterpriseProfile[];
  onLoginSuccess: (enterprise: EnterpriseProfile, role: UserRole) => void;
  onOpenRegister: () => void;
  preselectedRole?: UserRole;
  isSwitchingRole?: boolean;
  notificationMsg?: string | null;
}

export const EnterpriseLoginModal: React.FC<EnterpriseLoginModalProps> = ({
  isOpen,
  onClose,
  enterprises,
  onLoginSuccess,
  onOpenRegister,
  preselectedRole,
  isSwitchingRole = false,
  notificationMsg,
}) => {
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>(
    enterprises[0]?.id || ''
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>(preselectedRole || 'CEO');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeEnterprise = enterprises.find(e => e.id === selectedEnterpriseId) || enterprises[0];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnterprise) {
      setErrorMsg('No enterprise selected. Please register a company first.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg(`Please enter the password for ${ENTERPRISE_ROLES[selectedRole].label}.`);
      return;
    }

    const expectedPassword = activeEnterprise.credentials[selectedRole];
    if (password.trim() !== expectedPassword) {
      setErrorMsg(`Authentication failed. Incorrect password for ${ENTERPRISE_ROLES[selectedRole].label}.`);
      return;
    }

    setErrorMsg(null);
    setPassword('');
    onLoginSuccess(activeEnterprise, selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1A73E8] shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isSwitchingRole ? 'Authenticate Role Elevation' : 'Enterprise Secure Authentication'}
            </h2>
            <p className="text-xs text-gray-500">
              {isSwitchingRole ? 'Verify password for target role' : 'Select assigned role & enter credentials'}
            </p>
          </div>
        </div>

        {notificationMsg && (
          <div className="p-3.5 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{notificationMsg}</div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          {/* Select Organization */}
          {!isSwitchingRole && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1.5">
                Enterprise Workspace
              </label>
              <select
                value={selectedEnterpriseId}
                onChange={(e) => {
                  setSelectedEnterpriseId(e.target.value);
                  setPassword('');
                  setErrorMsg(null);
                }}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] text-xs transition-all shadow-xs"
              >
                {enterprises.map((ent) => (
                  <option key={ent.id} value={ent.id}>
                    {ent.companyName} ({ent.industry})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Select Target Role */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5">
              Select Authenticating Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(ENTERPRISE_ROLES) as UserRole[]).map((rKey) => {
                const isSelected = selectedRole === rKey;
                const r = ENTERPRISE_ROLES[rKey];
                return (
                  <button
                    key={rKey}
                    type="button"
                    onClick={() => {
                      setSelectedRole(rKey);
                      setPassword('');
                      setErrorMsg(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 border-[#1A73E8] text-gray-900 shadow-sm ring-1 ring-blue-300'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-[#1A73E8] px-1.5 py-0.5 rounded bg-blue-100">
                        {r.avatarInitials}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />}
                    </div>
                    <div className="font-semibold text-xs text-gray-900 truncate">
                      {r.label}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate mt-0.5">
                      {rKey === 'CEO' ? 'All 3 Modules Unlocked' : `${rKey.replace('_', ' ')} Only`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Password Input - STRICTLY NO DEMO HINTS OR PRE-FILL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-gray-700 font-semibold">
                {ENTERPRISE_ROLES[selectedRole].label} Password <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center space-x-1 text-xs text-[#1A73E8] hover:underline font-medium"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="off"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] font-mono text-xs shadow-xs"
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              Protected by Zero-Trust RBAC. Enter the password set during enterprise registration.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-bold text-xs transition-all shadow-md hover:shadow-lg"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Password &amp; Unlock Workspace</span>
            </button>

            {!isSwitchingRole && (
              <div className="text-center pt-1">
                <span className="text-gray-500 text-xs">Registering a new company? </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenRegister();
                  }}
                  className="text-[#1A73E8] hover:underline text-xs font-semibold"
                >
                  Create Enterprise Workspace
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
