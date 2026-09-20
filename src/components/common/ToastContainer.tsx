import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgBorder = 'border-cyan-500/40 bg-[#081f38]/95 text-cyan-300';
          let icon = <Info className="w-5 h-5 text-cyan-400 shrink-0" />;

          if (toast.type === 'CRITICAL') {
            bgBorder = 'border-rose-500/50 bg-[#250d18]/95 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.25)]';
            icon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
          } else if (toast.type === 'WARNING') {
            bgBorder = 'border-amber-500/50 bg-[#261c0a]/95 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]';
            icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
          } else if (toast.type === 'SUCCESS') {
            bgBorder = 'border-emerald-500/50 bg-[#092419]/95 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto rounded-xl border p-3.5 shadow-2xl backdrop-blur-xl ${bgBorder}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">{toast.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-lg hover:bg-white/10"
                  aria-label="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
