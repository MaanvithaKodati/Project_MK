import React, { useState } from 'react';
import { 
  GitCompare, 
  TrendingUp, 
  ShieldAlert, 
  Users, 
  Sparkles, 
  RefreshCw, 
  Download, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Layers,
  Zap,
  Info,
  Calendar,
  Lock
} from 'lucide-react';
import { 
  CrossModuleCorrelation, 
  SimulationParameters, 
  SimulationResult, 
  AiDebriefResult,
  SalesDataset,
  CyberAuditDataset,
  HrDataset
} from '../types';
import { CROSS_MODULE_CORRELATIONS, INITIAL_SIMULATION_PARAMETERS } from '../data/mockData';
import { requestCrossModuleCorrelations } from '../services/aiService';

interface CrossModuleInsightsProps {
  onOpenExport: () => void;
  salesData?: SalesDataset;
  cyberData?: CyberAuditDataset;
  hrData?: HrDataset;
}

export const CrossModuleInsights: React.FC<CrossModuleInsightsProps> = ({ 
  onOpenExport,
  salesData,
  cyberData,
  hrData
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeCorrelationId, setActiveCorrelationId] = useState<string>('corr-1');
  const [simulation, setSimulation] = useState<SimulationParameters>(INITIAL_SIMULATION_PARAMETERS);
  const [aiReport, setAiReport] = useState<AiDebriefResult | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const hasLiveSales = Boolean(salesData && salesData.totals && salesData.totals.fy2024 > 0);
  const hasLiveCyber = Boolean(cyberData && cyberData.scorecard && cyberData.threatVectors.length > 0);
  const hasLiveHr = Boolean(hrData && hrData.metrics && hrData.employees.length > 0);

  // Filter correlations
  const filteredCorrelations = selectedCategory === 'ALL'
    ? CROSS_MODULE_CORRELATIONS
    : CROSS_MODULE_CORRELATIONS.filter(c => c.category === selectedCategory);

  const activeCorrelation = CROSS_MODULE_CORRELATIONS.find(c => c.id === activeCorrelationId) || CROSS_MODULE_CORRELATIONS[0];

  const baseRevenue = hasLiveSales ? (salesData?.totals.fy2024 || 48250000) : 48250000;

  // Dynamic calculation for What-If Simulator
  const calculateSimulation = (params: SimulationParameters): SimulationResult => {
    const additionalRevenue = (params.salesRepsAddition * 460000) * (1 + params.salesGrowthTargetPct / 100);
    const projectedRevenue = baseRevenue + additionalRevenue;

    // Traffic growth tied to sales surge
    const projectedApiTrafficIncreasePct = Math.round(params.salesGrowthTargetPct * 1.45 + (params.salesRepsAddition * 1.8));

    // Threat incidents scale with API traffic unless mitigated by SecOps
    const rawThreatIncrease = projectedApiTrafficIncreasePct * 0.75;
    const threatMitigation = params.secopsHiringRate * 12 + params.cyberBudgetChangePct * 0.8;
    const netThreatChangePct = Math.max(-40, Math.round(rawThreatIncrease - threatMitigation));
    const projectedThreatIncidents = Math.max(1, Math.round(3 * (1 + netThreatChangePct / 100)));

    // MTTR calculation
    const baseMttr = 4.2;
    const secOpsRelief = params.secopsHiringRate * 0.6 + (params.cyberBudgetChangePct * 0.04);
    const trafficPressure = (projectedApiTrafficIncreasePct / 100) * 1.5;
    const projectedMttrHours = Math.max(1.8, Number((baseMttr - secOpsRelief + trafficPressure).toFixed(1)));

    // Net profit impact
    const salesCost = params.salesRepsAddition * 140000;
    const secOpsCost = params.secopsHiringRate * 160000;
    const cyberBudgetDollar = 2410000 * (params.cyberBudgetChangePct / 100);
    const grossMarginDollar = additionalRevenue * 0.72;
    const estimatedNetProfitImpact = Math.round(grossMarginDollar - salesCost - secOpsCost - cyberBudgetDollar);

    // Feasibility rating
    let feasibilityRating: 'OPTIMAL' | 'MODERATE_RISK' | 'CRITICAL_BOTTLENECK' = 'OPTIMAL';
    if (projectedThreatIncidents >= 6 || projectedMttrHours > 5.5) {
      feasibilityRating = 'CRITICAL_BOTTLENECK';
    } else if (projectedThreatIncidents >= 4 || projectedMttrHours > 4.5 || estimatedNetProfitImpact < 0) {
      feasibilityRating = 'MODERATE_RISK';
    }

    let narrative = '';
    if (feasibilityRating === 'OPTIMAL') {
      narrative = `Target expansion balanced: +${params.salesRepsAddition} sales personnel projected to yield +$${(additionalRevenue / 1_000_000).toFixed(2)}M in revenue, safely matched by SecOps hiring and posture investments.`;
    } else if (feasibilityRating === 'MODERATE_RISK') {
      narrative = `Warning: Expanding sales by +${params.salesGrowthTargetPct}% increases perimeter exposure faster than SecOps remediation. Recommend increasing SecOps hires by at least +${Math.max(1, Math.round(params.salesRepsAddition / 3))} engineers.`;
    } else {
      narrative = `Severe risk bottleneck: Sales activity induces severe API traffic surge with insufficient SecOps defensive capacity. MTTR escalates to ${projectedMttrHours}h, risking Tier-1 SLA penalties.`;
    }

    return {
      projectedRevenue: Math.round(projectedRevenue),
      projectedApiTrafficIncreasePct,
      projectedThreatIncidents,
      projectedMttrHours,
      estimatedNetProfitImpact,
      feasibilityRating,
      narrative,
    };
  };

  const simResult = calculateSimulation(simulation);

  // Trigger Gemini AI Cross-Module Analysis
  const handleRunAiAnalysis = async () => {
    setIsGeneratingAi(true);
    try {
      const summaryPayload = {
        salesSummary: hasLiveSales 
          ? `Closed revenue $${((salesData?.totals.fy2024 || 0) / 1000000).toFixed(1)}M with +${salesData?.totals.growthYoY}% YoY growth.`
          : 'Sales revenue +26.8% YoY growth with strong cloud API traction.',
        cyberSummary: hasLiveCyber
          ? `Perimeter health score ${cyberData?.scorecard.overallHealthScore}/100 with ${cyberData?.scorecard.activeCriticalThreats} critical threats.`
          : 'High API exposure vectors and credential attacks correlated to commercial client onboarding.',
        hrSummary: hasLiveHr
          ? `Workforce of ${hrData?.metrics.totalHeadcount} staff, $${((hrData?.metrics.totalAnnualPayroll || 0) / 1000000).toFixed(1)}M payroll.`
          : 'Sales team expansion currently outpaces dedicated SecOps engineering headcount by 3:1.',
        activeCorrelation: activeCorrelation.title,
        simulationSummary: `Simulating +${simulation.salesRepsAddition} reps with +${simulation.salesGrowthTargetPct}% target vs +${simulation.secopsHiringRate} SecOps engineers.`,
      };

      const res = await requestCrossModuleCorrelations(summaryPayload);
      setAiReport(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 border border-purple-200 text-purple-700 tracking-wider uppercase">
              CEO &bull; Executive Command Exclusive
            </span>
            <span className="text-xs text-gray-400">&bull;</span>
            <span className="text-xs text-gray-500 font-medium">Inter-Departmental Covariance Modeling</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            Cross-Module Intelligence &amp; Correlation Matrix
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Identify how rapid Sales growth influences Cybersecurity incident rates, and align HR headcount with perimeter defense capacity.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleRunAiAnalysis}
            disabled={isGeneratingAi}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold text-xs transition-all shadow-sm disabled:opacity-50"
          >
            {isGeneratingAi ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isGeneratingAi ? 'Synthesizing...' : 'Run Correlation AI'}</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium text-xs transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export Insights</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'ALL', label: 'All Correlations (5)' },
          { id: 'Sales-Security', label: 'Sales ↔ Cybersecurity' },
          { id: 'HR-Sales', label: 'HR ↔ Sales Capacity' },
          { id: 'SecOps-HR', label: 'SecOps ↔ Compensation' },
          { id: 'Financial-Operational', label: 'Capital ↔ Risk Exposure' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap shrink-0 shadow-xs ${
              selectedCategory === cat.id
                ? 'bg-blue-50 text-[#1A73E8] border border-blue-200 font-semibold'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Correlation Cards (Left) + Interactive Visualizer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Correlation Selectors */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
            Empirical Findings ({filteredCorrelations.length})
          </div>

          <div className="space-y-2.5">
            {filteredCorrelations.map((corr) => {
              const isSelected = corr.id === activeCorrelationId;
              const isPositive = corr.correlationCoefficient > 0;

              return (
                <div
                  key={corr.id}
                  onClick={() => setActiveCorrelationId(corr.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border text-left shadow-xs ${
                    isSelected
                      ? 'bg-blue-50/70 border-[#1A73E8] ring-1 ring-blue-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {corr.category}
                    </span>
                    <span className={`text-xs font-bold font-mono flex items-center space-x-1 ${
                      isPositive ? 'text-[#1A73E8]' : 'text-emerald-700'
                    }`}>
                      {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>r = {corr.correlationCoefficient > 0 ? `+${corr.correlationCoefficient}` : corr.correlationCoefficient}</span>
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2">
                    {corr.title}
                  </h3>

                  <p className="text-[11px] text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {corr.executiveSummary}
                  </p>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500 text-[10px] font-medium">
                      {corr.modulesInvolved.join(' ↔ ')}
                    </span>
                    <span className="text-[#1A73E8] font-semibold text-[10px]">
                      Impact: {corr.riskOrOpportunityScore}/100
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Visualizer for Active Correlation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center space-x-2 text-xs text-[#1A73E8] mb-1 font-semibold">
                  <span>{activeCorrelation.modulesInvolved.join(' ↔ ')}</span>
                  <span>&bull;</span>
                  <span>{activeCorrelation.correlationStrength}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  {activeCorrelation.title}
                </h3>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-right">
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Pearson Metric</div>
                <div className="text-base font-bold text-[#1A73E8] font-mono">
                  r = {activeCorrelation.correlationCoefficient > 0 ? `+${activeCorrelation.correlationCoefficient}` : activeCorrelation.correlationCoefficient}
                </div>
              </div>
            </div>

            {/* DUAL-METRIC DATA BARS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Multi-Quarter Co-Variance Progression
                </span>
                <div className="flex items-center space-x-3 text-[11px] font-medium">
                  <span className="flex items-center space-x-1.5 text-[#1A73E8]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1A73E8] inline-block" />
                    <span>{activeCorrelation.dataPoints[0]?.metricA.name}</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-purple-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
                    <span>{activeCorrelation.dataPoints[0]?.metricB.name}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {activeCorrelation.dataPoints.map((dp, idx) => {
                  const maxA = Math.max(...activeCorrelation.dataPoints.map(p => p.metricA.value));
                  const maxB = Math.max(...activeCorrelation.dataPoints.map(p => p.metricB.value));
                  const pctA = Math.round((dp.metricA.value / maxA) * 100);
                  const pctB = Math.round((dp.metricB.value / maxB) * 100);

                  return (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-gray-800">
                          {dp.timePeriod}
                        </span>
                        <div className="flex items-center space-x-4 text-xs font-mono">
                          <span className="text-[#1A73E8] font-bold">{dp.metricA.formatted}</span>
                          <span className="text-purple-700 font-bold">{dp.metricB.formatted}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#1A73E8] h-full rounded-full transition-all duration-500" 
                            style={{ width: `${pctA}%` }} 
                          />
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${pctB}%` }} 
                          />
                        </div>
                      </div>

                      {dp.insightNote && (
                        <div className="mt-1.5 text-[11px] text-gray-500 italic flex items-center space-x-1">
                          <Info className="w-3 h-3 text-gray-400 shrink-0" />
                          <span>{dp.insightNote}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Analysis & Recommendation Callout */}
            <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span className="font-semibold text-gray-900 uppercase tracking-wider text-[11px] block">
                  Detailed Operational Analysis
                </span>
                <p className="text-gray-600 leading-relaxed text-xs">
                  {activeCorrelation.detailedAnalysis}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="font-semibold text-blue-900 uppercase tracking-wider text-[11px] block">
                  Executive Directive
                </span>
                <p className="text-blue-950 leading-relaxed text-xs">
                  {activeCorrelation.strategicRecommendation}
                </p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE WHAT-IF SIMULATOR */}
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1A73E8]">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Executive &ldquo;What-If&rdquo; Cross-Departmental Simulator
                  </h3>
                  <p className="text-xs text-gray-500">
                    Simulate how adjusting sales quotas or headcount impacts threat frequency &amp; margins
                  </p>
                </div>
              </div>

              <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                simResult.feasibilityRating === 'OPTIMAL'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : simResult.feasibilityRating === 'MODERATE_RISK'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {simResult.feasibilityRating.replace('_', ' ')}
              </div>
            </div>

            {/* Slider Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Sales Reps Addition:</span>
                  <span className="text-[#1A73E8]">+{simulation.salesRepsAddition} reps</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={simulation.salesRepsAddition}
                  onChange={(e) => setSimulation({ ...simulation, salesRepsAddition: Number(e.target.value) })}
                  className="w-full accent-[#1A73E8]"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex justify-between font-semibold text-gray-800">
                  <span>SecOps Engineers Hired:</span>
                  <span className="text-purple-700">+{simulation.secopsHiringRate} engineers</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={simulation.secopsHiringRate}
                  onChange={(e) => setSimulation({ ...simulation, secopsHiringRate: Number(e.target.value) })}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>

            {/* Simulator Output Summary */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
              <div className="font-bold text-gray-900">Model Projection Narrative:</div>
              <p className="text-gray-700 leading-relaxed font-medium">
                {simResult.narrative}
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-[11px] font-mono text-gray-600">
                <span>Projected Revenue: ${(simResult.projectedRevenue / 1000000).toFixed(2)}M</span>
                <span>API Traffic: +{simResult.projectedApiTrafficIncreasePct}%</span>
                <span>Threat Rate: {simResult.projectedThreatIncidents}/month</span>
                <span>Projected MTTR: {simResult.projectedMttrHours}h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
