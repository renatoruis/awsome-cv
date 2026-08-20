import cvEn from '../data/cv.en.json';
import cvPtBr from '../data/cv.pt-br.json';
import cvPtPt from '../data/cv.pt-pt.json';

export const SITE = 'https://cv.timdevops.com.br';
export const LOCALES = ['en', 'pt-pt', 'pt-br'] as const;

export type Locale = (typeof LOCALES)[number];
export type Cv = typeof cvEn;

export const cvs: Record<Locale, Cv> = {
  en: cvEn,
  'pt-pt': cvPtPt as Cv,
  'pt-br': cvPtBr as Cv,
};

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getCv(locale: string | undefined): Cv | undefined {
  return isLocale(locale) ? cvs[locale] : undefined;
}
