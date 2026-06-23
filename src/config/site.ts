export const defaultLocale = 'es' as const;
export const locales = ['es', 'en'] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export const siteConfig = {
  name: 'Gasolina al día',
  description: 'PWA para consultar precios de combustible en España.',
  url: import.meta.env.ASTRO_SITE ?? 'https://gasolineras.alon.one',
  base: import.meta.env.ASTRO_BASE ?? '/',
  repositoryUrl: import.meta.env.PUBLIC_REPOSITORY_URL ?? 'https://github.com/jalonsomerchan/gasolina',
  author: 'Jorge Alonso',
  defaultLocale,
  locales,
};

export type SiteConfig = typeof siteConfig;
