import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Brain,
  ShieldAlert,
  CloudRain,
  Layers,
  Sparkles,
  TrendingUp,
  Cpu,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MLInsightsView: React.FC = () => {
  const { showToast } = useApp();

  // Interactive Model Parameter Sliders
  const [rainfallMm, setRainfallMm] = useState<number>(38);
  const [sedimentLevel, setSedimentLevel] = useState<number>(62);
  const [wasteInflowRate, setWasteInflowRate] = useState<number>(18);
  const [pumpCapacity, setPumpCapacity] = useState<number>(450);

  // Dynamic ML calculated risk
  const calculatedRisk = Math.min(
    100,
    Math.round(rainfallMm * 0.9 + sedimentLevel * 0.45 + wasteInflowRate * 1.2 - pumpCapacity * 0.04)
  );

  const estimatedHoursToInundation =
    calculatedRisk > 80 ? '1.8 hours' : calculatedRisk > 60 ? '3.4 hours' : calculatedRisk > 40 ? '7.2 hours' : '18+ hours';

  const riskTier =
    calculatedRisk > 75 ? 'CRITICAL RISK' : calculatedRisk > 45 ? 'MODERATE WARNING' : 'NORMAL HYDRAULICS';

  const handleRunInference = () => {
    showToast({
      type: 'INFO',
      title: 'ML Inference Executed',
      message: `Trained model converged with ${calculatedRisk}% blockage probability.`,
    });
  };

  const predictiveAlerts = [
    {
      id: 'PRED-01',
      drainId: 'DRN-042',
      location: 'Velachery 100 Feet Road / Lake Outlet',
      prediction: 'High blockage probability within 2.5 hours',
      confidence: '94.6%',
      rootCause: 'Plastics buildup + 42mm/h convective cloudburst runoff',
      severity: 'critical',
    },
    {
      id: 'PRED-02',
      drainId: 'DRN-018',
      location: 'Usman Road Flyover, T. Nagar',
      prediction: 'Moderate silt accumulation risk within 5 hours',
      confidence: '89.2%',
      rootCause: 'Silt deposition from commercial market street runoff',
      severity: 'warning',
    },
    {
      id: 'PRED-03',
      drainId: 'DRN-021',
      location: 'Kathipara Junction Outfall, Guindy',
      prediction: 'Rising head level warning under persistent shower',
      confidence: '87.4%',
      rootCause: 'Upstream canal convergence backpressure',
      severity: 'warning',
    },
    {
      id: 'PRED-04',
      drainId: 'DRN-003',
      location: 'Shanthi Colony Main Drain, Anna Nagar',
      prediction: 'Normal gravity outflow sustained',
      confidence: '96.1%',
      rootCause: 'Stainless mesh rake successfully cycled 45 min ago',
      severity: 'normal',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
          <Brain className="w-4 h-4" />
          <span>EDGE CLOUD PREDICTIVE INTELLIGENCE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
          Machine Learning Blockage & Inundation Prediction
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Supervised regression and gradient-boosted decision trees correlating live ultrasonic head distance, IR break-beam optical counts, and Doppler radar precipitation to forecast choke points before surface flooding manifests.
        </p>
      </div>

      {/* Model Technical Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
              Architecture Overview
            </span>
            <h3 className="text-lg font-bold text-white">
              Dual-Stage Machine Learning Pipeline
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>1. Edge Classification (Vision ML):</strong> Overhead cameras snap 640x480 frames of waste lifted by the conveyor rake. A quantised convolutional network runs feature extraction to classify items into Recyclable PET, Organic Leaves, and Municipal Sludge at 94.2% accuracy.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>2. Cloud Hydrodynamic Predictor (XGBoost Regressor):</strong> Aggregates sensor telemetry every 30 seconds across all 128 nodes alongside IMD rainfall feeds to predict water level trajectory 180 minutes into the future.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#041220] border border-purple-500/20">
              <div className="text-2xl font-black font-mono text-purple-300">94.2%</div>
              <div className="text-[11px] font-bold text-slate-200 mt-0.5">Classification Accuracy</div>
              <p className="text-[10px] text-slate-400 mt-1">Tested on 12,000 Chennai waste images.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#041220] border border-purple-500/20">
              <div className="text-2xl font-black font-mono text-cyan-300">180 min</div>
              <div className="text-[11px] font-bold text-slate-200 mt-0.5">Early Warning Lead</div>
              <p className="text-[10px] text-slate-400 mt-1">Advance notice before street overflow.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#041220] border border-purple-500/20">
              <div className="text-2xl font-black font-mono text-emerald-300">&lt; 0.4s</div>
              <div className="text-[11px] font-bold text-slate-200 mt-0.5">Inference Latency</div>
              <p className="text-[10px] text-slate-400 mt-1">Real-time edge sorting decision.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#041220] border border-purple-500/20">
              <div className="text-2xl font-black font-mono text-amber-300">4.1%</div>
              <div className="text-[11px] font-bold text-slate-200 mt-0.5">False Positive Rate</div>
              <p className="text-[10px] text-slate-400 mt-1">Robust against muddy water waves.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Console */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/25 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cyan-500/20">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Interactive Hydrodynamic Risk Simulator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust environmental variables to observe real-time recalculation of drainage risk
            </p>
          </div>

          <button
            onClick={handleRunInference}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-Run Inference Model</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Slider 1: Rainfall */}
          <div className="space-y-2 bg-[#041220] p-4 rounded-2xl border border-cyan-500/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                Rainfall Rate
              </span>
              <span className="font-mono text-cyan-300 font-bold">{rainfallMm} mm/h</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rainfallMm}
              onChange={(e) => setRainfallMm(parseInt(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 (Dry)</span>
              <span>100 (Monsoon Cloudburst)</span>
            </div>
          </div>

          {/* Slider 2: Sediment */}
          <div className="space-y-2 bg-[#041220] p-4 rounded-2xl border border-cyan-500/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Sediment Depth
              </span>
              <span className="font-mono text-amber-300 font-bold">{sedimentLevel}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sedimentLevel}
              onChange={(e) => setSedimentLevel(parseInt(e.target.value))}
              className="w-full accent-amber-400 bg-slate-800"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Clean Silt Basins</span>
              <span>100% Choked Silt</span>
            </div>
          </div>

          {/* Slider 3: Waste Inflow */}
          <div className="space-y-2 bg-[#041220] p-4 rounded-2xl border border-cyan-500/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                Debris Inflow Rate
              </span>
              <span className="font-mono text-rose-300 font-bold">{wasteInflowRate} kg/h</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={wasteInflowRate}
              onChange={(e) => setWasteInflowRate(parseInt(e.target.value))}
              className="w-full accent-rose-400 bg-slate-800"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 kg/h</span>
              <span>50 kg/h (Heavy Plastic)</span>
            </div>
          </div>

          {/* Slider 4: Pump Capacity */}
          <div className="space-y-2 bg-[#041220] p-4 rounded-2xl border border-cyan-500/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Sump Pump Outflow
              </span>
              <span className="font-mono text-emerald-300 font-bold">{pumpCapacity} L/s</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={pumpCapacity}
              onChange={(e) => setPumpCapacity(parseInt(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>100 L/s</span>
              <span>1000 L/s High Cap</span>
            </div>
          </div>
        </div>

        {/* Calculated Result Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d1e36] to-[#121132] border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400">ML Forecast Outcome:</span>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  calculatedRisk > 75
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : calculatedRisk > 45
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {riskTier}
              </span>
            </div>
            <div className="text-3xl font-black font-mono text-white mt-1">
              {calculatedRisk}%{' '}
              <span className="text-xs font-normal text-slate-400">
                Probability of severe waterlogging
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Estimated Time to Surface Choke</span>
            <span className="text-2xl font-mono font-extrabold text-cyan-300">
              {estimatedHoursToInundation}
            </span>
          </div>
        </div>
      </div>

      {/* Active Predictive Forecast Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Active Drainage Sector Predictive Alerts</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictiveAlerts.map((p) => (
            <div
              key={p.id}
              className={`p-5 rounded-2xl border transition-all ${
                p.severity === 'critical'
                  ? 'bg-rose-950/25 border-rose-500/30'
                  : p.severity === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-[#05172d] border-cyan-500/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-mono font-bold text-cyan-300">{p.drainId}</span>
                <span className="font-mono text-slate-400 text-[11px]">
                  Confidence: <strong className="text-emerald-300">{p.confidence}</strong>
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{p.location}</h4>
              <p
                className={`text-xs font-semibold mt-1 ${
                  p.severity === 'critical'
                    ? 'text-rose-300'
                    : p.severity === 'warning'
                    ? 'text-amber-300'
                    : 'text-emerald-300'
                }`}
              >
                {p.prediction}
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Root Cause: <span className="text-slate-300">{p.rootCause}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
