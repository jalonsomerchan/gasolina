# Gasolina al dia

PWA hecha con Astro para consultar precios de combustible en Espana usando la API `https://alon.one/api/gasolina2/`.

## Funcionalidades

- Portada con favoritos guardados y ranking si no hay favoritos.
- Buscador con autocompletado de provincia, municipio y gasolinera.
- Busqueda de gasolineras cercanas mediante geolocalizacion.
- Paginas para gasolineras, provincias, municipios, ficha de gasolinera, cercanas, ranking, rotulos, comparador, favoritos, estadisticas y utilidades.
- Mapas embebidos de OpenStreetMap.
- Graficas ligeras sin dependencias externas.
- Tablas de precios y resumen de valores maximos/minimos.
- Favoritos de gasolineras y zonas guardados en `localStorage`.

## Rutas principales

| Ruta | Uso |
| --- | --- |
| `/` | Inicio con favoritos o ranking |
| `/gasolineras/` | Busqueda general de estaciones |
| `/provincias/` | Resumen por provincia |
| `/municipios/?provincia=Caceres` | Municipios filtrados por provincia |
| `/gasolinera/?ideess=123` | Ficha de gasolinera |
| `/cercanas/` | Gasolineras cercanas al usuario |
| `/ranking/?combustible=gasolina_95` | Ranking de precios |
| `/rotulos/` | Estadisticas por marca/rotulo |
| `/comparador/?ideess=1,2,3` | Comparativa entre gasolineras |
| `/favoritos/` | Favoritos guardados |
| `/estadisticas/` | Estadisticas y tendencia |
| `/utilidades/` | Calculadora de ahorro |

## Configuracion de API

La app estatica necesita una variable publica de build:

```sh
PUBLIC_GASOLINA_API_KEY=pon_aqui_la_clave
```

En GitHub se puede anadir como secret o variable del repositorio con el nombre `PUBLIC_GASOLINA_API_KEY` para que este disponible durante el build.

## Requisitos

Usa Node 22. El repositorio incluye `.nvmrc`.

```sh
nvm use
npm ci
```

## Comandos

| Comando | Accion |
| --- | --- |
| `npm run dev` | Arranca el servidor local de Astro |
| `npm run build` | Genera la web estatica en `dist/` |
| `npm run preview` | Previsualiza el build localmente |
| `npm test` | Ejecuta tests smoke basicos |
| `npm run format` | Formatea CSS, JS, JSON, Markdown, TS y YAML |
| `npm run format:check` | Comprueba formato |
| `npm run clean` | Borra `dist` y `.astro` |

## Documentacion para agentes IA

Antes de modificar el proyecto, una IA debe leer `agents.md` y las guias de `docs/` que apliquen.
