import type { Locale } from '../config/site';

export const fuelTypes = [
  { id: 'gasolina_95', label: 'Gasolina 95' },
  { id: 'gasolina_98', label: 'Gasolina 98' },
  { id: 'gasoleo_a', label: 'Gasóleo A' },
] as const;

export const gasolinaPages = [
  { path: '/', key: 'home', mode: 'home' },
  { path: '/gasolineras/', key: 'stations', mode: 'stations' },
  { path: '/cercanas/', key: 'nearby', mode: 'nearby' },
  { path: '/favoritos/', key: 'favorites', mode: 'favorites' },
  { path: '/estadisticas/', key: 'stats', mode: 'stats' },
] as const;

const copy = {
  es: {
    title: 'Gasolina al día',
    description: 'Consulta precios de combustible en España.',
    nav: { search: 'Buscar' },
    pages: { home: 'Inicio', stations: 'Gasolineras', nearby: 'Cercanas', favorites: 'Favoritos', stats: 'Estadísticas' },
    hero: { eyebrow: 'PWA', title: 'Encuentra el mejor precio antes de repostar', text: 'Busca, compara y guarda favoritos.', primary: 'Buscar cercanas', secondary: 'Ver estadísticas' },
    app: { apiMissing: 'Configura la clave pública de la API.', searchPlaceholder: 'Buscar…', searchLabel: 'Buscar', fuel: 'Combustible', province: 'Provincia', municipality: 'Municipio', radius: 'Radio', locate: 'Usar mi ubicación', save: 'Guardar favorito', currentPrices: 'Precios actuales', favoriteStations: 'Tus gasolineras', favoriteMunicipalities: 'Tus municipios', noFavorites: 'Sin favoritos.', results: 'Resultados', map: 'Mapa', chart: 'Histórico', table: 'Tabla', ranking: 'Ranking', stats: 'Estadísticas', utilities: 'Utilidades', cheapest: 'Más baratas', expensive: 'Más caras', savings: 'Ahorro', updated: 'Actualización', loading: 'Cargando…', empty: 'Sin datos.', error: 'Error al cargar.', openMap: 'Abrir mapa', today: 'Hoy', month: 'Últimos 30 días', liters: 'Litros', priceDifference: 'Diferencia', estimatedSaving: 'Ahorro aproximado', installHint: 'Instalable como app.', useLocation: 'Cercanas', details: 'Detalle' },
  },
  en: {
    title: 'Fuel Prices Daily', description: 'Check fuel prices in Spain.', nav: { search: 'Search' }, pages: { home: 'Home', stations: 'Stations', nearby: 'Nearby', favorites: 'Favorites', stats: 'Stats' }, hero: { eyebrow: 'PWA', title: 'Find the best price before filling up', text: 'Search, compare and save favorites.', primary: 'Find nearby', secondary: 'View stats' },
    app: { apiMissing: 'Configure the public API key.', searchPlaceholder: 'Search…', searchLabel: 'Search', fuel: 'Fuel', province: 'Province', municipality: 'Municipality', radius: 'Radius', locate: 'Use my location', save: 'Save favorite', currentPrices: 'Current prices', favoriteStations: 'Your stations', favoriteMunicipalities: 'Your municipalities', noFavorites: 'No favorites.', results: 'Results', map: 'Map', chart: 'History', table: 'Table', ranking: 'Ranking', stats: 'Stats', utilities: 'Tools', cheapest: 'Cheapest', expensive: 'Most expensive', savings: 'Saving', updated: 'Updated', loading: 'Loading…', empty: 'No data.', error: 'Loading error.', openMap: 'Open map', today: 'Today', month: 'Last 30 days', liters: 'Liters', priceDifference: 'Difference', estimatedSaving: 'Approximate saving', installHint: 'Installable as an app.', useLocation: 'Nearby', details: 'Details' },
  },
} as const;

export function getGasolinaCopy(locale: Locale) { return copy[locale]; }
export type GasolinaCopy = ReturnType<typeof getGasolinaCopy>;
