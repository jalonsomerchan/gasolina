const root = document.querySelector('[data-gasolina-app]');
if (root) {
  const apiBase = (root.dataset.apiBase || 'https://alon.one/api/gasolina2').replace(/\/$/, '');
  const apiKey = root.dataset.apiKey || '';
  const appBase = root.dataset.basePath || '/';
  const mode = root.dataset.mode || 'home';
  const params = new URLSearchParams(location.search);
  const storeKey = 'gasolina-favoritos-v2';
  const $ = (q) => root.querySelector(q);
  const esc = (v) => String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rows = (value) => Array.isArray(value) ? value : Array.isArray(value?.data) ? value.data : value ? [value] : [];
  const fuel = () => $('[name=combustible]')?.value || params.get('combustible') || 'gasolina_95';
  const priceField = (prefix = 'media') => `${prefix}_${fuel()}`;
  const price = (item) => Number(item?.precio || item?.[priceField('media')] || item?.[priceField('min')] || 0);
  const euro = (value) => Number(value) > 0 ? `${Number(value).toFixed(3).replace('.', ',')} €/l` : '—';
  const route = (path, query = {}) => {
    const url = new URL(`${appBase.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`, location.origin);
    Object.entries(query).forEach(([key, value]) => value && url.searchParams.set(key, value));
    return url.pathname + url.search;
  };
  const readFavs = () => { try { return JSON.parse(localStorage.getItem(storeKey) || '{"stations":[],"places":[]}'); } catch { return { stations: [], places: [] }; } };
  const writeFavs = (value) => localStorage.setItem(storeKey, JSON.stringify(value));
  const setStatus = (text) => { const el = $('[data-status]'); if (el) el.textContent = text; };

  function setFormFromUrl() {
    ['q', 'provincia', 'municipio', 'radio_km', 'combustible'].forEach((name) => {
      const input = $(`[name=${name}]`);
      if (input && params.get(name)) input.value = params.get(name);
    });
  }

  async function api(endpoint, query = {}) {
    if (!apiKey) throw new Error('Falta PUBLIC_GASOLINA_API_KEY');
    const url = new URL(`${apiBase}/${endpoint}`);
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
    });
    const response = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}`, 'X-API-Key': apiKey } });
    if (!response.ok) throw new Error(`API ${response.status}`);
    return response.json();
  }

  function renderMap(items) {
    const first = items.find((item) => item.latitud && item.longitud);
    const map = $('[data-map]');
    if (!map || !first) return;
    const lat = Number(first.latitud);
    const lon = Number(first.longitud);
    map.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.05},${lat - 0.04},${lon + 0.05},${lat + 0.04}&layer=mapnik&marker=${lat},${lon}`;
  }

  function renderChart(items) {
    const values = items.map(price).filter(Boolean).slice(0, 40);
    const chart = $('[data-chart]');
    if (!chart) return;
    const max = Math.max(...values, 1);
    chart.innerHTML = values.map((value) => `<span title="${euro(value)}" style="height:${Math.max(10, (value / max) * 100)}%"></span>`).join('');
  }

  function renderTable(items) {
    const table = $('[data-table]');
    if (!table) return;
    if (!items.length) { table.innerHTML = ''; return; }
    table.innerHTML = `<table><thead><tr><th>Nombre</th><th>Zona</th><th>Precio</th><th>Fecha</th></tr></thead><tbody>${items.slice(0, 40).map((item) => `<tr><td>${esc(item.rotulo || item.nombre || item.municipio || item.provincia || '—')}</td><td>${esc([item.municipio, item.provincia].filter(Boolean).join(', '))}</td><td>${euro(price(item))}</td><td>${esc(item.fecha || item.fecha_precio || item.ultima_fecha_precios || '—')}</td></tr>`).join('')}</tbody></table>`;
  }

  function card(item) {
    const title = item.rotulo || item.nombre || item.municipio || item.provincia || item.periodo || 'Resultado';
    const area = [item.direccion, item.municipio, item.provincia].filter(Boolean).join(' · ');
    const stationUrl = item.ideess ? route('gasolinera/', { ideess: item.ideess }) : '';
    const placeUrl = item.municipio ? route('municipios/', { provincia: item.provincia, municipio: item.municipio }) : item.provincia ? route('municipios/', { provincia: item.provincia }) : '';
    return `<article class="station-card"><div><h3>${stationUrl ? `<a href="${stationUrl}">${esc(title)}</a>` : esc(title)}</h3><p>${esc(area)}</p><small>${item.distancia_km ? `${Number(item.distancia_km).toFixed(1)} km · ` : ''}${item.total_gasolineras ? `${item.total_gasolineras} gasolineras` : ''}</small></div><strong>${euro(price(item))}</strong><div class="card-actions">${stationUrl ? `<a class="mini-link" href="${stationUrl}">Detalle</a><button type="button" data-fav-station="${item.ideess}" data-name="${esc(title)}">★</button>` : ''}${placeUrl ? `<a class="mini-link" href="${placeUrl}">Ver zona</a><button type="button" data-fav-place="${esc(item.provincia || '')}" data-municipio="${esc(item.municipio || '')}">＋</button>` : ''}</div></article>`;
  }

  function render(value, title = 'Resultados') {
    const items = rows(value).filter(Boolean);
    $('[data-title]').textContent = title;
    setStatus(items.length ? '' : 'Sin datos para esta consulta.');
    $('[data-results]').innerHTML = items.slice(0, 60).map(card).join('');
    const values = items.map(price).filter(Boolean);
    $('[data-count]').textContent = items.length;
    $('[data-cheap]').textContent = values.length ? euro(Math.min(...values)) : '—';
    $('[data-expensive]').textContent = values.length ? euro(Math.max(...values)) : '—';
    renderMap(items);
    renderChart(items);
    renderTable(items);
  }

  async function loadStations() { return render(await api('gasolineras', { q: $('[name=q]').value.trim(), provincia: $('[name=provincia]').value.trim(), municipio: $('[name=municipio]').value.trim(), combustible: fuel(), order: 'precio_asc', limit: 80 }), 'Gasolineras'); }
  async function loadProvinces() { return render(await api('provincias'), 'Provincias'); }
  async function loadMunicipalities() { return render(await api('municipios', { provincia: $('[name=provincia]').value.trim(), q: $('[name=q]').value.trim() || $('[name=municipio]').value.trim() }), 'Municipios'); }
  async function loadRanking() { return render(await api('ranking', { combustible: fuel(), provincia: $('[name=provincia]').value.trim(), municipio: $('[name=municipio]').value.trim(), limit: 80 }), 'Ranking'); }
  async function loadBrands() { return render(await api('rotulos', { q: $('[name=q]').value.trim(), provincia: $('[name=provincia]').value.trim(), municipio: $('[name=municipio]').value.trim(), limit: 100 }), 'Rótulos'); }
  async function loadCompare() { const ideess = params.get('ideess') || $('[name=q]').value.trim(); if (!ideess) { render([], 'Añade ideess=1,2,3 para comparar'); return; } return render(await api('comparativa', { ideess, combustible: fuel() }), 'Comparativa'); }

  async function loadStation() {
    const ideess = params.get('ideess') || $('[name=q]').value.trim();
    if (!ideess) { render([], 'Indica un ideess en la URL o en el buscador'); return; }
    const detail = await api('gasolinera', { ideess });
    render(detail, detail.rotulo || detail.nombre || 'Gasolinera');
    const history = await api('historico_gasolineras', { ideess, combustible: fuel(), fecha_desde: params.get('fecha_desde') || '' });
    renderChart(rows(history));
  }

  function loadNearby() {
    setStatus('Buscando ubicación…');
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      render(await api('cercanas', { latitud: coords.latitude, longitud: coords.longitude, radio_km: $('[name=radio_km]').value || 10, combustible: fuel(), order: 'precio_asc', limit: 80 }), 'Cercanas');
    }, () => setStatus('No se pudo obtener la ubicación.'));
  }

  async function loadFavorites() {
    const favorites = readFavs();
    const stationIds = [...new Set(favorites.stations.map((item) => item.ideess).filter(Boolean))];
    const placeItems = favorites.places || [];
    const stationData = stationIds.length ? rows(await api('gasolineras_detalle', { ideess: stationIds.join(',') })) : [];
    const placeData = [];
    for (const place of placeItems.slice(0, 8)) {
      const data = await api('municipios', { provincia: place.provincia, q: place.municipio || '' });
      placeData.push(...rows(data));
    }
    render([...stationData, ...placeData], 'Favoritos');
  }

  async function loadStats() {
    const [stats, update, extremes, trend] = await Promise.all([
      api('estadisticas', { provincia: $('[name=provincia]').value.trim(), municipio: $('[name=municipio]').value.trim() }),
      api('actualizacion'),
      api('extremos', { combustible: fuel(), limit: 8 }),
      api('tendencia', { periodo: 'dia', provincia: $('[name=provincia]').value.trim(), municipio: $('[name=municipio]').value.trim() }),
    ]);
    const summary = [{ rotulo: 'Gasolineras', precio: stats.total_gasolineras, fecha: update.ultima_fecha_precios }, { rotulo: 'Provincias', precio: stats.total_provincias, fecha: update.primera_fecha_precios }, ...rows(extremes.baratas), ...rows(extremes.caras)];
    render(summary, 'Estadísticas');
    renderChart(rows(trend.data));
  }

  function updateSaving() {
    const liters = Number($('[name=litros]')?.value || 0);
    const diff = Number(String($('[name=diferencia]')?.value || '0').replace(',', '.'));
    const saving = $('[data-saving]');
    if (saving) saving.textContent = liters && diff ? `${(liters * diff).toFixed(2).replace('.', ',')} €` : '—';
  }

  async function refresh() {
    setStatus('Cargando…');
    try {
      if (mode === 'provinces') await loadProvinces();
      else if (mode === 'municipalities') await loadMunicipalities();
      else if (mode === 'station') await loadStation();
      else if (mode === 'nearby') loadNearby();
      else if (mode === 'ranking') await loadRanking();
      else if (mode === 'brands') await loadBrands();
      else if (mode === 'compare') await loadCompare();
      else if (mode === 'favorites') await loadFavorites();
      else if (mode === 'stats') await loadStats();
      else if (mode === 'tools') { render([], 'Calculadora de ahorro'); updateSaving(); }
      else if (mode === 'stations') await loadStations();
      else { const favorites = readFavs(); if (favorites.stations.length || favorites.places.length) await loadFavorites(); else await loadRanking(); }
    } catch (error) { setStatus(error.message); }
  }

  let suggestTimer = 0;
  $('[name=q]')?.addEventListener('input', () => {
    clearTimeout(suggestTimer);
    const q = $('[name=q]').value.trim();
    if (q.length < 2) return;
    suggestTimer = setTimeout(async () => {
      try {
        const suggestions = await api('autocomplete', { q, type: 'all', limit: 15 });
        $('[data-suggestions]').innerHTML = rows(suggestions).map((item) => `<option value="${esc(item.ideess || item.municipio || item.provincia || item.label)}">${esc(item.label)}</option>`).join('');
      } catch {}
    }, 250);
  });

  root.addEventListener('submit', (event) => { event.preventDefault(); refresh(); });
  root.addEventListener('input', (event) => { if (event.target.matches('[name=litros], [name=diferencia]')) updateSaving(); });
  root.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.matches('[data-nearby]')) loadNearby();
    if (button.dataset.favStation) {
      const favorites = readFavs();
      const ideess = Number(button.dataset.favStation);
      if (!favorites.stations.some((item) => item.ideess === ideess)) favorites.stations.push({ ideess, name: button.dataset.name || '' });
      writeFavs(favorites);
      setStatus('Gasolinera guardada.');
    }
    if (button.dataset.favPlace !== undefined) {
      const favorites = readFavs();
      const place = { provincia: button.dataset.favPlace, municipio: button.dataset.municipio || '' };
      if (!favorites.places.some((item) => item.provincia === place.provincia && item.municipio === place.municipio)) favorites.places.push(place);
      writeFavs(favorites);
      setStatus('Zona guardada.');
    }
  });

  setFormFromUrl();
  updateSaving();
  refresh();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register(root.dataset.sw || './sw.js').catch(() => {});
}
