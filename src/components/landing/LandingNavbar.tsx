import React from 'react';
import { useTranslation } from 'react-i18next';
import { AgriSyncLogo } from '../common/AgriSyncLogo';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { ArrowRight } from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  const { t } = useTranslation(['landing', 'nav', 'common']);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center focus:outline-none hover:opacity-90 transition-opacity"
              title="AgriSync"
            >
              <AgriSyncLogo variant="navbar" />
            </button>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-600">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-emerald-800 transition-colors"
            >
              {t('howItWorks', 'How It Works')}
            </button>
            <button
              onClick={() => scrollToSection('portals')}
              className="hover:text-emerald-800 transition-colors"
            >
              {t('portalAccess', 'Portal Access')}
            </button>
            <button
              onClick={() => scrollToSection('impact')}
              className="hover:text-emerald-800 transition-colors"
            >
              {t('liveImpact', 'Live Impact')}
            </button>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            
            {/* Modular Language Selector */}
            <LanguageSwitcher variant="standard" />

            {/* Login Anchor Button */}
            <button
              onClick={() => scrollToSection('portals')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 active:scale-[0.99]"
            >
              <span>{t('accessPortals', 'Access Portals')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
