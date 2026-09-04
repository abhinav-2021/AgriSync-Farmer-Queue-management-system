import React from 'react';
import { useTranslation } from 'react-i18next';
import { AgriSyncLogo } from '../common/AgriSyncLogo';
import { ShieldCheck } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const { t } = useTranslation('landing');

  return (
    <footer className="bg-slate-900 text-slate-400 font-sans border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & Gov badge */}
          <div className="space-y-3 md:col-span-2">
            <div className="bg-white/95 px-3 py-1.5 rounded-lg inline-flex items-center shadow-xs">
              <AgriSyncLogo size="sm" />
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              {t(
                'footer.tagline',
                "India's smart agricultural procurement queue management and real-time scheduling ecosystem for APMC mandis."
              )}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{t('footer.compliance', 'Compliant with Ministry of Agriculture & APMC Mandi Framework')}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              {t('footer.portalsHeader', 'Portals')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#portals" className="hover:text-white transition-colors">
                  {t('footer.farmerApp', 'Farmer Mobile App')}
                </a>
              </li>
              <li>
                <a href="#portals" className="hover:text-white transition-colors">
                  {t('footer.operatorDesk', 'Mandi Desk Terminal')}
                </a>
              </li>
              <li>
                <a href="#portals" className="hover:text-white transition-colors">
                  {t('footer.adminDash', 'State Admin Dashboard')}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  {t('howItWorks', 'How It Works')}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: State Divisions */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              {t('footer.statesHeader', 'Supported States')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Haryana Division (142 Mandis)</li>
              <li>Punjab Division (156 Mandis)</li>
              <li>Rajasthan APMC (Pilot)</li>
              <li>Madhya Pradesh (Pilot)</li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} AgriSync Platform • Smart India Hackathon (SIH 2026). {t('footer.rightsReserved', 'All rights reserved.')}</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">{t('footer.privacy', 'Privacy Policy')}</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">{t('footer.terms', 'Terms of Service')}</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">{t('footer.openProtocol', 'GovTech Open Protocol')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
