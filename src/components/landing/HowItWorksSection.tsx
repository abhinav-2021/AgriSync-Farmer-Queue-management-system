import React from 'react';
import { useTranslation } from 'react-i18next';
import { Smartphone, Ticket, Truck, Banknote } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation('landing');

  const steps = [
    {
      step: '01',
      title: t('workflow.steps.step1.title', 'Register'),
      headline: t('workflow.steps.step1.headline', 'Book a slot from home.'),
      description: t(
        'workflow.steps.step1.desc',
        'Select your preferred Mandi, specify crop type and estimated tonnage, and reserve a guaranteed arrival time window.'
      ),
      icon: <Smartphone className="w-6 h-6 text-emerald-700" />,
      badge: `${t('workflow.stepBadge', 'Step')} 1`
    },
    {
      step: '02',
      title: t('workflow.steps.step2.title', 'Get Token'),
      headline: t('workflow.steps.step2.headline', 'Receive a live digital queue number.'),
      description: t(
        'workflow.steps.step2.desc',
        'Get an instant SMS and electronic QR gate pass with real-time queue position tracking and dynamic wait-time updates.'
      ),
      icon: <Ticket className="w-6 h-6 text-emerald-700" />,
      badge: `${t('workflow.stepBadge', 'Step')} 2`
    },
    {
      step: '03',
      title: t('workflow.steps.step3.title', 'Arrive'),
      headline: t('workflow.steps.step3.headline', 'Enter the Mandi precisely when called.'),
      description: t(
        'workflow.steps.step3.desc',
        'Arrive at the exact summoned gate or weighbridge, eliminating days of chaotic tractor-trolley highway bottlenecks.'
      ),
      icon: <Truck className="w-6 h-6 text-emerald-700" />,
      badge: `${t('workflow.stepBadge', 'Step')} 3`
    },
    {
      step: '04',
      title: t('workflow.steps.step4.title', 'Get Paid'),
      headline: t('workflow.steps.step4.headline', 'Transparent weighing and instant DBT.'),
      description: t(
        'workflow.steps.step4.desc',
        'Certified moisture lab analysis and digital weighbridges trigger immediate Direct Bank Transfer to your bank account.'
      ),
      icon: <Banknote className="w-6 h-6 text-emerald-700" />,
      badge: `${t('workflow.stepBadge', 'Step')} 4`
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
            {t('workflow.badge', 'Seamless Workflow')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('workflow.title', 'How AgriSync Works')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t('workflow.subtitle', 'A frictionless 4-step digital journey from farm booking to bank credit.')}
          </p>
        </div>

        {/* 4-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-100/70 transition-colors">
                    {item.icon}
                  </div>
                  <span className="font-mono text-2xl font-bold text-slate-200 group-hover:text-emerald-200 transition-colors">
                    {item.step}
                  </span>
                </div>

                {/* Content */}
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                  {item.title}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                  {item.headline}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Subtle Step Indicator */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-medium text-slate-600">{item.badge}</span>
                <span className="font-mono text-emerald-700 font-semibold">
                  {t('workflow.automatedBadge', '100% Automated')}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
