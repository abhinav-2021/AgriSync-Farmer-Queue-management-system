import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle2, ShieldCheck, Radio } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation('landing');

  const scrollToPortals = () => {
    const el = document.getElementById('portals');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 bg-white">
      
      {/* Background Soft Glow Accents */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-50/60 to-transparent pointer-events-none -z-10" />
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Official GovTech Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>{t('hero.badge', 'Smart APMC Digital Queue System • Haryana & Punjab Mandi Division')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            {t('hero.headlinePart1', 'End the Wait.')}{' '}
            <span className="text-emerald-700 block sm:inline">
              {t('hero.headlinePart2', 'Streamline Procurement.')}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            {t('hero.subheadline', "India's unified digital queue system for smart Mandis. Connecting farmers, operators, and state admins in real-time.")}
          </p>

          {/* Call to Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={scrollToPortals}
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span>{t('hero.accessPortalBtn', 'Access Your Portal')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-sm rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <span>{t('hero.seeHowItWorksBtn', 'See How It Works')}</span>
            </button>
          </div>

          {/* Micro Trust Points */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {t('hero.trustNoQueues', 'Zero Physical Queues')}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {t('hero.trustDirectDbt', '100% Direct DBT Bank Payout')}
            </span>
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              {t('hero.trustRealtimeSync', 'Real-time Token Sync')}
            </span>
          </div>

        </div>

        {/* Hero Interactive Visual Preview (Live Mockup Card) */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xl relative">
            
            {/* Top Mockup Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-slate-400 ml-2">agrisync.gov.in/live-queue</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>{t('hero.liveStreamBadge', 'Live Yard Stream')}</span>
              </div>
            </div>

            {/* Content Preview */}
            <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Token Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-left space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  {t('hero.activeLiveToken', 'Active Live Token')}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-bold text-slate-900">#A-104</span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                    {t('hero.nowCalling', 'Now Calling')}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Balwinder Singh • <strong>Gate Entry 1</strong>
                </p>
                <p className="text-[11px] text-slate-400 font-mono">HR-05-X-6731 (Wheat 55 Qtl)</p>
              </div>

              {/* Progress Timeline Stepper */}
              <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-3">
                    <span>{t('hero.lifecycleTitle', 'Procurement Progression Lifecycle')}</span>
                    <span className="text-emerald-700 font-mono">
                      {t('hero.stagePrefix', 'Stage')} 2 {t('hero.stageOf', 'of')} 4
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 relative">
                    <div className="text-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold mx-auto">✓</div>
                      <span className="text-[10px] font-semibold text-slate-800 block mt-1">
                        {t('hero.stage1', '1. Registered')}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold mx-auto ring-4 ring-emerald-100">2</div>
                      <span className="text-[10px] font-bold text-emerald-800 block mt-1">
                        {t('hero.stage2', '2. Quality Lab')}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold mx-auto">3</div>
                      <span className="text-[10px] font-medium text-slate-400 block mt-1">
                        {t('hero.stage3', '3. Weighbridge')}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold mx-auto">4</div>
                      <span className="text-[10px] font-medium text-slate-400 block mt-1">
                        {t('hero.stage4', '4. Direct DBT')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{t('hero.turnaroundSpeed', 'Turnaround speed:')} <strong>{t('hero.turnaroundSpeedVal', '< 20 mins total')}</strong></span>
                  <span className="text-emerald-700 font-medium">{t('hero.websocketSync', 'Auto-synced via WebSockets')}</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Live Aggregated Statistics Row */}
        <div id="impact" className="mt-14 pt-10 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight block">
              142
            </span>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">
              {t('hero.stats.activeMandis', 'Active APMC Mandis')}
            </span>
          </div>
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight block">
              45,210+
            </span>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">
              {t('hero.stats.farmersRegistered', 'Farmers Registered')}
            </span>
          </div>
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight block">
              1.2M Qtl
            </span>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">
              {t('hero.stats.totalProcured', 'Total Procured')}
            </span>
          </div>
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-mono tracking-tight block">
              ₹2.1B
            </span>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">
              {t('hero.stats.instantDbtDisbursed', 'Instant DBT Disbursed')}
            </span>
          </div>
        </div>

      </div>

    </section>
  );
};
