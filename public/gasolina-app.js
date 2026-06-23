const root = document.querySelector('[data-gasolina-app]');
if (root) {
  const apiBase = (root.dataset.apiBase || 'https://alon.one/api/gasolina2').replace(/\/$/, '');
  const apiKey = root.dataset.apiKey || '';
  const defaultIpApiBase = 'https://ipapi.co/json/';
  const ipApiBases = [root.dataset.ipApiBase, defaultIpApiBase]
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index);
  const appBase = root.dataset.basePath || '/';
  const mode = root.dataset.mode || 'home';
  const params = new URLSearchParams(location.search);
  const storeKey = 'gasolina-favoritos-v2';
  const $ = (q) => root.querySelector(q);
  const label = (key, fallback) => root.dataset[key] || fallback;
  const esc = (v) => String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rows = (value) => Array.isArray(value) ? value : Array.isArray(value?.data) ? value.data : value ? [value] : [];
  const fuel = () => $('[name=combustible]')?.value || params.get('combustible') || 'gasolina_95';
  const priceField = (prefix = 'media') => `${prefix}_${fuel()}`;
  const price = (item) => Number(item?.precio || item?.[priceField('media')] || item?.[priceField('min')] || 0);
  const euro = (value) => Number(value) > 0 ? `${Number(value).toFixed(3).replace('.', ',')} €/L` : '—';
  const money = (value) => Number(value) > 0 ? `${Number(value).toFixed(2).replace('.', ',')} €` : '—';
  const readFavs = () => { try { return JSON.parse(localStorage.getItem(storeKey) || '{"stations":[],"places":[]}'); } catch { return { stations: [], places: [] }; } };
  const writeFavs = (value) => localStorage.setItem(storeKey, JSON.stringify(value));
  const setStatus = (text) => { const el = $('[data-status]'); if (el) el.textContent = text; };
  const nearbyTitle = () => label('nearbyTitle', 'Mejor precio cerca de ti');
  const logoFor = (title) => {
    const key = String(title || '').toLowerCase();
    if (key.includes('repsol')) return `${appBase}station-logos/repsol.png`;
    if (key.includes('bp')) return `${appBase}station-logos/bp.png`;
    if (key.includes('cepsa')) return `${appBase}station-logos/cepsa.png`;
    if (key.includes('plenoil')) return `${appBase}station-logos/plenoil.png`;
    if (key.includes('ballenoil')) return `${appBase}station-logos/ballenoil.png`;
    return '';
  };
  const route = (path, query = {}) => {
    const url = new URL(`${appBase.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`, location.origin);
    Object.entries(query).forEach(([key, value]) => value && url.searchParams.set(key, value));
    return url.pathname + url.search;
  };

  const demoStations = [
    { ideess: 1, rotulo: 'LowCost Fuels', direccion: 'C. de Méndez Álvaro, 18', municipio: 'Madrid', provincia: 'Madrid', latitud: 40.401, longitud: -3.691, distancia_km: 0.4, precio: 1.639, fecha: 'Hoy 08:45' },
    { ideess: 2, rotulo: 'Repsol', direccion: 'P.º de las Delicias, 120', municipio: 'Madrid', provincia: 'Madrid', latitud: 40.397, longitud: -3.695, distancia_km: 0.6, precio: 1.649, fecha: 'Hoy 08:42' },
    { ideess: 3, rotulo: 'BP', direccion: 'C. de Embajadores, 190', municipio: 'Madrid', provincia: 'Madrid', latitud: 40.399, longitud: -3.705, distancia_km: 0.9, precio: 1.659, fecha: 'Hoy 08:35' },
    { ideess: 4, rotulo: 'Cepsa', direccion: 'Av. Ciudad de Barcelona, 88', municipio: 'Madrid', provincia: 'Madrid', latitud: 40.407, longitud: -3.681, distancia_km: 1.1, precio: 1.669, fecha: 'Hoy 08:41' },
    { ideess: 5, rotulo: 'Plenoil', direccion: 'C. Sirio Delgado, 8', municipio: 'Madrid', provincia: 'Madrid', latitud: 40.391, longitud: -3.688, distancia_km: 1.6, precio: 1.689, fecha: 'Hoy 08:33' },
  ];

  function setFormFromUrl() {
    ['q', 'provincia', 'municipio', 'radio_km', 'combustible'].forEach((name) => {
      const input = $(`[name=${name}]`);
      if (input && params.get(name)) input.value = params.get(name);
    });
  }

  async function api(endpoint, query = {}) {
    if (!apiKey) return null;
    const url = new URL(`${apiBase}/${endpoint}`);
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
    });
    const response = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}`, 'X-API-Key': apiKey } });
    if (!response.ok) throw new Error(`API ${response.status}`);
    return response.json();
  }

  function renderMap(items) {
    const map = $('[data-map]');
    const pins = $('[data-map-pins]');
    const geoItems = items.filter((item) => item.latitud && item.longitud).slice(0, 9);
    if (!map || !pins || !geoItems.length) return;
    const lats = geoItems.map((item) => Number(item.latitud));
    const lons = geoItems.map((item) => Number(item.longitud));
    const minLat = Math.min(...lats) - 0.012;
    const maxLat = Math.max(...lats) + 0.012;
    const minLon = Math.min(...lons) - 0.016;
    const maxLon = Math.max(...lons) + 0.016;
    const center = geoItems[0];
    map.src = `https://www.openstreetmap.org/export/embed.html?bbox=${minLon},${minLat},${maxLon},${maxLat}&layer=mapnik&marker=${center.latitud},${center.longitud}`;
    pins.innerHTML = geoItems.map((item) => {
      const x = ((Number(item.longitud) - minLon) / (maxLon - minLon)) * 100;
      const y = (1 - ((Number(item.latitud) - minLat) / (maxLat - minLat))) * 100;
      return `<span class="price-pin ${price(item) > price(geoItems[0]) + 0.03 ? 'is-warn' : ''}" style="left:${x}%;top:${y}%">${euro(price(item)).replace(' €/L', '')}</span>`;
    }).join('');
  }

  function renderChart(items) {
    const chart = $('[data-chart]');
    if (!chart) return;
    const values = items.length ? items.map(price).filter(Boolean).slice(0, 24) : [1.69, 1.67, 1.65, 1.64, 1.66, 1.63, 1.639];
    const max = Math.max(...values, 1);
    const min = Math.min(...values, max - 0.1);
    chart.innerHTML = values.map((value) => {
      const pct = max === min ? 50 : ((value - min) / (max - min)) * 72 + 18;
      return `<span title="${euro(value)}" style="height:${Math.max(12, pct)}%"></span>`;
    }).join('');
  }

  function stationCard(item, index, cheap) {
    const title = item.rotulo || item.nombre || item.municipio || item.provincia || 'Resultado';
    const stationUrl = item.ideess ? route('gasolinera/', { ideess: item.ideess }) : '';
    const saving = cheap && price(item) ? Math.max(0, (price(item) - cheap) * 50) : 0;
    const logo = logoFor(title);
    return `<article class="station-card">
      <span class="station-rank">${index + 1}</span>
      ${logo ? `<img class="station-logo" src="${logo}" alt="" loading="lazy" />` : `<span class="station-logo">${esc(title).slice(0, 2).toUpperCase()}</span>`}
      <div>
        <h3>${stationUrl ? `<a href="${stationUrl}">${esc(title)}</a>` : esc(title)}</h3>
        <p>${esc(item.direccion || [item.municipio, item.provincia].filter(Boolean).join(', '))}</p>
        <small>${item.distancia_km ? `${Number(item.distancia_km).toFixed(1).replace('.', ',')} km · ` : ''}${esc(item.fecha || item.fecha_precio || 'Hoy 08:45')}</small>
      </div>
      <div class="station-price">
        <strong>${euro(price(item))}</strong>
        <small>${saving ? `${money(saving)} ahorro` : 'Mejor'}</small>
      </div>
      ${item.ideess ? `<button class="fav-button" type="button" data-fav-station="${item.ideess}" data-name="${esc(title)}" aria-label="Favorito">♡</button>` : ''}
    </article>`;
  }

  function render(value, title = 'Resultados') {
    const items = rows(value).filter(Boolean);
    const shownItems = items.length ? items : demoStations;
    const values = shownItems.map(price).filter(Boolean);
    const cheap = values.length ? Math.min(...values) : 0;
    const expensive = values.length ? Math.max(...values) : 0;
    const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    const status = items.length || !apiKey ? (apiKey ? '' : label('demoNotice', 'Demo visual sin API key')) : label('emptyLabel', 'Sin datos.');

    $('[data-title]').textContent = title;
    setStatus(status);
    $('[data-results]').innerHTML = shownItems.slice(0, 5).map((item, index) => stationCard(item, index, cheap)).join('');
    $('[data-count]').textContent = shownItems.length;
    $('[data-cheap]').textContent = euro(cheap);
    $('[data-average]').textContent = euro(average);
    $('[data-expensive]').textContent = euro(expensive);
    $('[data-range]').textContent = cheap && expensive ? `+${(expensive - cheap).toFixed(3).replace('.', ',')} €/L` : '—';
    $('[data-cheap-delta]').textContent = cheap ? '−0,031 vs ayer' : '—';
    const update = $('[data-update]');
    if (update) update.textContent = shownItems[0]?.fecha || label('demoUpdate', 'Hoy 08:45');
    renderMap(shownItems);
    renderChart(shownItems);
    updateSaving();
  }

  async function loadStations() {
    const data = await api('gasolineras', {
      q: $('[name=q]').value.trim(),
      provincia: $('[name=provincia]').value.trim(),
      municipio: $('[name=municipio]').value.trim(),
      combustible: fuel(),
      order: $('[name=orden]')?.value === 'distancia' ? 'nombre' : 'precio_asc',
      limit: 80,
    });
    return render(data, 'Gasolineras');
  }

  async function loadRanking() {
    const data = await api('ranking', {
      combustible: fuel(),
      provincia: $('[name=provincia]').value.trim(),
      municipio: $('[name=municipio]').value.trim(),
      limit: 80,
    });
    return render(data, label('resultsLabel', 'Mejor precio cerca de ti'));
  }

  function updateLocationName(name) {
    const locationName = $('[data-location-name]');
    if (locationName && name) locationName.textContent = name;
  }

  function getDeviceLocation() {
    if (!navigator.geolocation) return Promise.resolve(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          name: label('deviceLocationShort', 'Mi zona'),
        }),
        () => resolve(null),
        { enableHighAccuracy: false, maximumAge: 900000, timeout: 6500 }
      );
    });
  }

  function buildIpApiUrl(base) {
    let url;
    try {
      url = new URL(base, location.origin);
    } catch {
      return null;
    }

    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (location.protocol === 'https:' && url.protocol !== 'https:') return null;

    const isIpApiEndpoint = url.hostname.includes('ip-api.com') || url.pathname.includes('ip-api.com');
    if (isIpApiEndpoint) {
      url.searchParams.set('fields', 'status,message,lat,lon,city,regionName,countryCode');
      url.searchParams.set('lang', root.dataset.ipApiLang || 'es');
    }

    return url;
  }

  function parseIpLocation(data) {
    const latitude = Number(data?.lat ?? data?.latitude);
    const longitude = Number(data?.lon ?? data?.longitude);
    const failed = (data?.status && data.status !== 'success') || data?.success === false || data?.error === true;
    if (failed || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

    return {
      latitude,
      longitude,
      name: [data.city, data.regionName ?? data.region].filter(Boolean).join(', ') || label('ipLocationShort', 'Tu zona'),
    };
  }

  async function getIpLocation() {
    for (const base of ipApiBases) {
      const url = buildIpApiUrl(base);
      if (!url) continue;

      try {
        const response = await fetch(url.toString(), { cache: 'no-store' });
        if (!response.ok) continue;

        const position = parseIpLocation(await response.json());
        if (position) return position;
      } catch {}
    }

    return null;
  }

  async function renderNearby(position) {
    const data = await api('cercanas', {
      latitud: position.latitude,
      longitud: position.longitude,
      radio_km: $('[name=radio_km]').value || 10,
      combustible: fuel(),
      order: $('[name=orden]')?.value || 'precio_asc',
      limit: 80,
    });
    updateLocationName(position.name);
    render(data, nearbyTitle());
  }

  async function loadNearby() {
    setStatus(label('locationLabel', 'Buscando ubicación…'));
    if (!apiKey) {
      render(demoStations, nearbyTitle());
      return;
    }

    const devicePosition = await getDeviceLocation();
    if (devicePosition) {
      await renderNearby(devicePosition);
      return;
    }

    setStatus(label('ipLocationLabel', 'Usando ubicación aproximada por IP…'));
    const ipPosition = await getIpLocation();
    if (ipPosition) {
      await renderNearby(ipPosition);
      return;
    }

    setStatus(label('locationErrorLabel', 'No se pudo obtener la ubicación.'));
    render(demoStations, nearbyTitle());
  }

  async function refresh() {
    setStatus(label('loadingLabel', 'Cargando…'));
    try {
      if (mode === 'home' || mode === 'nearby') await loadNearby();
      else if (mode === 'stations') await loadStations();
      else await loadRanking();
    } catch (error) {
      setStatus(error.message);
      render(demoStations, nearbyTitle());
    }
  }

  function updateSaving() {
    const liters = Number($('[name=litros]')?.value || 0);
    const diff = Number(String($('[name=diferencia]')?.value || '0').replace(',', '.'));
    const saving = $('[data-saving]');
    if (saving) saving.textContent = liters && diff ? money(liters * diff) : '—';
  }

  let suggestTimer = 0;
  $('[name=q]')?.addEventListener('input', () => {
    clearTimeout(suggestTimer);
    const q = $('[name=q]').value.trim();
    if (q.length < 2 || !apiKey) return;
    suggestTimer = setTimeout(async () => {
      try {
        const suggestions = await api('autocomplete', { q, type: 'all', limit: 15 });
        $('[data-suggestions]').innerHTML = rows(suggestions).map((item) => `<option value="${esc(item.ideess || item.municipio || item.provincia || item.label)}">${esc(item.label)}</option>`).join('');
      } catch {}
    }, 250);
  });

  root.addEventListener('submit', (event) => { event.preventDefault(); refresh(); });
  root.addEventListener('change', (event) => { if (event.target.matches('select')) refresh(); });
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
      setStatus(label('stationSavedLabel', 'Gasolinera guardada.'));
    }
  });

  setFormFromUrl();
  updateSaving();
  refresh();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register(root.dataset.sw || './sw.js').catch(() => {});
}
