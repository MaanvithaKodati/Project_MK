import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  GitCompare 
} from 'lucide-react';
import { SalesDataset, CyberAuditDataset, HrDataset, UserRole } from '../types';
import { CROSS_MODULE_CORRELATIONS } from '../data/mockData';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  salesData: SalesDataset;
  cyberData: CyberAuditDataset;
  hrData: HrDataset;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  salesData,
  cyberData,
  hrData,
}) => {
  const [reportType, setReportType] = useState<'CEO' | 'SALES' | 'CYBER' | 'HR' | 'CORRELATIONS'>('CEO');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdownReport = (): string => {
    const timestamp = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    switch (reportType) {
      case 'CEO':
        return `# ENTERPRISE OS • EXECUTIVE COMMAND DEBRIEF
**Date**: ${timestamp}
**Clearance Tier**: Sovereign Executive
**Confidentiality**: Enterprise Internal (Cautionary Notice: Standard Server Architecture)

---

## 1. Executive Summary & Tri-Pillar Health
- **Commercial Closed Revenue**: $${(salesData.totals.fy2024 / 1_000_000).toFixed(2)}M (+${salesData.totals.growthYoY}% YoY Growth)
- **Active Cybersecurity Threats**: ${cyberData.scorecard.activeCriticalThreats} Critical Vectors Isolated | Safe Systems: ${cyberData.scorecard.safeSystemsPercentage}%
- **Total Workforce Annual Payroll**: $${(hrData.metrics.totalAnnualPayroll / 1_000_000).toFixed(2)}M across ${hrData.metrics.totalHeadcount} FTEs (Retention: ${hrData.metrics.retentionRate}%)

---

## 2. Commercial Performance
- Total Revenue: $${salesData.totals.fy2024.toLocaleString()}
- Target Forecast: $${salesData.totals.fy2025Projected.toLocaleString()}
- Average Gross Margin: ${salesData.totals.averageMargin}%
- Products Monitored: ${salesData.products.length}

---

## 3. Cybersecurity Defense Posture
- Overall Health Score: ${cyberData.scorecard.overallHealthScore}/100
- SOC 2 Type II Readiness: ${cyberData.scorecard.soc2ReadinessPercent}%
- MTTR: ${cyberData.scorecard.meanTimeToRemediateHours}h | MTTD: ${cyberData.scorecard.meanTimeToDetectHours}h

---

## 4. Workforce & Payroll Distribution
- Total Annualized Payroll: $${hrData.metrics.totalAnnualPayroll.toLocaleString()}
- Average Compensation: $${hrData.metrics.averageCompensation.toLocaleString()}
- Departments Monitored: ${hrData.departments.length}

Report generated via Enterprise OS • Sentinel & Synthetics Platform
Designed & Engineered by Maanvitha Kodati | Enterprise Intelligence Architecture`;

      case 'SALES':
        return `# MODULE 1: SALES & MARKETING ANALYTICS REPORT
**Date**: ${timestamp}
**Clearance**: Commercial Tier-2 & Executive

## Financial Totals
- Prior Baseline Revenue: $${salesData.totals.fy2023.toLocaleString()}
- Current Closed Revenue: $${salesData.totals.fy2024.toLocaleString()}
- YoY Growth: +${salesData.totals.growthYoY}%
- Projected Revenue: $${salesData.totals.fy2025Projected.toLocaleString()}

## Product Line Performance
${salesData.products.map(p => `- **${p.name}** (${p.category}): $${p.fy2024Revenue.toLocaleString()} (+${p.growthPercentage}%) | Margin: ${p.marginPercent}%`).join('\n')}

Report generated via Enterprise OS`;

      case 'CYBER':
        return `# MODULE 2: CYBERSECURITY THREAT AUDIT REPORT
**Date**: ${timestamp}
**Clearance**: InfoSec Tier-2 & Executive

## Posture Scorecard
- Posture Health Score: ${cyberData.scorecard.overallHealthScore}/100
- Critical Active Threats: ${cyberData.scorecard.activeCriticalThreats}
- Safe Systems Ratio: ${cyberData.scorecard.safeSystemsPercentage}%

## Threat Vectors
${cyberData.threatVectors.map(t => `- [${t.severity}] **${t.area}** (${t.targetCategory}): ${t.fy24Incidents} incidents | Mitigation: ${t.recommendedMitigation}`).join('\n')}

Report generated via Enterprise OS`;

      case 'HR':
        return `# MODULE 3: HR & WORKFORCE ALLOCATION REPORT
**Date**: ${timestamp}
**Clearance**: PeopleOps Tier-2 & Executive

## Workforce Metrics
- Headcount: ${hrData.metrics.totalHeadcount} FTEs
- Annual Payroll: $${hrData.metrics.totalAnnualPayroll.toLocaleString()}
- Retention Rate: ${hrData.metrics.retentionRate}%

## Departments
${hrData.departments.map(d => `- **${d.department}**: ${d.headcount} staff | Payroll: $${d.totalPayroll.toLocaleString()} | Avg: $${d.averageSalary.toLocaleString()}`).join('\n')}

Report generated via Enterprise OS`;

      case 'CORRELATIONS':
        return `# CROSS-MODULE INTELLIGENCE & CORRELATIONS
**Date**: ${timestamp}
**Clearance**: CEO Executive Sovereign

${CROSS_MODULE_CORRELATIONS.map(c => `### ${c.title} (${c.category})
- Correlation: r = ${c.correlationCoefficient} (${c.correlationStrength})
- Modules: ${c.modulesInvolved.join(' ↔ ')}
- Analysis: ${c.detailedAnalysis}
- Directive: ${c.strategicRecommendation}
`).join('\n---\n')}

Report generated via Enterprise OS`;
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJson = () => {
    const fullState = {
      exportedAt: new Date().toISOString(),
      currentRole,
      salesData,
      cyberData,
      hrData,
    };
    const blob = new Blob([JSON.stringify(fullState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enterprise-os-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-2xl w-full bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1A73E8]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Export Executive Debrief &amp; Intelligence Reports
            </h2>
            <p className="text-xs text-gray-500">
              Generate formatted markdown summaries or download raw JSON telemetry.
            </p>
          </div>
        </div>

        {/* Report Selector Pills */}
        <div className="space-y-3 mb-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setReportType('CEO')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                reportType === 'CEO'
                  ? 'bg-blue-50 text-[#1A73E8] border border-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              CEO Unified Brief
            </button>
            <button
              onClick={() => setReportType('SALES')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                reportType === 'SALES'
                  ? 'bg-blue-50 text-[#1A73E8] border border-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Sales Analytics
            </button>
            <button
              onClick={() => setReportType('CYBER')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                reportType === 'CYBER'
                  ? 'bg-blue-50 text-[#1A73E8] border border-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Cyber Threat Audit
            </button>
            <button
              onClick={() => setReportType('HR')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                reportType === 'HR'
                  ? 'bg-blue-50 text-[#1A73E8] border border-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              HR Workforce
            </button>
            <button
              onClick={() => setReportType('CORRELATIONS')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                reportType === 'CORRELATIONS'
                  ? 'bg-blue-50 text-[#1A73E8] border border-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Cross-Module Insights
            </button>
          </div>

          {/* Text Preview Area */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs font-mono text-gray-800 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
            {generateMarkdownReport()}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors font-medium"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors font-medium"
            >
              <Printer className="w-4 h-4" />
              <span>Print View</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={handleDownloadJson}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
