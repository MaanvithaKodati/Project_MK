export type UserRole = 'CEO' | 'SALES_MANAGER' | 'SECURITY_DIRECTOR' | 'HR_LEAD';

export type NavigationTab = 
  | 'ceo-overview' 
  | 'cross-module-insights'
  | 'sales-analytics' 
  | 'cyber-threats' 
  | 'hr-management' 
  | 'security-portal';

export interface RoleConfig {
  id: UserRole;
  label: string;
  department: string;
  clearanceLevel: string;
  clearanceBadge: string;
  avatarInitials: string;
  allowedTabs: NavigationTab[];
  description: string;
}

export interface EnterpriseCredentials {
  CEO: string;
  SALES_MANAGER: string;
  SECURITY_DIRECTOR: string;
  HR_LEAD: string;
}

export interface EnterpriseProfile {
  id: string;
  companyName: string;
  industry: string;
  description: string;
  operationalScope: string;
  registeredAt: string;
  credentials: EnterpriseCredentials;
}

// Module 1: Sales & Marketing Analytics
export interface ProductPerformance {
  id: string;
  name: string;
  category: 'Enterprise SaaS' | 'API & Cloud' | 'Hardware & Edge' | 'Professional Services' | 'Security Add-on';
  fy2023Revenue: number;
  fy2024Revenue: number;
  growthPercentage: number;
  projectedBoostPercentFY25: number;
  marginPercent: number;
  volumeUnits: number;
  growthDriverRationale: string;
}

export interface QuarterlySales {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  fy2023: number;
  fy2024: number;
  projectedFy25: number;
}

export interface RegionalSales {
  region: string;
  revenueFY24: number;
  sharePercent: number;
  growthYoY: number;
}

export interface SalesDataset {
  totals: {
    fy2023: number;
    fy2024: number;
    fy2025Projected: number;
    growthYoY: number;
    averageMargin: number;
  };
  products: ProductPerformance[];
  quarterly: QuarterlySales[];
  regional: RegionalSales[];
}

// Module 2: Cybersecurity Threat Model
export type ThreatSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';

export interface ThreatVector {
  id: string;
  area: string;
  targetCategory: 'API Endpoints' | 'Identity & Phishing' | 'Cloud IAM & Storage' | 'Legacy Auth & VPN' | 'Container & K8s';
  severity: ThreatSeverity;
  fy23Incidents: number;
  fy24Incidents: number;
  changePct: number;
  cveReferences: string[];
  description: string;
  recommendedMitigation: string;
}

export interface SystemPerimeter {
  id: string;
  name: string;
  tier: 'Tier 1 Core' | 'Tier 2 Auxiliary' | 'Tier 3 Dev/Staging';
  status: 'SAFE' | 'AT_RISK' | 'CRITICAL_WATCH';
  vulnerabilitiesCount: number;
  encryptionProtocol: string;
  complianceReady: boolean;
  lastScanned: string;
}

export interface RemediationMilestone {
  id: string;
  timeline: '30-Day Immediate' | '60-Day Architecture' | '90-Day Audit Readiness';
  action: string;
  owner: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
  impactDescription: string;
}

export interface SecurityScorecard {
  overallHealthScore: number;
  activeCriticalThreats: number;
  safeSystemsPercentage: number;
  meanTimeToDetectHours: number;
  meanTimeToRemediateHours: number;
  soc2ReadinessPercent: number;
  iso27001ReadinessPercent: number;
}

export interface CyberAuditDataset {
  scorecard: SecurityScorecard;
  threatVectors: ThreatVector[];
  systems: SystemPerimeter[];
  remediationRoadmap: RemediationMilestone[];
  auditHistory: {
    period: string;
    criticalFindings: number;
    highFindings: number;
    remediatedFindings: number;
  }[];
}

// Module 3: HR & Workforce Management
export interface EmployeeRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  managerName?: string;
  salary: number;
  employmentStatus?: 'Full-Time' | 'Contract' | 'Onboarding' | 'Terminated';
  level?: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7';
  bonusPercentage?: number;
  equityUnits?: number;
  tenureYears?: number;
  turnoverRisk?: 'LOW' | 'MEDIUM' | 'HIGH';
  location?: string;
}

export interface EmployerLeadRecord {
  id: string;
  executiveName: string;
  departmentManaged: string;
  operationalBudget: number;
  notes?: string;
}

export interface DepartmentPayroll {
  department: string;
  headcount: number;
  totalPayroll: number;
  averageSalary: number;
  percentageOfBudget: number;
  openHeadcount: number;
  budgetCap: number;
}

export interface SalaryBandDistribution {
  band: string;
  rangeMin: number;
  rangeMax: number;
  headcount: number;
  percentageOfStaff: number;
}

export interface HrDataset {
  metrics: {
    totalAnnualPayroll: number;
    totalHeadcount: number;
    averageCompensation: number;
    retentionRate: number;
    openRequisitions: number;
    bonusPoolTotal: number;
  };
  departments: DepartmentPayroll[];
  salaryBands: SalaryBandDistribution[];
  employees: EmployeeRecord[];
  employers?: EmployerLeadRecord[];
}

export interface AiDebriefResult {
  analysis: string;
  source: string;
  generatedAt: string;
}

// Cross-Module Insights Types
export interface CorrelationDataPoint {
  timePeriod: string;
  metricA: { name: string; value: number; formatted: string };
  metricB: { name: string; value: number; formatted: string };
  insightNote?: string;
}

export interface CrossModuleCorrelation {
  id: string;
  title: string;
  category: 'Sales-Security' | 'HR-Sales' | 'SecOps-HR' | 'Financial-Operational';
  modulesInvolved: string[];
  correlationCoefficient: number; // between -1.0 and +1.0
  correlationStrength: 'Strong Positive' | 'Moderate Positive' | 'Strong Negative' | 'Emerging Trend';
  executiveSummary: string;
  detailedAnalysis: string;
  strategicRecommendation: string;
  riskOrOpportunityScore: number; // 0 - 100
  dataPoints: CorrelationDataPoint[];
}

export interface SimulationParameters {
  salesRepsAddition: number; // e.g. +5 or +10 reps
  salesGrowthTargetPct: number; // e.g. +30%
  secopsHiringRate: number; // e.g. +2 or +4 engineers
  cyberBudgetChangePct: number; // e.g. +10% or -5%
}

export interface SimulationResult {
  projectedRevenue: number;
  projectedApiTrafficIncreasePct: number;
  projectedThreatIncidents: number;
  projectedMttrHours: number;
  estimatedNetProfitImpact: number;
  feasibilityRating: 'OPTIMAL' | 'MODERATE_RISK' | 'CRITICAL_BOTTLENECK';
  narrative: string;
}

