import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cog,
  Power,
  AlertOctagon,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Cpu,
  Zap,
  Activity,
  ShieldAlert,
  Wrench,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MotorControlView: React.FC = () => {
  const { showToast, simulateWasteCleaned } = useApp();

  // Motor states: 'READY' | 'STARTING' | 'RUNNING' | 'COLLECTING' | 'TRANSFER_COMPLETE' | 'EMERGENCY_STOPPED' | 'FAULT'
  const [motorState, setMotorState] = useState<
    'READY' | 'STARTING' | 'RUNNING' | 'COLLECTING' | 'TRANSFER_COMPLETE' | 'EMERGENCY_STOPPED' | 'FAULT'
  >('READY');

  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [rotationRpm, setRotationRpm] = useState(120);

  const isRunning =
    motorState === 'STARTING' || motorState === 'RUNNING' || motorState === 'COLLECTING';

  const handleStartMotor = () => {
    if (motorState === 'EMERGENCY_STOPPED' || motorState === 'FAULT') {
      showToast({
        type: 'WARNING',
        title: 'Safety Interlock Engaged',
        message: 'Please reset the motor controller before starting.',
      });
      return;
    }

    setMotorState('STARTING');
    showToast({
      type: 'INFO',
      title: 'Motor Starting',
      message: 'Command sent to ESP32: Initializing DC Geared Motor PWM at 120 RPM...',
    });

    setTimeout(() => {
      setMotorState('RUNNING');
    }, 1500);

    setTimeout(() => {
      setMotorState('COLLECTING');
    }, 3500);

    setTimeout(() => {
      setMotorState('TRANSFER_COMPLETE');
      simulateWasteCleaned('DRN-042', 26);
      showToast({
        type: 'SUCCESS',
        title: 'Cycle Finished',
        message: 'Conveyor cycle complete. 26 kg waste deposited into sorting chute.',
      });
    }, 6500);

    setTimeout(() => {
      setMotorState('READY');
    }, 9000);
  };

  const handleConfirmStop = () => {
    setStopModalOpen(false);
    setMotorState('READY');
    showToast({
      type: 'INFO',
      title: 'Motor Stopped',
      message: 'DC Motor slowed to complete stop. Mechanism in standby.',
    });
  };

  const handleConfirmEmergencyStop = () => {
    setEmergencyModalOpen(false);
    setMotorState('EMERGENCY_STOPPED');
    showToast({
      type: 'CRITICAL',
      title: 'EMERGENCY STOP EXECUTED',
      message: 'All actuator relays opened immediately. Brake engaged.',
    });
  };

  const handleResetMotor = () => {
    setMotorState('READY');
    showToast({
      type: 'SUCCESS',
      title: 'Motor Interlock Reset',
      message: 'Motor controller diagnostic test passed. Ready for dispatch.',
    });
  };

  const handleSimulateFailure = () => {
    setMotorState('FAULT');
    showToast({
      type: 'CRITICAL',
      title: 'Hardware Fault Simulated',
      message: 'Overcurrent trip on DC Motor (DRN-042). Mechanism stalled.',
    });
  };

  const handleCreateMaintenance = () => {
    showToast({
      type: 'INFO',
      title: 'Maintenance Ticket Created',
      message: 'Ticket MNT-8042 dispatched to field hardware team.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Title Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              Actuator & Hardware Command
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Automatic Waste Removal Motor Control</h2>
          <p className="text-xs text-slate-300 mt-1">
            Sub-surface mechanical rake and conveyor mechanism on Trunk Drain DRN-042 (Anna Nagar).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateFailure}
            className="px-4 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Motor Failure</span>
          </button>
        </div>
      </div>

      {/* Main Motor & Mechanism Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Graphic & Mechanism Visualizer */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Cog
                    className={`w-6 h-6 text-cyan-400 ${
                      isRunning ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: isRunning ? '2s' : '0s' }}
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">DRN-042 Mechanical Sluice Unit</h3>
                  <p className="text-xs text-slate-400 font-mono">Controller: ESP32 Rev-3 • Relay Bank 4-Ch</p>
                </div>
              </div>

              {/* Status Pill */}
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase font-mono tracking-wider border ${
                    motorState === 'EMERGENCY_STOPPED'
                      ? 'bg-rose-500/25 text-rose-300 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                      : motorState === 'FAULT'
                      ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : isRunning
                      ? 'bg-cyan-500/25 text-cyan-300 border-cyan-500/50 animate-pulse'
                      : 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50'
                  }`}
                >
                  {motorState.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Visual Mechanical Diagram */}
            <div className="mt-6 p-6 rounded-2xl bg-[#041222] border border-cyan-500/20 relative overflow-hidden">
              {/* Status Progression Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-[11px] font-mono mb-2 text-slate-400">
                  <span className={motorState === 'STARTING' ? 'text-cyan-300 font-bold' : ''}>
                    1. STARTING MOTOR
                  </span>
                  <span className={motorState === 'RUNNING' ? 'text-cyan-300 font-bold' : ''}>
                    2. MOTOR RUNNING
                  </span>
                  <span className={motorState === 'COLLECTING' ? 'text-emerald-300 font-bold' : ''}>
                    3. COLLECTING WASTE
                  </span>
                  <span className={motorState === 'TRANSFER_COMPLETE' ? 'text-blue-300 font-bold' : ''}>
                    4. TRANSFER COMPLETE
                  </span>
                </div>

                <div className="h-2 w-full bg-[#020b14] rounded-full overflow-hidden border border-cyan-500/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400"
                    animate={{
                      width:
                        motorState === 'STARTING'
                          ? '25%'
                          : motorState === 'RUNNING'
                          ? '50%'
                          : motorState === 'COLLECTING'
                          ? '75%'
                          : motorState === 'TRANSFER_COMPLETE'
                          ? '100%'
                          : '0%',
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>

              {/* Graphic animation representation of the conveyor & debris basket */}
              <div className="h-44 w-full bg-[#020912] rounded-2xl border border-cyan-500/30 relative flex items-center justify-center overflow-hidden">
                {/* Simulated conveyor tracks */}
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-14 rounded-2xl border-2 border-dashed border-cyan-500/40 flex items-center justify-around overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={isRunning ? { x: [-30, 40] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-[10px] font-mono text-cyan-300"
                    >
                      Rake
                    </motion.div>
                  ))}
                </div>

                {/* Center Gear Graphic */}
                <div className="relative z-10 flex items-center gap-8">
                  <motion.div
                    animate={isRunning ? { rotate: 360 } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 rounded-full border-4 border-cyan-400 flex items-center justify-center bg-[#08223f] shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                  >
                    <Cog className="w-12 h-12 text-cyan-300" />
                  </motion.div>

                  <div className="text-left font-mono">
                    <div className="text-xs text-slate-400">Current Velocity:</div>
                    <div className="text-2xl font-black text-white">
                      {isRunning ? `${rotationRpm} RPM` : '0 RPM'}
                    </div>
                    <div className="text-[11px] text-cyan-400 mt-1">
                      Torque: {isRunning ? '18.4 Nm' : '0.0 Nm'}
                    </div>
                  </div>
                </div>

                {/* Emergency Stopped banner overlay */}
                {motorState === 'EMERGENCY_STOPPED' && (
                  <div className="absolute inset-0 bg-rose-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-20">
                    <AlertOctagon className="w-12 h-12 text-rose-400 animate-pulse" />
                    <h4 className="text-lg font-black text-white mt-2">EMERGENCY STOPPED</h4>
                    <p className="text-xs text-rose-200 mt-1">Actuators halted by command operator</p>
                    <button
                      onClick={handleResetMotor}
                      className="mt-3 px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-white hover:bg-slate-200 transition-all flex items-center gap-1.5 shadow-lg"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Motor</span>
                    </button>
                  </div>
                )}

                {/* Fault banner overlay */}
                {motorState === 'FAULT' && (
                  <div className="absolute inset-0 bg-amber-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-20">
                    <AlertTriangle className="w-12 h-12 text-amber-400 animate-bounce" />
                    <h4 className="text-lg font-black text-white mt-2">HARDWARE FAULT DETECTED</h4>
                    <p className="text-xs text-amber-200 mt-1">Stall current detected on motor driver relay</p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={handleConfirmEmergencyStop}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all"
                      >
                        Emergency Stop
                      </button>
                      <button
                        onClick={handleCreateMaintenance}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center gap-1"
                      >
                        <Wrench className="w-3 h-3" />
                        <span>Create Maintenance Alert</span>
                      </button>
                      <button
                        onClick={handleResetMotor}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 transition-all"
                      >
                        Clear Fault
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="mt-6 pt-4 border-t border-cyan-500/15 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleStartMotor}
                disabled={isRunning || motorState === 'EMERGENCY_STOPPED' || motorState === 'FAULT'}
                className="px-6 py-3 rounded-2xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
              >
                <Power className="w-4 h-4 text-slate-950" />
                <span>Start Motor</span>
              </button>

              <button
                onClick={() => setStopModalOpen(true)}
                disabled={!isRunning}
                className="px-5 py-3 rounded-2xl text-xs font-bold text-amber-300 bg-amber-950/50 hover:bg-amber-900/70 border border-amber-500/40 transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                Stop Motor
              </button>
            </div>

            <button
              onClick={() => setEmergencyModalOpen(true)}
              className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-xl shadow-rose-600/30 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Emergency Stop</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Telemetry Specs & Parameters */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
            <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-300 mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Hardware Specifications</span>
            </h4>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-2 border-b border-cyan-500/15">
                <span className="text-slate-400">Drain Assigned:</span>
                <span className="text-white font-bold">DRN-042 (Anna Nagar)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-cyan-500/15">
                <span className="text-slate-400">Motor Type:</span>
                <span className="text-cyan-300 font-bold">24V DC Geared Planetary</span>
              </div>
              <div className="flex justify-between py-2 border-b border-cyan-500/15">
                <span className="text-slate-400">Servo Sluice:</span>
                <span className="text-emerald-400 font-bold">READY (MG996R Metal)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-cyan-500/15">
                <span className="text-slate-400">Microcontroller:</span>
                <span className="text-white">ESP32 Dual Core 240MHz</span>
              </div>
              <div className="flex justify-between py-2 border-b border-cyan-500/15">
                <span className="text-slate-400">Telemetry Channel:</span>
                <span className="text-emerald-400 font-bold">LoRaWAN 868MHz + 4G LTE</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Controller Link:</span>
                <span className="text-cyan-300 font-bold">ONLINE (Ping: 28ms)</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
            <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-300 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>RPM Speed Regulator</span>
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Target Speed:</span>
                <span className="text-cyan-300 font-bold">{rotationRpm} RPM</span>
              </div>
              <input
                type="range"
                min="60"
                max="240"
                step="10"
                value={rotationRpm}
                onChange={(e) => setRotationRpm(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>60 RPM (Eco)</span>
                <span>120 RPM (Standard)</span>
                <span>240 RPM (Max)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stop Confirmation Modal */}
      <AnimatePresence>
        {stopModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#081e36] border border-cyan-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              <h4 className="text-lg font-bold text-white">Stop Motor Confirmation</h4>
              <p className="text-xs text-slate-300 mt-2">
                Are you sure you want to stop the DC waste removal conveyor on DRN-042? Unfinished debris will remain in the primary catch basket.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setStopModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStop}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors"
                >
                  Confirm Stop
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Emergency Stop Confirmation Modal */}
      <AnimatePresence>
        {emergencyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1c0812] border border-rose-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <AlertOctagon className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-rose-400">EMERGENCY STOP OVERRIDE</h4>
                  <p className="text-[11px] text-slate-400 font-mono">Immediate hardware power cutoff</p>
                </div>
              </div>

              <p className="text-xs text-slate-200 mt-4 leading-relaxed">
                Emergency Stop will immediately trip the high-voltage actuator relays and halt all moving mechanical parts. An in-person inspection may be required before clearing.
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEmergencyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmEmergencyStop}
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/30"
                >
                  Confirm Emergency Stop
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
