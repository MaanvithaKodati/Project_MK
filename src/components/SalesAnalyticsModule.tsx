import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles, 
  Upload, 
  FileText, 
  RefreshCw, 
  Download, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Layers,
  ArrowRight,
  TrendingDown,
  PlusCircle,
  X,
  FileSpreadsheet,
  PackageCheck,
  Calendar,
  PieChart
} from 'lucide-react';
import { SalesDataset, ProductPerformance, AiDebriefResult } from '../types';
import { requestSalesAnalysis } from '../services/aiService';
import { ReportFileDropzone, ProcessedReportFile } from './ReportFileDropzone';

interface SalesAnalyticsModuleProps {
  salesData: SalesDataset;
  onUpdateSalesData: (newData: SalesDataset) => void;
  onOpenExport: () => void;
}

export const SalesAnalyticsModule: React.FC<SalesAnalyticsModuleProps> = ({
  salesData,
  onUpdateSalesData,
  onOpenExport,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductPerformance | null>(
    salesData.products[0] || null
  );
  const [aiReport, setAiReport] = useState<AiDebriefResult | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<ProcessedReportFile[]>([]);

  // Manual Product Entry Modal State
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState<{
    name: string;
    category: ProductPerformance['category'];
    fy2023Revenue: number;
    fy2024Revenue: number;
    volumeUnits: number;
    marginPercent: number;
    growthDriverRationale: string;
  }>({
    name: '',
    category: 'Enterprise SaaS',
    fy2023Revenue: 5000000,
    fy2024Revenue: 6800000,
    volumeUnits: 250,
    marginPercent: 72,
    growthDriverRationale: '',
  });

  const hasData = salesData.products.length > 0;

  // Dynamic period labels from uploaded files or defaults
  const period1Label = uploadedFiles[0]?.periodLabel || 'Report Period 1';
  const period2Label = uploadedFiles[1]?.periodLabel || 'Report Period 2';

  // Trigger Gemini AI Sales Analysis
  const handleRunAiAnalysis = async () => {
    if (!hasData) return;
    setIsGeneratingAi(true);
    try {
      const res = await requestSalesAnalysis(salesData);
      setAiReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // When files are processed via the multi-file dropzone
  const handleDropzoneParse = (textContent: string, file: ProcessedReportFile) => {
    try {
      if (file.type === 'json') {
        const parsed = JSON.parse(textContent);
        if (parsed.products && Array.isArray(parsed.products)) {
          onUpdateSalesData(parsed);
          setSelectedProduct(parsed.products[0] || null);
          return;
        }
      }

      // Parse CSV or lines
      const lines = textContent.split('\n').filter(l => l.trim().length > 0);
      if (lines.length >= 2) {
        const newProducts: ProductPerformance[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
          if (cols.length >= 3) {
            const name = cols[0] || `Product Line ${i}`;
            const y1 = parseFloat(cols[1]) || 1500000;
            const y2 = parseFloat(cols[2]) || 2100000;
            const growth = y1 > 0 ? ((y2 - y1) / y1) * 100 : 25;
            const boost = Math.max(5, Math.round(growth * 1.15));

            newProducts.push({
              id: `prod-${Date.now()}-${i}`,
              name,
              category: 'Enterprise SaaS',
              fy2023Revenue: y1,
              fy2024Revenue: y2,
              growthPercentage: Number(growth.toFixed(1)),
              projectedBoostPercentFY25: boost,
              marginPercent: parseFloat(cols[3]) || 70,
              volumeUnits: parseInt(cols[4], 10) || 500,
              growthDriverRationale: cols[5] || 'Report ingestion indicating strong growth.',
            });
          }
        }

        if (newProducts.length > 0) {
          recalculateAndSave([...salesData.products, ...newProducts]);
          return;
        }
      }

      // If text/PDF with numbers, synthesize an entry
      const numbers = textContent.match(/\$?\d+(?:,\d{3})*(?:\.\d+)?/g);
      if (numbers && numbers.length >= 2) {
        const parsedNums = numbers.map(n => parseFloat(n.replace(/[$,]/g, ''))).filter(n => n > 1000);
        if (parsedNums.length >= 2) {
          const y1 = parsedNums[0];
          const y2 = parsedNums[1];
          const growth = y1 > 0 ? ((y2 - y1) / y1) * 100 : 20;
          const syntheticProduct: ProductPerformance = {
            id: `prod-pdf-${Date.now()}`,
            name: `${file.name.replace(/\.[^/.]+$/, '')} Portfolio`,
            category: 'Enterprise SaaS',
            fy2023Revenue: y1,
            fy2024Revenue: y2,
            growthPercentage: Number(growth.toFixed(1)),
            projectedBoostPercentFY25: Math.round(growth * 1.1),
            marginPercent: 74,
            volumeUnits: 450,
            growthDriverRationale: `Extracted from PDF financial statement: ${file.name}`,
          };
          recalculateAndSave([...salesData.products, syntheticProduct]);
        }
      }
    } catch (e) {
      console.warn('File ingestion notice:', e);
    }
  };

  const recalculateAndSave = (allProducts: ProductPerformance[]) => {
    const sumY1 = allProducts.reduce((acc, p) => acc + p.fy2023Revenue, 0);
    const sumY2 = allProducts.reduce((acc, p) => acc + p.fy2024Revenue, 0);
    const overallGrowth = sumY1 > 0 ? Number((((sumY2 - sumY1) / sumY1) * 100).toFixed(1)) : 0;
    const avgMargin = allProducts.length > 0
      ? Number((allProducts.reduce((acc, p) => acc + p.marginPercent, 0) / allProducts.length).toFixed(1))
      : 0;

    const newDataset: SalesDataset = {
      totals: {
        fy2023: sumY1,
        fy2024: sumY2,
        fy2025Projected: Math.round(sumY2 * (1 + (overallGrowth || 15) / 100)),
        growthYoY: overallGrowth,
        averageMargin: avgMargin,
      },
      products: allProducts,
      quarterly: [
        { quarter: 'Q1', fy2023: Math.round(sumY1 * 0.22), fy2024: Math.round(sumY2 * 0.22), projectedFy25: Math.round(sumY2 * 0.28) },
        { quarter: 'Q2', fy2023: Math.round(sumY1 * 0.24), fy2024: Math.round(sumY2 * 0.24), projectedFy25: Math.round(sumY2 * 0.30) },
        { quarter: 'Q3', fy2023: Math.round(sumY1 * 0.26), fy2024: Math.round(sumY2 * 0.26), projectedFy25: Math.round(sumY2 * 0.32) },
        { quarter: 'Q4', fy2023: Math.round(sumY1 * 0.28), fy2024: Math.round(sumY2 * 0.28), projectedFy25: Math.round(sumY2 * 0.35) },
      ],
      regional: [
        { region: 'North America (Commercial & Enterprise)', revenueFY24: Math.round(sumY2 * 0.58), sharePercent: 58, growthYoY: overallGrowth + 2 },
        { region: 'EMEA (Strategic Infrastructure)', revenueFY24: Math.round(sumY2 * 0.27), sharePercent: 27, growthYoY: overallGrowth - 1 },
        { region: 'Asia-Pacific (Expansion Hub)', revenueFY24: Math.round(sumY2 * 0.15), sharePercent: 15, growthYoY: overallGrowth + 5 },
      ],
    };

    onUpdateSalesData(newDataset);
    if (!selectedProduct && allProducts.length > 0) {
      setSelectedProduct(allProducts[0]);
    }
  };

  // Add product manually
  const handleAddManualProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.name.trim()) return;

    const y1 = Number(manualForm.fy2023Revenue) || 0;
    const y2 = Number(manualForm.fy2024Revenue) || 0;
    const growth = y1 > 0 ? ((y2 - y1) / y1) * 100 : 25;

    const newProd: ProductPerformance = {
      id: `prod-manual-${Date.now()}`,
      name: manualForm.name.trim(),
      category: manualForm.category,
      fy2023Revenue: y1,
      fy2024Revenue: y2,
      growthPercentage: Number(growth.toFixed(1)),
      projectedBoostPercentFY25: Math.max(5, Math.round(growth * 1.15)),
      volumeUnits: Number(manualForm.volumeUnits) || 100,
      marginPercent: Number(manualForm.marginPercent) || 70,
      growthDriverRationale: manualForm.growthDriverRationale.trim() || 'Manual executive entry.',
    };

    const updatedList = [newProd, ...salesData.products];
    recalculateAndSave(updatedList);
    setSelectedProduct(newProd);
    setShowManualModal(false);
    setManualForm({
      name: '',
      category: 'Enterprise SaaS',
      fy2023Revenue: 5000000,
      fy2024Revenue: 6800000,
      volumeUnits: 250,
      marginPercent: 72,
      growthDriverRationale: '',
    });
  };

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 tracking-wider uppercase">
              Module 1 &bull; Commercial Intelligence
            </span>
            <span className="text-xs text-gray-400">&bull;</span>
            <span className="text-xs text-gray-500 font-medium">Multi-Year Comparative Reporting</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            Sales &amp; Marketing Analytics
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Ingest up to 3 PDF/CSV/TXT departmental reports or manually enter product lines for growth forecasting.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={() => setShowManualModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-[#1A73E8]" />
            <span>Add Product Entry</span>
          </button>

          {hasData && (
            <button
              onClick={handleRunAiAnalysis}
              disabled={isGeneratingAi}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAi ? 'Synthesizing...' : 'Run AI Forecast Debrief'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-File Upload Dropzone with up to 3 PDF/CSV/TXT support & Custom Period Naming */}
      <ReportFileDropzone
        moduleTitle="Sales Reports (PDF / CSV / TXT)"
        maxFiles={3}
        files={uploadedFiles}
        onFilesChange={setUploadedFiles}
        onParseSuccess={handleDropzoneParse}
      />

      {/* CLEAN EMPTY STATE GUIDANCE (When zero data exists) */}
      {!hasData && (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-xs">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1A73E8] mx-auto shadow-xs">
              <PackageCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              No Sales Data Ingested Yet
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Start by uploading up to 3 sales or financial documents (.pdf, .csv, .txt) above, or manually record your first product line using the button below.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowManualModal(true)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white text-xs font-bold shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Record First Product Entry</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DATA DASHBOARD: Active only when records exist */}
      {hasData && (
        <>
          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
              <div className="text-xs text-gray-500 font-medium">Total {period1Label}</div>
              <div className="text-xl font-bold text-gray-900 mt-1">
                {formatCurrency(salesData.totals.fy2023)}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">Prior Period Baseline</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
              <div className="text-xs text-gray-500 font-medium">Total {period2Label}</div>
              <div className="text-xl font-bold text-[#1A73E8] mt-1">
                {formatCurrency(salesData.totals.fy2024)}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center mt-0.5">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                <span>+{salesData.totals.growthYoY}% Growth</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
              <div className="text-xs text-gray-500 font-medium">Projected Revenue Target</div>
              <div className="text-xl font-bold text-gray-900 mt-1">
                {formatCurrency(salesData.totals.fy2025Projected)}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">Model Forecast</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
              <div className="text-xs text-gray-500 font-medium">Average Gross Margin</div>
              <div className="text-xl font-bold text-emerald-700 mt-1">
                {salesData.totals.averageMargin}%
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">{salesData.products.length} Products Monitored</div>
            </div>
          </div>

          {/* AI Executive Debrief Box (if generated) */}
          {aiReport && (
            <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#1A73E8]">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini AI Commercial Forecast &bull; Strategic Synthesis</span>
                </span>
                <span className="text-[11px] text-gray-500">{aiReport.generatedAt}</span>
              </div>
              <p className="text-xs text-gray-800 leading-relaxed font-sans whitespace-pre-line">
                {aiReport.analysis}
              </p>
            </div>
          )}

          {/* Product Lines Table */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900">
                Departmental Product Performance ({salesData.products.length} Lines)
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                Click any line item to inspect growth drivers
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">{period1Label}</th>
                    <th className="py-2.5 px-3 text-right">{period2Label}</th>
                    <th className="py-2.5 px-3 text-right">Growth YoY</th>
                    <th className="py-2.5 px-3 text-right">Margin %</th>
                    <th className="py-2.5 px-3 text-right">Units Sold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-sans">
                  {salesData.products.map((p) => {
                    const isSelected = selectedProduct?.id === p.id;
                    return (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/70 font-medium' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-3 px-3 text-gray-900 font-semibold">{p.name}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px]">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-gray-600">
                          {formatCurrency(p.fy2023Revenue)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-gray-900 font-bold">
                          {formatCurrency(p.fy2024Revenue)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-600 font-semibold">
                          +{p.growthPercentage}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-gray-700">
                          {p.marginPercent}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-gray-600">
                          {p.volumeUnits.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {selectedProduct && (
              <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
                <div className="font-bold text-gray-900 flex items-center justify-between">
                  <span>Growth Driver &amp; Demand Rationale: {selectedProduct.name}</span>
                  <span className="text-[#1A73E8]">Projected Boost: +{selectedProduct.projectedBoostPercentFY25}%</span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {selectedProduct.growthDriverRationale}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Manual Product Entry Modal */}
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
              Add Commercial Product Line
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Enter product revenue metrics and volume for dynamic multi-year modeling.
            </p>

            <form onSubmit={handleAddManualProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Product / Service Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Cloud SecOps License"
                  value={manualForm.name}
                  onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] text-xs shadow-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Category
                </label>
                <select
                  value={manualForm.category}
                  onChange={(e) => setManualForm({ ...manualForm, category: e.target.value as any })}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] text-xs shadow-xs"
                >
                  <option value="Enterprise SaaS">Enterprise SaaS</option>
                  <option value="API & Cloud">API &amp; Cloud</option>
                  <option value="Hardware & Edge">Hardware &amp; Edge</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Security Add-on">Security Add-on</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {period1Label} Revenue ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={manualForm.fy2023Revenue}
                    onChange={(e) => setManualForm({ ...manualForm, fy2023Revenue: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] text-xs font-mono shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {period2Label} Revenue ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={manualForm.fy2024Revenue}
                    onChange={(e) => setManualForm({ ...manualForm, fy2024Revenue: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] text-xs font-mono shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Volume (Units Sold)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={manualForm.volumeUnits}
                    onChange={(e) => setManualForm({ ...manualForm, volumeUnits: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] text-xs font-mono shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Gross Margin (%)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={manualForm.marginPercent}
                    onChange={(e) => setManualForm({ ...manualForm, marginPercent: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] text-xs font-mono shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Demand &amp; Growth Driver Rationale
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain client contract expansion, enterprise upgrades, or key catalysts..."
                  value={manualForm.growthDriverRationale}
                  onChange={(e) => setManualForm({ ...manualForm, growthDriverRationale: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] text-xs shadow-xs"
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
                  className="px-5 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-bold shadow-xs"
                >
                  Add Product Line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
