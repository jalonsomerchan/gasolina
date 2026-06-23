import type { Locale } from '../config/site';

export const fuelTypes = [
  { id: 'gasolina_95', label: 'Gasolina 95' },
  { id: 'gasolina_98', label: 'Gasolina 98' },
  { id: 'gasoleo_a', label: 'Gasóleo A' },
] as const;

export const gasolinaPages = [
  { path: '/', key: 'home', mode: 'home' },
  { path: '/gasolineras/', key: 'stations', mode: 'stations' },
  { path: '/provincias/', key: 'provinces', mode: 'provinces' },
  { path: '/municipios/', key: 'municipalities', mode: 'municipalities' },
  { path: '/gasolinera/', key: 'station', mode: 'station' },
  { path: '/cercanas/', key: 'nearby', mode: 'nearby' },
  { path: '/ranking/', key: 'ranking', mode: 'ranking' },
  { path: '/rotulos/', key: 'brands', mode: 'brands' },
  { path: '/comparador/', key: 'compare', mode: 'compare' },
  { path: '/favoritos/', key: 'favorites', mode: 'favorites' },
  { path: '/estadisticas/', key: 'stats', mode: 'stats' },
  { path: '/utilidades/', key: 'tools', mode: 'tools' },
] as const;

export type GasolinaMode = (typeof gasolinaPages)[number]['mode'];

type PageKey = (typeof gasolinaPages)[number]['key'];

type Copy = {
  title: string;
  description: string;
  pages: Record<PageKey, string>;
  hero: { eyebrow: string; title: string; text: string; primary: string; secondary: string };
  app: Record<string, string>;
};

const copy: Record<Locale, Copy> = {
  es: {
    title: 'Gasolina al día',
    description: 'Consulta precios de combustible en España con mapas, histórico, favoritos y comparativas.',
    pages: { home: 'Inicio', stations: 'Gasolineras', provinces: 'Provincias', municipalities: 'Municipios', station: 'Gasolinera', nearby: 'Cercanas', ranking: 'Ranking', brands: 'Rótulos', compare: 'Comparador', favorites: 'Favoritos', stats: 'Estadísticas', tools: 'Utilidades' },
    hero: { eyebrow: 'PWA', title: 'Encuentra el mejor precio antes de repostar', text: 'Busca, compara y guarda favoritos.', primary: 'Buscar cercanas', secondary: 'Ver estadísticas' },
    app: { searchPlaceholder: 'Municipio, provincia, rótulo o dirección', searchLabel: 'Buscar', fuel: 'Combustible', province: 'Provincia', municipality: 'Municipio', radius: 'Radio km', results: 'Resultados', map: 'Mapa', chart: 'Histórico', utilities: 'Utilidades', cheapest: 'Más barata', expensive: 'Más cara', loading: 'Cargando…', empty: 'Sin datos.', liters: 'Litros', priceDifference: 'Diferencia €/l' },
  },
  en: {
    title: 'Fuel Prices Daily',
    description: 'Check fuel prices in Spain with maps, history, favorites and comparisons.',
    pages: { home: 'Home', stations: 'Stations', provinces: 'Provinces', municipalities: 'Municipalities', station: 'Station', nearby: 'Nearby', ranking: 'Ranking', brands: 'Brands', compare: 'Compare', favorites: 'Favorites', stats: 'Stats', tools: 'Tools' },
    hero: { eyebrow: 'PWA', title: 'Find the best price before filling up', text: 'Search, compare and save favorites.', primary: 'Find nearby', secondary: 'View stats' },
    app: { searchPlaceholder: 'Municipality, province, brand or address', searchLabel: 'Search', fuel: 'Fuel', province: 'Province', municipality: 'Municipality', radius: 'Radius km', results: 'Results', map: 'Map', chart: 'History', utilities: 'Tools', cheapest: 'Cheapest', expensive: 'Most expensive', loading: 'Loading…', empty: 'No data.', liters: 'Liters', priceDifference: 'Difference €/l' },
  },
};

export function getGasolinaCopy(locale: Locale) { return copy[locale]; }
export type GasolinaCopy = ReturnType<typeof getGasolinaCopy>;
