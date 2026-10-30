import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  NavigationTab, 
  SalesDataset, 
  CyberAuditDataset, 
  HrDataset,
  EnterpriseProfile
} from './types';
import { 
  ENTERPRISE_ROLES, 
  DEFAULT_ENTERPRISE,
  INITIAL_SALES_DATA, 
  INITIAL_CYBER_DATA, 
  INITIAL_HR_DATA 
} from './data/mockData';

// Component imports
import { LandingPage } from './components/LandingPage';
import { EnterpriseRegistrationModal } from './components/EnterpriseRegistrationModal';
import { EnterpriseLoginModal } from './components/EnterpriseLoginModal';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { WelcomeBanner } from './components/WelcomeBanner';
import { CeoUnifiedOverview } from './components/CeoUnifiedOverview';
import { CrossModuleInsights } from './components/CrossModuleInsights';
import { SalesAnalyticsModule } from './components/SalesAnalyticsModule';
import { CybersecurityModule } from './components/CybersecurityModule';
import { HrManagementModule } from './components/HrManagementModule';
import { SecurityPortal } from './components/SecurityPortal';
import { AccessDeniedModal } from './components/AccessDeniedModal';
import { SecurityDisclaimerModal } from './components/SecurityDisclaimerModal';
import { OnboardingTutorialModal } from './components/OnboardingTutorialModal';
import { ExportReportModal } from './components/ExportReportModal';
import { EnterpriseFooter } from './components/EnterpriseFooter';

export default function App() {
  // 1. INITIAL LANDING & LOGIN PAGE (DEFAULT ENTRY POINT: LOCKED)
  // Lock the entire app behind an initial public view. Do NOT open dashboard directly.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Enterprise Workspaces list (persisted in localStorage)
  const [enterprises, setEnterprises] = useState<EnterpriseProfile[]>(() => {
    try {
      const saved = localStorage.getItem('enterprise_os_workspaces');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load saved enterprises:', e);
    }
    return [DEFAULT_ENTERPRISE];
  });

  const [currentEnterprise, setCurrentEnterprise] = useState<EnterpriseProfile>(() => enterprises[0] || DEFAULT_ENTERPRISE);

  // Authenticated Role (CEO, SALES_MANAGER, SECURITY_DIRECTOR, HR_LEAD)
  const [currentRole, setCurrentRole] = useState<UserRole>('CEO');

  // Active Tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('ceo-overview');

  // Datasets
  const [salesData, setSalesData] = useState<SalesDataset>(INITIAL_SALES_DATA);
  const [cyberData, setCyberData] = useState<CyberAuditDataset>(INITIAL_CYBER_DATA);
  const [hrData, setHrData] = useState<HrDataset>(INITIAL_HR_DATA);

  // Modals state
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [roleSwitchTarget, setRoleSwitchTarget] = useState<UserRole | null>(null);
  const [authNotification, setAuthNotification] = useState<string | null>(null);

  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean>(true);
  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [accessDeniedTab, setAccessDeniedTab] = useState<NavigationTab | null>(null);

  // Save enterprises to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('enterprise_os_workspaces', JSON.stringify(enterprises));
    } catch (e) {
      console.warn('Failed to save enterprises:', e);
    }
  }, [enterprises]);

  // Handle successful login
  const handleLoginSuccess = (enterprise: EnterpriseProfile, role: UserRole) => {
    setCurrentEnterprise(enterprise);
    setCurrentRole(role);
    setIsAuthenticated(true);
    setShowLoginModal(false);
    setRoleSwitchTarget(null);
    setAuthNotification(null);

    // Set default tab based on the authenticated role
    const allowed = ENTERPRISE_ROLES[role].allowedTabs;
    setActiveTab(allowed[0]);
  };

  // Handle new enterprise registration
  // MANDATORY RULE: Immediately after company registration and credential creation is completed, 
  // the system MUST automatically log the user out and return to the primary Login Screen with a success notification.
  const handleRegisterComplete = (newEnterprise: EnterpriseProfile) => {
    setEnterprises(prev => [newEnterprise, ...prev]);
    setCurrentEnterprise(newEnterprise);
    setIsAuthenticated(false);
    setShowRegisterModal(false);
    setShowLoginModal(true);
    setAuthNotification(`Enterprise "${newEnterprise.companyName}" successfully registered! System logged out for zero-trust security. Select your role and authenticate with your specific password.`);
  };

  // Lock Session / Log Out -> Returns directly to Landing Page and purges active session
  const handleLockSession = () => {
    setIsAuthenticated(false);
    setRoleSwitchTarget(null);
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setAuthNotification(null);
  };

  // Request to switch role -> Prompts for password of target role
  const handleRequestRoleChange = (targetRole: UserRole) => {
    setRoleSwitchTarget(targetRole);
    setAuthNotification(null);
    setShowLoginModal(true);
  };

  // If user is not authenticated, render the initial landing and entry point
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          onOpenLogin={() => {
            setRoleSwitchTarget(null);
            setAuthNotification(null);
            setShowLoginModal(true);
          }}
          onOpenRegister={() => {
            setAuthNotification(null);
            setShowRegisterModal(true);
          }}
          onOpenDisclaimer={() => setShowDisclaimerModal(true)}
          onOpenTutorial={() => setShowTutorialModal(true)}
        />

        {/* Login Modal */}
        <EnterpriseLoginModal
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false);
            setRoleSwitchTarget(null);
            setAuthNotification(null);
          }}
          enterprises={enterprises}
          onLoginSuccess={handleLoginSuccess}
          onOpenRegister={() => {
            setShowLoginModal(false);
            setAuthNotification(null);
            setShowRegisterModal(true);
          }}
          preselectedRole={roleSwitchTarget || 'CEO'}
          isSwitchingRole={false}
          notificationMsg={authNotification}
        />

        {/* Registration Modal */}
        <EnterpriseRegistrationModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onRegisterComplete={handleRegisterComplete}
        />

        {/* Disclaimer Modal Accessible from Landing Page */}
        <SecurityDisclaimerModal
          isOpen={showDisclaimerModal}
          onClose={() => setShowDisclaimerModal(false)}
        />

        {/* Onboarding Tutorial Modal Accessible from Landing Page */}
        <OnboardingTutorialModal
          isOpen={showTutorialModal}
          onClose={() => setShowTutorialModal(false)}
          onSelectRole={(role) => {
            setShowTutorialModal(false);
            setRoleSwitchTarget(role);
            setShowLoginModal(true);
          }}
        />
      </>
    );
  }

  // POST-LOGIN AUTHENTICATED DASHBOARD EXPERIENCE
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header with Enterprise Name, Industry, and Lock Session / Log Out */}
      <Header
        currentEnterprise={currentEnterprise}
        currentRole={currentRole}
        onRequestRoleChange={handleRequestRoleChange}
        onLogout={handleLockSession}
        onOpenDisclaimer={() => setShowDisclaimerModal(true)}
        onOpenExport={() => setShowExportModal(true)}
        hasSeenWelcome={hasSeenWelcome}
        onShowWelcome={() => setShowTutorialModal(true)}
      />

      {/* Role-Based Navigation Bar strictly tailored to the authenticated role */}
      <Navigation
        activeTab={activeTab}
        onTabSelect={(tab) => setActiveTab(tab)}
        currentRole={currentRole}
        onAttemptRestrictedTab={(tab) => setAccessDeniedTab(tab)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome message banner */}
        {hasSeenWelcome && (
          <WelcomeBanner
            onDismiss={() => setHasSeenWelcome(false)}
            currentRole={currentRole}
            onExploreCeoView={() => {
              if (ENTERPRISE_ROLES[currentRole].allowedTabs.includes('ceo-overview')) {
                setActiveTab('ceo-overview');
              }
            }}
          />
        )}

        {/* Active Tab View strictly authorized for authenticated role */}
        {activeTab === 'ceo-overview' && ENTERPRISE_ROLES[currentRole].allowedTabs.includes('ceo-overview') && (
          <CeoUnifiedOverview
            salesData={salesData}
            cyberData={cyberData}
            hrData={hrData}
            onNavigateTab={(tab) => {
              if (ENTERPRISE_ROLES[currentRole].allowedTabs.includes(tab)) {
                setActiveTab(tab);
              } else {
                setAccessDeniedTab(tab);
              }
            }}
            onOpenExport={() => setShowExportModal(true)}
          />
        )}

        {activeTab === 'cross-module-insights' && ENTERPRISE_ROLES[currentRole].allowedTabs.includes('cross-module-insights') && (
          <CrossModuleInsights
            onOpenExport={() => setShowExportModal(true)}
            salesData={salesData}
            cyberData={cyberData}
            hrData={hrData}
          />
        )}

        {activeTab === 'sales-analytics' && ENTERPRISE_ROLES[currentRole].allowedTabs.includes('sales-analytics') && (
          <SalesAnalyticsModule
            salesData={salesData}
            onUpdateSalesData={setSalesData}
            onOpenExport={() => setShowExportModal(true)}
          />
        )}

        {activeTab === 'cyber-threats' && ENTERPRISE_ROLES[currentRole].allowedTabs.includes('cyber-threats') && (
          <CybersecurityModule
            cyberData={cyberData}
            onUpdateCyberData={setCyberData}
            onOpenExport={() => setShowExportModal(true)}
          />
        )}

        {activeTab === 'hr-management' && ENTERPRISE_ROLES[currentRole].allowedTabs.includes('hr-management') && (
          <HrManagementModule
            hrData={hrData}
            onUpdateHrData={setHrData}
            onOpenExport={() => setShowExportModal(true)}
          />
        )}

        {activeTab === 'security-portal' && (
          <SecurityPortal
            onOpenTutorial={() => setShowTutorialModal(true)}
            onOpenExport={() => setShowExportModal(true)}
          />
        )}
      </main>

      {/* Corporate Enterprise Footer with Creator Attribution */}
      <EnterpriseFooter
        isAuthenticated={true}
        companyName={currentEnterprise.companyName}
        industry={currentEnterprise.industry}
        onOpenDisclaimer={() => setShowDisclaimerModal(true)}
        onOpenTutorial={() => setShowTutorialModal(true)}
        onLockSession={handleLockSession}
      />

      {/* Role Elevation Password Authentication Modal (When switching roles from header) */}
      <EnterpriseLoginModal
        isOpen={showLoginModal && isAuthenticated}
        onClose={() => {
          setShowLoginModal(false);
          setRoleSwitchTarget(null);
          setAuthNotification(null);
        }}
        enterprises={enterprises}
        onLoginSuccess={handleLoginSuccess}
        onOpenRegister={() => setShowRegisterModal(true)}
        preselectedRole={roleSwitchTarget || 'CEO'}
        isSwitchingRole={true}
        notificationMsg={authNotification}
      />

      {/* Access Denied Modal when attempting restricted operations */}
      <AccessDeniedModal
        targetTab={accessDeniedTab}
        currentRole={currentRole}
        onClose={() => setAccessDeniedTab(null)}
        onElevateRole={(newRole) => {
          setAccessDeniedTab(null);
          handleRequestRoleChange(newRole);
        }}
      />

      {/* Security & Governance Disclaimer Modal */}
      <SecurityDisclaimerModal
        isOpen={showDisclaimerModal}
        onClose={() => setShowDisclaimerModal(false)}
      />

      {/* Step-by-Step Onboarding Tutorial Modal */}
      <OnboardingTutorialModal
        isOpen={showTutorialModal}
        onClose={() => setShowTutorialModal(false)}
        onSelectRole={handleRequestRoleChange}
      />

      {/* Unified Executive Export Modal */}
      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        currentRole={currentRole}
        salesData={salesData}
        cyberData={cyberData}
        hrData={hrData}
      />
    </div>
  );
}
