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
  navIcons: Record<PageKey, string>;
  hero: { eyebrow: string; title: string; text: string; primary: string; secondary: string };
  app: Record<string, string>;
};

const copy: Record<Locale, Copy> = {
  es: {
    title: 'Gasolina al día',
    description: 'Consulta precios de combustible en España con mapas, histórico, favoritos y comparativas.',
    pages: { home: 'Inicio', stations: 'Gasolineras', provinces: 'Provincias', municipalities: 'Municipios', station: 'Gasolinera', nearby: 'Cercanas', ranking: 'Ranking', brands: 'Rótulos', compare: 'Comparador', favorites: 'Favoritos', stats: 'Estadísticas', tools: 'Utilidades' },
    navIcons: { home: '⌾', stations: '▥', provinces: '⌂', municipalities: '⌖', station: '·', nearby: '⌁', ranking: '≡', brands: '◌', compare: '⇄', favorites: '♡', stats: '▥', tools: '▦' },
    hero: { eyebrow: 'PWA', title: 'Encuentra el mejor precio antes de repostar', text: 'Busca, compara y guarda favoritos.', primary: 'Buscar cercanas', secondary: 'Ver estadísticas' },
    app: { searchPlaceholder: 'Busca zona o dirección', searchLabel: 'Buscar', fuel: 'Combustible', province: 'Provincia', municipality: 'Municipio', anyProvince: 'Todas', anyMunicipality: 'Todos', radius: 'Radio', results: 'Resultados', summaryLabel: 'Resumen de precios', navLabel: 'Secciones de gasolina', map: 'Mapa', centerMap: 'Centrar', viewList: 'Ver lista', chart: 'Histórico gasolina 95', utilities: 'Utilidades', cheapest: 'Más barata', average: 'Media', expensive: 'Más cara', selectedFuel: 'Gasolina 95', radar: 'Radar de precios', stationsAnalyzed: 'estaciones analizadas', bestNearYou: 'Mejor precio cerca de ti', sort: 'Ordenar', price: 'Precio', distance: 'Distancia', filters: 'Filtros rápidos', all: 'Todas', underPrice: '< 1,65 €', openNow: 'Cercanas', historyShort: 'Histórico', saving: 'Ahorro 50L', loading: 'Cargando…', empty: 'Sin datos.', detail: 'Detalle', viewZone: 'Ver zona', stationSaved: 'Gasolinera guardada.', placeSaved: 'Zona guardada.', location: 'Buscando ubicación…', locationShort: 'Madrid', locationError: 'No se pudo obtener la ubicación.', demoUpdate: 'Hoy 08:45', demoNotice: 'Demo visual sin API key', liters: 'Litros', priceDifference: 'Diferencia €/l' },
  },
  en: {
    title: 'Fuel Prices Daily',
    description: 'Check fuel prices in Spain with maps, history, favorites and comparisons.',
    pages: { home: 'Home', stations: 'Stations', provinces: 'Provinces', municipalities: 'Municipalities', station: 'Station', nearby: 'Nearby', ranking: 'Ranking', brands: 'Brands', compare: 'Compare', favorites: 'Favorites', stats: 'Stats', tools: 'Tools' },
    navIcons: { home: '⌾', stations: '▥', provinces: '⌂', municipalities: '⌖', station: '·', nearby: '⌁', ranking: '≡', brands: '◌', compare: '⇄', favorites: '♡', stats: '▥', tools: '▦' },
    hero: { eyebrow: 'PWA', title: 'Find the best price before filling up', text: 'Search, compare and save favorites.', primary: 'Find nearby', secondary: 'View stats' },
    app: { searchPlaceholder: 'Search area or address', searchLabel: 'Search', fuel: 'Fuel', province: 'Province', municipality: 'Municipality', anyProvince: 'All', anyMunicipality: 'All', radius: 'Radius', results: 'Results', summaryLabel: 'Price summary', navLabel: 'Fuel app sections', map: 'Map', centerMap: 'Center', viewList: 'View list', chart: 'Fuel 95 history', utilities: 'Tools', cheapest: 'Cheapest', average: 'Average', expensive: 'Most expensive', selectedFuel: 'Fuel 95', radar: 'Price radar', stationsAnalyzed: 'stations analyzed', bestNearYou: 'Best price near you', sort: 'Sort', price: 'Price', distance: 'Distance', filters: 'Quick filters', all: 'All', underPrice: '< €1.65', openNow: 'Nearby', historyShort: 'History', saving: '50L saving', loading: 'Loading…', empty: 'No data.', detail: 'Detail', viewZone: 'View area', stationSaved: 'Station saved.', placeSaved: 'Area saved.', location: 'Finding location…', locationShort: 'Madrid', locationError: 'Could not get location.', demoUpdate: 'Today 08:45', demoNotice: 'Visual demo without API key', liters: 'Liters', priceDifference: 'Difference €/l' },
  },
};

export function getGasolinaCopy(locale: Locale) { return copy[locale]; }
export type GasolinaCopy = ReturnType<typeof getGasolinaCopy>;
