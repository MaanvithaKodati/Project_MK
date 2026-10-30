import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShieldAlert, 
  Users, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  DollarSign, 
  CheckCircle, 
  Activity, 
  Briefcase, 
  ExternalLink, 
  RefreshCw, 
  FileText, 
  Layers, 
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { SalesDataset, CyberAuditDataset, HrDataset, NavigationTab, AiDebriefResult } from '../types';
import { requestCeoDebrief } from '../services/aiService';

interface CeoUnifiedOverviewProps {
  salesData: SalesDataset;
  cyberData: CyberAuditDataset;
  hrData: HrDataset;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenExport: () => void;
}

export const CeoUnifiedOverview: React.FC<CeoUnifiedOverviewProps> = ({
  salesData,
  cyberData,
  hrData,
  onNavigateTab,
  onOpenExport,
}) => {
  const [aiReport, setAiReport] = useState<AiDebriefResult | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateAiBriefing = async () => {
    setIsGeneratingAi(true);
    try {
      const result = await requestCeoDebrief({
        salesTotals: salesData.totals,
        cyberScorecard: cyberData.scorecard,
        activeVectorsCount: cyberData.threatVectors.length,
        hrMetrics: hrData.metrics,
        departmentDistribution: hrData.departments,
      });
      setAiReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const hasSalesData = salesData.products.length > 0 || salesData.totals.fy2024 > 0;
  const hasCyberData = cyberData.threatVectors.length > 0 || cyberData.scorecard.safeSystemsPercentage > 0;
  const hasHrData = hrData.employees.length > 0 || hrData.metrics.totalHeadcount > 0;
  const isAllEmpty = !hasSalesData && !hasCyberData && !hasHrData;

  const yoyGrowthPct = salesData.totals.fy2023 > 0 
    ? (((salesData.totals.fy2024 - salesData.totals.fy2023) / salesData.totals.fy2023) * 100).toFixed(1)
    : null;

  const topDriver = salesData.products.length > 0 
    ? [...salesData.products].sort((a,b) => b.growthPercentage - a.growthPercentage)[0] 
    : null;

  const primaryThreat = cyberData.threatVectors.length > 0 ? cyberData.threatVectors[0] : null;
  const totalHeadcount = hrData.metrics.totalHeadcount || hrData.employees.length;

  const rdSecopsBudget = hrData.departments
    .filter(d => d.department.toLowerCase().includes('engineering') || d.department.toLowerCase().includes('secops') || d.department.toLowerCase().includes('security'))
    .reduce((sum, d) => sum + d.totalPayroll, 0);
  const rdSecopsPct = hrData.metrics.totalAnnualPayroll > 0 
    ? ((rdSecopsBudget / hrData.metrics.totalAnnualPayroll) * 100).toFixed(1)
    : '0';

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Executive Command Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-50 border border-blue-200 text-[#1A73E8]">
              Sovereign Executive Tier
            </span>
            <span className="text-xs text-gray-400">&bull;</span>
            <span className="text-xs text-gray-500 font-medium">Real-Time Enterprise Command</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            CEO Unified Command Dashboard
          </h1>
          <p className="text-xs text-gray-600 mt-0.5 max-w-3xl">
            Synthesizing commercial revenue momentum, cybersecurity threat perimeter vectors, and workforce payroll allocations into actionable executive decisions.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleGenerateAiBriefing}
            disabled={isGeneratingAi}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold text-xs transition-all shadow-sm disabled:opacity-50"
          >
            {isGeneratingAi ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isGeneratingAi ? 'Synthesizing...' : 'Run CEO AI Synthesis'}</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium text-xs transition-colors shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-gray-500" />
            <span>Export Debrief</span>
          </button>
        </div>
      </div>

      {/* Zero Pre-Loaded Data Guidance Banner */}
      {isAllEmpty && (
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1A73E8] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">
                Zero Pre-Loaded Departmental Data
              </p>
              <p className="text-gray-600 text-xs mt-0.5">
                All mock figures have been cleared. Ingest your organization&apos;s departmental reports (PDF/CSV/TXT) or record items in the modules below to populate executive intelligence.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('sales-analytics')}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-medium text-xs transition-colors"
            >
              Upload Sales Reports &rarr;
            </button>
            <button
              onClick={() => onNavigateTab('cyber-threats')}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-medium text-xs transition-colors"
            >
              Upload Cyber Audits &rarr;
            </button>
            <button
              onClick={() => onNavigateTab('hr-management')}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-medium text-xs transition-colors"
            >
              Add Personnel &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 3 CORE PILLARS: QUICK METRICS ROW (Sales, Cybersecurity, HR) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PILLAR 1: SALES GROWTH */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Sales &amp; Revenue</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {yoyGrowthPct !== null ? `${Number(yoyGrowthPct) >= 0 ? '+' : ''}${yoyGrowthPct}% YoY` : (hasSalesData ? 'Active Ingestion' : 'Pending Ingestion')}
              </span>
            </div>

            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {formatCurrency(salesData.totals.fy2024)}
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                <span>Current Closed Revenue vs</span>
                <span className="font-semibold text-gray-700">{formatCurrency(salesData.totals.fy2023)} Prior</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Target Forecast:</span>
                <span className="font-semibold text-[#1A73E8]">
                  {formatCurrency(salesData.totals.fy2025Projected)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Top Growth Driver:</span>
                <span className="font-medium text-gray-800 truncate ml-2">
                  {topDriver ? `${topDriver.name} (+${topDriver.growthPercentage}%)` : (hasSalesData ? 'General Line' : 'No line items')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Gross Margin:</span>
                <span className="font-semibold text-emerald-700">{salesData.totals.averageMargin}%</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3">
            <button
              onClick={() => onNavigateTab('sales-analytics')}
              className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 text-xs font-semibold transition-colors"
            >
              <span>Drill Into Sales Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* PILLAR 2: CYBERSECURITY THREATS */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xs flex flex-col justify-between hover:border-rose-300 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-xs font-semibold text-rose-700 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Cyber Defense Posture</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                cyberData.scorecard.safeSystemsPercentage >= 70
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : cyberData.scorecard.safeSystemsPercentage > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>
                {cyberData.scorecard.safeSystemsPercentage > 0 ? `${cyberData.scorecard.safeSystemsPercentage}% SAFE` : (hasCyberData ? 'Evaluating' : 'Audit Pending')}
              </span>
            </div>

            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-baseline space-x-2">
                <span className={cyberData.scorecard.activeCriticalThreats > 0 ? 'text-rose-600' : 'text-gray-900'}>
                  {cyberData.scorecard.activeCriticalThreats}
                </span>
                <span className="text-sm font-normal text-gray-500">Critical Active Vectors</span>
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                <span>Mean Remediation Time:</span>
                <span className="font-semibold text-gray-800">{cyberData.scorecard.meanTimeToRemediateHours}h</span>
                <span className="text-gray-400">&bull; MTTR</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">SOC 2 Readiness:</span>
                <span className="font-semibold text-emerald-700">
                  {cyberData.scorecard.soc2ReadinessPercent}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Primary Risk Vector:</span>
                <span className="font-medium text-rose-700 truncate ml-2">
                  {primaryThreat ? primaryThreat.area : (hasCyberData ? 'Perimeter Secure' : 'No vectors logged')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Perimeter Status:</span>
                <span className="font-medium text-gray-800">
                  {cyberData.threatVectors.length > 0 ? `${cyberData.threatVectors.length} Vectors Monitored` : 'Awaiting Audit'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3">
            <button
              onClick={() => onNavigateTab('cyber-threats')}
              className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 text-xs font-semibold transition-colors"
            >
              <span>Inspect Threat Vectors</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* PILLAR 3: HR & WORKFORCE PAYROLL */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                <Users className="w-4 h-4 text-[#1A73E8]" />
                <span>Workforce &amp; Payroll</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                {totalHeadcount} Staff
              </span>
            </div>

            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {formatCurrency(hrData.metrics.totalAnnualPayroll)}
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                <span>Annualized Payroll &bull; Avg:</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(hrData.metrics.averageCompensation)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Retention Stability:</span>
                <span className="font-semibold text-emerald-700">
                  {hrData.metrics.retentionRate > 0 ? `${hrData.metrics.retentionRate}%` : (hasHrData ? 'Evaluating' : 'Pending Ingestion')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">R&amp;D + SecOps Allocation:</span>
                <span className="font-semibold text-[#1A73E8]">
                  {Number(rdSecopsPct) > 0 ? `${rdSecopsPct}% (${formatCurrency(rdSecopsBudget)})` : (hasHrData ? 'Calculating...' : 'Pending Ingestion')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Active Requisitions:</span>
                <span className="font-medium text-gray-800">{hrData.metrics.openRequisitions} positions</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3">
            <button
              onClick={() => onNavigateTab('hr-management')}
              className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 text-xs font-semibold transition-colors"
            >
              <span>Manage Compensation &amp; Org</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* AI STRATEGIC DEBRIEF SYNTHESIS CARD */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1A73E8]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Executive Tri-Pillar Strategic Synthesis
              </h3>
              <p className="text-xs text-gray-500">
                Automated multi-departmental intelligence generated for C-Suite alignment
              </p>
            </div>
          </div>

          {aiReport && (
            <span className="text-[11px] text-gray-400">
              Generated: {aiReport.generatedAt}
            </span>
          )}
        </div>

        {/* Synthesis Body */}
        <div>
          {aiReport ? (
            <div className="text-xs sm:text-sm text-gray-800 leading-relaxed space-y-3 whitespace-pre-line bg-blue-50/50 p-4 rounded-xl border border-blue-200">
              {aiReport.analysis}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="text-emerald-700 font-semibold mb-1 flex items-center space-x-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Commercial Acceleration</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-[11px]">
                    Sales revenue trajectory is tied directly to customer acquisition. Ingest financial records to project multi-year revenue margins.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="text-rose-700 font-semibold mb-1 flex items-center space-x-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Threat Ingress Correlation</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-[11px]">
                    Customer API expansions expand attack perimeters. Remediating vulnerabilities protects enterprise contract commitments.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="text-blue-700 font-semibold mb-1 flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Workforce Capacity Alignment</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-[11px]">
                    Headcount allocations across engineering and SecOps maintain service reliability and support commercial targets.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                <span className="text-blue-900 font-medium">
                  Synthesize real-time executive briefing from current multi-module data?
                </span>
                <button
                  onClick={handleGenerateAiBriefing}
                  disabled={isGeneratingAi}
                  className="px-4 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  Generate AI Briefing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CROSS-DEPARTMENTAL ACTION DIRECTIVES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operational Health Gauges */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#1A73E8]" />
              <span>Operational Health Indices</span>
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active Monitoring
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Sales Health */}
            <div>
              <div className="flex justify-between items-center mb-1 text-gray-700 font-medium">
                <span>Commercial Momentum</span>
                <span className="font-semibold text-emerald-700">92% Target Pace</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            {/* Security Health */}
            <div>
              <div className="flex justify-between items-center mb-1 text-gray-700 font-medium">
                <span>Perimeter Hardening</span>
                <span className="font-semibold text-[#1A73E8]">
                  {cyberData.scorecard.safeSystemsPercentage > 0 ? `${cyberData.scorecard.safeSystemsPercentage}% Hardened` : '85% Baseline'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-[#1A73E8] rounded-full" style={{ width: `${cyberData.scorecard.safeSystemsPercentage || 85}%` }} />
              </div>
            </div>

            {/* Workforce Health */}
            <div>
              <div className="flex justify-between items-center mb-1 text-gray-700 font-medium">
                <span>Workforce Stability &amp; Retention</span>
                <span className="font-semibold text-purple-700">
                  {hrData.metrics.retentionRate > 0 ? `${hrData.metrics.retentionRate}% Retained` : '94% Target'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: `${hrData.metrics.retentionRate || 94}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Board Strategy Directives */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span>Board-Level Strategic Action Directives</span>
            </h3>
            <span className="text-[11px] font-semibold text-gray-500">
              Q1-Q4 ROADMAP
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start space-x-3">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1A73E8] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <span className="font-semibold text-gray-900">Reinvest SaaS Margins into Zero-Trust SecOps</span>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Allocate incremental gross margin from sales expansion to complete token rotation and deprecate legacy authenticators.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start space-x-3">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <span className="font-semibold text-gray-900">Mitigate API Vulnerability Vectors Before Scaling Tier-1 Contracts</span>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Automate schema introspection guards to protect enterprise customer data stores from shadow scraping.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start space-x-3">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <span className="font-semibold text-gray-900">Execute Targeted DevSecOps Retention Grants</span>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Issue supplemental equity packages for senior security architects to safeguard against market attrition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
