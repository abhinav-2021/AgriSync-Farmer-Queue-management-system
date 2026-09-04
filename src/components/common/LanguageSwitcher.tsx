import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES, type LanguageOption } from '../../locales';
import type { Language } from '../../types';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'standard';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'standard',
  className = ''
}) => {
  const { i18n, t } = useTranslation('nav');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangCode = (i18n.language?.split('-')[0] || 'en') as Language;
  const currentLang =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLangCode) ||
    SUPPORTED_LANGUAGES[0];

  const handleSelectLanguage = (langOption: LanguageOption) => {
    i18n.changeLanguage(langOption.code);
    try {
      localStorage.setItem('agrisync_language', langOption.code);
    } catch {
      // Ignore storage errors in restricted contexts
    }
    setIsOpen(false);
  };

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        id="language-switcher-button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={t('selectLanguage', 'Select Language')}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group flex items-center gap-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:scale-[0.98] ${
          isOpen
            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-xs'
            : 'bg-white/90 hover:bg-slate-50 border-slate-200/90 text-slate-700 shadow-2xs'
        } ${variant === 'compact' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'}`}
      >
        <div className="flex items-center gap-1.5">
          <Globe
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              isOpen ? 'text-emerald-700 rotate-12' : 'text-slate-500 group-hover:text-emerald-700'
            }`}
          />
          <span className="font-semibold text-slate-800 tracking-tight">
            {currentLang.nativeName}
          </span>
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60 uppercase">
            {currentLang.scriptLabel}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ease-out ${
            isOpen ? 'rotate-180 text-emerald-700' : 'group-hover:text-slate-600'
          }`}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-switcher-button"
          className="absolute right-0 mt-1.5 w-60 origin-top-right rounded-xl bg-white/95 backdrop-blur-md p-1.5 shadow-xl ring-1 ring-slate-900/5 border border-slate-200/80 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {t('selectLanguage', 'Select Language')}
            </span>
            <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
              4 Regional
            </span>
          </div>

          <div className="space-y-0.5">
            {SUPPORTED_LANGUAGES.map((langOption) => {
              const isSelected = langOption.code === currentLangCode;

              return (
                <button
                  key={langOption.code}
                  role="menuitem"
                  type="button"
                  onClick={() => handleSelectLanguage(langOption)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors duration-150 ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-950 font-medium'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] font-mono font-bold w-6 h-6 flex items-center justify-center rounded-md border ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {langOption.scriptLabel}
                    </span>

                    <div className="flex flex-col">
                      <span
                        className={`text-xs leading-tight ${
                          isSelected ? 'font-bold text-emerald-950' : 'font-medium text-slate-800'
                        }`}
                      >
                        {langOption.nativeName}
                      </span>
                      {langOption.code !== 'en' && (
                        <span className="text-[10px] text-slate-400 leading-none mt-0.5">
                          {langOption.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-700">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
