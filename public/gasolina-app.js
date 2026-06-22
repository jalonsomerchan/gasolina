const root = document.querySelector('[data-gasolina-app]');
if (root) {
  const base = (root.dataset.apiBase || 'https://alon.one/api/gasolina2').replace(/\/$/, '');
  const key = root.dataset.apiKey || '';
  const storeKey = 'gasolina-favoritos-v1';
  const $ = (q) => root.querySelector(q);
  const favs = () => JSON.parse(localStorage.getItem(storeKey) || '{"stations":[],"places":[]}');
  const saveFavs = (v) => localStorage.setItem(storeKey, JSON.stringify(v));
  const esc = (v) => String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rows = (v) => Array.isArray(v) ? v : Array.isArray(v?.data) ? v.data : v ? [v] : [];
  const price = (r) => Number(r.media_gasolina_95 || r.min_gasolina_95 || r.precio || 0);
  const euro = (v) => Number(v) > 0 ? `${Number(v).toFixed(3).replace('.', ',')} €/l` : '—';
  async function api(endpoint, params = {}) {
    if (!key) throw new Error('Falta PUBLIC_GASOLINA_API_KEY');
    const url = new URL(`${base}/${endpoint}`);
    Object.entries(params).forEach(([k, v]) => v && url.searchParams.set(k, v));
    const res = await fetch(url, { headers: { Authorization: `Bearer ${key}`, 'X-API-Key': key } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
  function render(data, title = 'Resultados') {
    const items = rows(data).filter(Boolean);
    $('[data-title]').textContent = title;
    $('[data-status]').textContent = items.length ? '' : 'Sin datos para esta búsqueda.';
    $('[data-results]').innerHTML = items.slice(0, 30).map((r) => `<article class="station-card"><div><h3>${esc(r.rotulo || r.nombre || r.provincia || r.municipio || 'Gasolinera')}</h3><p>${esc(r.direccion || '')}</p><small>${esc(r.municipio || '')} ${esc(r.provincia || '')}${r.distancia_km ? ` · ${Number(r.distancia_km).toFixed(1)} km` : ''}</small></div><strong>${euro(price(r))}</strong>${r.ideess ? `<button data-fav="${r.ideess}" data-name="${esc(r.rotulo || r.nombre)}">★</button>` : ''}</article>`).join('');
    const values = items.map(price).filter(Boolean);
    $('[data-cheap]').textContent = values.length ? euro(Math.min(...values)) : '—';
    $('[data-expensive]').textContent = values.length ? euro(Math.max(...values)) : '—';
    $('[data-count]').textContent = items.length;
    const first = items.find((r) => r.latitud && r.longitud);
    if (first) {
      const lat = Number(first.latitud); const lon = Number(first.longitud);
      $('[data-map]').src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.04},${lat - 0.03},${lon + 0.04},${lat + 0.03}&layer=mapnik&marker=${lat},${lon}`;
    }
    $('[data-chart]').innerHTML = values.slice(0, 20).map((v) => `<span style="height:${Math.max(18, v * 42)}%"></span>`).join('');
  }
  async function search() {
    $('[data-status]').textContent = 'Cargando…';
    const q = $('[name=q]').value.trim();
    const provincia = $('[name=provincia]').value.trim();
    const municipio = $('[name=municipio]').value.trim();
    try { render(await api('gasolineras', { q, provincia, municipio, combustible: 'gasolina_95', order: 'precio_asc' }), 'Gasolineras'); }
    catch (e) { $('[data-status]').textContent = e.message; }
  }
  async function nearby() {
    $('[data-status]').textContent = 'Buscando ubicación…';
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try { render(await api('cercanas', { latitud: coords.latitude, longitud: coords.longitude, radio_km: 10, combustible: 'gasolina_95', order: 'precio_asc' }), 'Cercanas'); }
      catch (e) { $('[data-status]').textContent = e.message; }
    }, () => $('[data-status]').textContent = 'No se pudo obtener la ubicación.');
  }
  root.addEventListener('submit', (e) => { e.preventDefault(); search(); });
  root.addEventListener('click', async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.matches('[data-nearby]')) nearby();
    if (b.matches('[data-fav]')) { const f = favs(); f.stations.push({ ideess: Number(b.dataset.fav), name: b.dataset.name }); saveFavs(f); $('[data-status]').textContent = 'Favorito guardado.'; }
  });
  async function init() {
    const f = favs();
    try {
      if (f.stations.length) render(await api('gasolineras_detalle', { ideess: f.stations.map((x) => x.ideess).join(',') }), 'Favoritos');
      else render(await api('ranking', { combustible: 'gasolina_95', limit: 12 }), 'Ranking');
    } catch (e) { $('[data-status]').textContent = e.message; }
  }
  init();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register(root.dataset.sw || './sw.js').catch(() => {});
}
