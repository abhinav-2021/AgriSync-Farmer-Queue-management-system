import React from 'react';
import { useQueue } from '../../context/QueueContext';
import { STATE_KPI_METRICS } from '../../lib/mockData';
import { Building2, Users, Wheat, Landmark } from 'lucide-react';

export const StateKpiRow: React.FC = () => {
  const { selectedStateFilter } = useQueue();
  const metrics = STATE_KPI_METRICS[selectedStateFilter] || STATE_KPI_METRICS['all'];

  const cards = [
    {
      title: 'Total Active Mandis',
      value: metrics.mandisCount,
      subtext: metrics.mandisSubtext,
      icon: <Building2 className="w-4 h-4 text-slate-500" />
    },
    {
      title: 'Registered Farmers',
      value: metrics.farmersCount,
      subtext: metrics.farmersSubtext,
      icon: <Users className="w-4 h-4 text-slate-500" />
    },
    {
      title: 'Total Procured',
      value: metrics.procuredVolume,
      subtext: metrics.procuredSubtext,
      icon: <Wheat className="w-4 h-4 text-slate-500" />
    },
    {
      title: 'MSP Funds Disbursed',
      value: metrics.fundsDisbursed,
      subtext: metrics.fundsSubtext,
      icon: <Landmark className="w-4 h-4 text-slate-500" />
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {card.title}
            </span>
            <div className="p-1.5 rounded-md bg-slate-50 border border-slate-100">
              {card.icon}
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-num tracking-tight block">
              {card.value}
            </span>
            <p className="text-[11px] text-slate-400 font-normal mt-1">
              {card.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
