import type { Language } from '../types';

import enCommon from './en/common.json';
import enNav from './en/nav.json';
import enFarmer from './en/farmer.json';
import enAdmin from './en/admin.json';
import enLanding from './en/landing.json';

import hiCommon from './hi/common.json';
import hiNav from './hi/nav.json';
import hiFarmer from './hi/farmer.json';
import hiAdmin from './hi/admin.json';
import hiLanding from './hi/landing.json';

import paCommon from './pa/common.json';
import paNav from './pa/nav.json';
import paFarmer from './pa/farmer.json';
import paAdmin from './pa/admin.json';
import paLanding from './pa/landing.json';

import taCommon from './ta/common.json';
import taNav from './ta/nav.json';
import taFarmer from './ta/farmer.json';
import taAdmin from './ta/admin.json';
import taLanding from './ta/landing.json';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  scriptLabel: string;
  badge: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    scriptLabel: 'EN',
    badge: 'English'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    scriptLabel: 'HI',
    badge: 'हिन्दी'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    scriptLabel: 'PA',
    badge: 'ਪੰਜਾਬੀ'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    scriptLabel: 'TA',
    badge: 'தமிழ்'
  }
];

export const resources = {
  en: {
    common: enCommon,
    nav: enNav,
    farmer: enFarmer,
    admin: enAdmin,
    landing: enLanding
  },
  hi: {
    common: hiCommon,
    nav: hiNav,
    farmer: hiFarmer,
    admin: hiAdmin,
    landing: hiLanding
  },
  pa: {
    common: paCommon,
    nav: paNav,
    farmer: paFarmer,
    admin: paAdmin,
    landing: paLanding
  },
  ta: {
    common: taCommon,
    nav: taNav,
    farmer: taFarmer,
    admin: taAdmin,
    landing: taLanding
  }
} as const;

export type TranslationNamespace = keyof typeof resources.en;
