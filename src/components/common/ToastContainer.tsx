import React from 'react';
import { useQueue } from '../../context/QueueContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useQueue();

  if (toasts.length === 0) return null;

  return (
    <aside aria-label="Notifications" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      {toasts.map((toast) => {
        const isUrgent = toast.type === 'urgent';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-lg p-3.5 shadow-lg border transition-all duration-200 flex items-start gap-3 bg-white ${
              isUrgent
                ? 'border-amber-400/80 ring-1 ring-amber-400/20'
                : isSuccess
                ? 'border-emerald-400/80 ring-1 ring-emerald-400/20'
                : 'border-slate-200'
            }`}
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {isUrgent ? (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              ) : isSuccess ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <Info className="w-4 h-4 text-slate-500" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <h4 className="font-semibold text-xs text-slate-900 leading-snug">
                  {toast.title}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono-num">{toast.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{toast.message}</p>
            </div>

            {/* Close button */}
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors flex-shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </aside>
  );
};
