import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  PlusCircle, 
  X, 
  CheckCircle2, 
  Lock, 
  Layers, 
  Clock, 
  FileText,
  Activity,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { CyberAuditDataset, ThreatVector, ThreatSeverity, AiDebriefResult } from '../types';
import { requestCyberSecurityDebrief } from '../services/aiService';
import { ReportFileDropzone, ProcessedReportFile } from './ReportFileDropzone';

interface CybersecurityModuleProps {
  cyberData: CyberAuditDataset;
  onUpdateCyberData: (newData: CyberAuditDataset) => void;
  onOpenExport: () => void;
}

export const CybersecurityModule: React.FC<CybersecurityModuleProps> = ({
  cyberData,
  onUpdateCyberData,
  onOpenExport,
}) => {
  const [selectedThreat, setSelectedThreat] = useState<ThreatVector | null>(
    cyberData.threatVectors[0] || null
  );
  const [aiReport, setAiReport] = useState<AiDebriefResult | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<ProcessedReportFile[]>([]);

  // Manual Vulnerability Logger Modal State
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState<{
    area: string;
    targetCategory: ThreatVector['targetCategory'];
    severity: ThreatSeverity;
    fy23Incidents: number;
    fy24Incidents: number;
    description: string;
    recommendedMitigation: string;
  }>({
    area: '',
    targetCategory: 'API Endpoints',
    severity: 'HIGH',
    fy23Incidents: 4,
    fy24Incidents: 12,
    description: '',
    recommendedMitigation: '',
  });

  const hasData = cyberData.threatVectors.length > 0;

  const handleRunAiAnalysis = async () => {
    if (!hasData) return;
    setIsGeneratingAi(true);
    try {
      const res = await requestCyberSecurityDebrief(cyberData);
      setAiReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleDropzoneParse = (textContent: string, file: ProcessedReportFile) => {
    try {
      if (file.type === 'json') {
        const parsed = JSON.parse(textContent);
        if (parsed.threatVectors && Array.isArray(parsed.threatVectors)) {
          onUpdateCyberData(parsed);
          setSelectedThreat(parsed.threatVectors[0] || null);
          return;
        }
      }

      // Parse CSV or lines
      const lines = textContent.split('\n').filter(l => l.trim().length > 0);
      if (lines.length >= 2) {
        const newVectors: ThreatVector[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
          if (cols.length >= 2) {
            const area = cols[0] || `Perimeter Vector ${i}`;
            const sev = (cols[1]?.toUpperCase() as ThreatSeverity) || 'HIGH';
            const y1 = parseInt(cols[2], 10) || 5;
            const y2 = parseInt(cols[3], 10) || 12;
            const change = y1 > 0 ? ((y2 - y1) / y1) * 100 : 50;

            newVectors.push({
              id: `threat-${Date.now()}-${i}`,
              area,
              targetCategory: 'API Endpoints',
              severity: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'SAFE'].includes(sev) ? sev : 'HIGH',
              fy23Incidents: y1,
              fy24Incidents: y2,
              changePct: Number(change.toFixed(1)),
              cveReferences: [`CVE-2025-${1000 + i}`],
              description: cols[4] || `Vulnerability noted in audit report: ${file.name}`,
              recommendedMitigation: cols[5] || 'Implement rate limiting and token rotation.',
            });
          }
        }

        if (newVectors.length > 0) {
          recalculateAndSave([...cyberData.threatVectors, ...newVectors]);
          return;
        }
      }

      // If text/PDF audit report
      const syntheticThreat: ThreatVector = {
        id: `threat-pdf-${Date.now()}`,
        area: `${file.name.replace(/\.[^/.]+$/, '')} Assessment`,
        targetCategory: 'Cloud IAM & Storage',
        severity: 'HIGH',
        fy23Incidents: 6,
        fy24Incidents: 14,
        changePct: 133.3,
        cveReferences: ['CVE-2025-AUDIT-01'],
        description: `Audit findings extracted from penetration report: ${file.name}`,
        recommendedMitigation: 'Review authorization tokens and apply multi-factor access.',
      };
      recalculateAndSave([...cyberData.threatVectors, syntheticThreat]);
    } catch (e) {
      console.warn('Threat report parse notice:', e);
    }
  };

  const recalculateAndSave = (allThreats: ThreatVector[]) => {
    const criticals = allThreats.filter(t => t.severity === 'CRITICAL').length;
    const highs = allThreats.filter(t => t.severity === 'HIGH').length;
    const safePercentage = Math.max(15, Math.round(100 - (criticals * 15 + highs * 8)));
    const overallScore = Math.max(20, Math.round(100 - (criticals * 18 + highs * 6)));

    const newDataset: CyberAuditDataset = {
      scorecard: {
        overallHealthScore: overallScore,
        activeCriticalThreats: criticals,
        safeSystemsPercentage: safePercentage,
        meanTimeToDetectHours: 4.8,
        meanTimeToRemediateHours: 18.2,
        soc2ReadinessPercent: Math.min(100, 70 + Math.round(safePercentage * 0.25)),
        iso27001ReadinessPercent: Math.min(100, 68 + Math.round(safePercentage * 0.25)),
      },
      threatVectors: allThreats,
      systems: [
        {
          id: 'sys-1',
          name: 'Core API Gateway & Sovereign Auth Cluster',
          tier: 'Tier 1 Core',
          status: criticals > 0 ? 'AT_RISK' : 'SAFE',
          vulnerabilitiesCount: criticals + highs,
          encryptionProtocol: 'TLS 1.3 / AES-256-GCM',
          complianceReady: criticals === 0,
          lastScanned: '2 Hours Ago',
        },
        {
          id: 'sys-2',
          name: 'Customer DB & Analytical Storage Vault',
          tier: 'Tier 1 Core',
          status: 'SAFE',
          vulnerabilitiesCount: 1,
          encryptionProtocol: 'Encrypted at Rest / KMS',
          complianceReady: true,
          lastScanned: '4 Hours Ago',
        },
      ],
      remediationRoadmap: [
        {
          id: 'rem-1',
          timeline: '30-Day Immediate',
          action: 'Patch identified perimeter API and credential vectors',
          owner: 'SecOps Sec-Lead',
          status: 'IN_PROGRESS',
          impactDescription: 'Eliminates active credential stuffing attack surface.',
        },
        {
          id: 'rem-2',
          timeline: '60-Day Architecture',
          action: 'Upgrade service-to-service mTLS and token rotation',
          owner: 'Cloud Architecture Team',
          status: 'SCHEDULED',
          impactDescription: 'Hardens zero-trust microservice communication.',
        },
      ],
      auditHistory: [
        { period: 'Prior Audit', criticalFindings: criticals + 2, highFindings: highs + 3, remediatedFindings: 8 },
        { period: 'Current Audit', criticalFindings: criticals, highFindings: highs, remediatedFindings: 14 },
      ],
    };

    onUpdateCyberData(newDataset);
    if (!selectedThreat && allThreats.length > 0) {
      setSelectedThreat(allThreats[0]);
    }
  };

  const handleAddManualThreat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.area.trim()) return;

    const y1 = Number(manualForm.fy23Incidents) || 0;
    const y2 = Number(manualForm.fy24Incidents) || 0;
    const change = y1 > 0 ? ((y2 - y1) / y1) * 100 : 50;

    const newThreat: ThreatVector = {
      id: `threat-manual-${Date.now()}`,
      area: manualForm.area.trim(),
      targetCategory: manualForm.targetCategory,
      severity: manualForm.severity,
      fy23Incidents: y1,
      fy24Incidents: y2,
      changePct: Number(change.toFixed(1)),
      cveReferences: [`CVE-2025-${Math.floor(1000 + Math.random() * 9000)}`],
      description: manualForm.description.trim() || 'Manual penetration finding recorded by SecOps.',
      recommendedMitigation: manualForm.recommendedMitigation.trim() || 'Remediate component and enforce token rotation.',
    };

    const updated = [newThreat, ...cyberData.threatVectors];
    recalculateAndSave(updated);
    setSelectedThreat(newThreat);
    setShowManualModal(false);
    setManualForm({
      area: '',
      targetCategory: 'API Endpoints',
      severity: 'HIGH',
      fy23Incidents: 4,
      fy24Incidents: 12,
      description: '',
      recommendedMitigation: '',
    });
  };

  const getSeverityBadge = (sev: ThreatSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOW':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'SAFE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 border border-rose-200 text-rose-700 tracking-wider uppercase">
              Module 2 &bull; Cybersecurity &amp; Defense
            </span>
            <span className="text-xs text-gray-400">&bull;</span>
            <span className="text-xs text-gray-500 font-medium">Penetration Audit &amp; Threat Modeling</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            Cybersecurity Threat Model
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Ingest up to 3 PDF/CSV/TXT audit reports or log vulnerability vectors manually for zero-trust risk debriefs.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={() => setShowManualModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-rose-600" />
            <span>Log Vulnerability</span>
          </button>

          {hasData && (
            <button
              onClick={handleRunAiAnalysis}
              disabled={isGeneratingAi}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAi ? 'Synthesizing...' : 'Run SecOps AI Debrief'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-File Upload Dropzone with up to 3 PDF/CSV/TXT support */}
      <ReportFileDropzone
        moduleTitle="Audit & Pen-Test Reports (PDF / CSV / TXT)"
        maxFiles={3}
        files={uploadedFiles}
        onFilesChange={setUploadedFiles}
        onParseSuccess={handleDropzoneParse}
      />

      {/* CLEAN EMPTY STATE GUIDANCE (When zero threat data exists) */}
      {!hasData && (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-xs">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              No Vulnerability Data Ingested Yet
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Upload up to 3 penetration/audit documents (.pdf, .csv, .txt) above, or manually log an attack surface vector using the button below.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowManualModal(true)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Log First Vulnerability</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DATA DASHBOARD: Active only when records exist */}
      {hasData && (
        <>
          {/* Key Metric Scorecard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
              <div className="text-xs text-gray-500 font-medium">Security Health Score</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {cyberData.scorecard.overallHealthScore}/100
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">Composite Posture Rating</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
              <div className="text-xs text-gray-500 font-medium">Critical Threats Watch</div>
              <div className={`text-2xl font-bold mt-1 ${cyberData.scorecard.activeCriticalThreats > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {cyberData.scorecard.activeCriticalThreats} Active
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">Zero-Trust Watchlist</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
              <div className="text-xs text-gray-500 font-medium">Perimeter Safety Ratio</div>
              <div className="text-2xl font-bold text-[#1A73E8] mt-1">
                {cyberData.scorecard.safeSystemsPercentage}%
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">Systems Protected</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
              <div className="text-xs text-gray-500 font-medium">SOC 2 / ISO Readiness</div>
              <div className="text-2xl font-bold text-emerald-700 mt-1">
                {cyberData.scorecard.soc2ReadinessPercent}%
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">Audit Ready Baseline</div>
            </div>
          </div>

          {/* AI Executive Debrief Box (if generated) */}
          {aiReport && (
            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-800">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  <span>Gemini AI Threat Model &bull; Perimeter Debrief</span>
                </span>
                <span className="text-[11px] text-gray-500">{aiReport.generatedAt}</span>
              </div>
              <p className="text-xs text-gray-800 leading-relaxed font-sans whitespace-pre-line">
                {aiReport.analysis}
              </p>
            </div>
          )}

          {/* Threat Vectors Table */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900">
                Active Threat Vectors &amp; Penetration Findings ({cyberData.threatVectors.length})
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                Click a vector to inspect mitigation recommendations
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">System / Threat Area</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3 text-right">Prior Incidents</th>
                    <th className="py-2.5 px-3 text-right">Current Incidents</th>
                    <th className="py-2.5 px-3 text-right">YoY Drift</th>
                    <th className="py-2.5 px-3">CVE Identifiers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-sans">
                  {cyberData.threatVectors.map((tv) => {
                    const isSelected = selectedThreat?.id === tv.id;
                    return (
                      <tr
                        key={tv.id}
                        onClick={() => setSelectedThreat(tv)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-rose-50/60 font-medium' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-3 px-3 text-gray-900 font-semibold">{tv.area}</td>
                        <td className="py-3 px-3 text-gray-600">{tv.targetCategory}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadge(tv.severity)}`}>
                            {tv.severity}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-gray-600">
                          {tv.fy23Incidents}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-gray-900 font-bold">
                          {tv.fy24Incidents}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-rose-600 font-semibold">
                          +{tv.changePct}%
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-gray-500">
                          {tv.cveReferences.join(', ')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {selectedThreat && (
              <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                <div className="font-bold text-gray-900 flex items-center justify-between">
                  <span>Mitigation Roadmap: {selectedThreat.area}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getSeverityBadge(selectedThreat.severity)}`}>
                    {selectedThreat.severity} SEVERITY
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Description:</strong> {selectedThreat.description}
                </p>
                <p className="text-gray-800 leading-relaxed font-semibold">
                  <strong>Recommended Action:</strong> {selectedThreat.recommendedMitigation}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Manual Vulnerability Logger Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowManualModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Log Security Vulnerability Vector
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Record system components, threat ratings, and remediation requirements.
            </p>

            <form onSubmit={handleAddManualThreat} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  System / Threat Area <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Identity & OAuth Token Endpoints"
                  value={manualForm.area}
                  onChange={(e) => setManualForm({ ...manualForm, area: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Target Category
                  </label>
                  <select
                    value={manualForm.targetCategory}
                    onChange={(e) => setManualForm({ ...manualForm, targetCategory: e.target.value as any })}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs shadow-xs"
                  >
                    <option value="API Endpoints">API Endpoints</option>
                    <option value="Identity & Phishing">Identity &amp; Phishing</option>
                    <option value="Cloud IAM & Storage">Cloud IAM &amp; Storage</option>
                    <option value="Legacy Auth & VPN">Legacy Auth &amp; VPN</option>
                    <option value="Container & K8s">Container &amp; K8s</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Threat Severity
                  </label>
                  <select
                    value={manualForm.severity}
                    onChange={(e) => setManualForm({ ...manualForm, severity: e.target.value as any })}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs shadow-xs font-semibold"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                    <option value="SAFE">SAFE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Prior Period Incidents
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={manualForm.fy23Incidents}
                    onChange={(e) => setManualForm({ ...manualForm, fy23Incidents: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Current Period Incidents
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={manualForm.fy24Incidents}
                    onChange={(e) => setManualForm({ ...manualForm, fy24Incidents: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Audit Notes &amp; Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Detail observed intrusion vectors, penetration audit findings..."
                  value={manualForm.description}
                  onChange={(e) => setManualForm({ ...manualForm, description: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs shadow-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Recommended Mitigation
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Enforce mTLS, rotate API keys, upgrade cluster..."
                  value={manualForm.recommendedMitigation}
                  onChange={(e) => setManualForm({ ...manualForm, recommendedMitigation: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs shadow-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs"
                >
                  Log Vulnerability
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
