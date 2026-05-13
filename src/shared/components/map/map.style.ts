export const vibesMapStyle = JSON.stringify({
  version: 8,
  glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
  sources: {
    mapbox: {
      type: 'vector',
      url: 'mapbox://mapbox.mapbox-streets-v8'
    }
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#151513' }
    },
    {
      id: 'landuse-park',
      type: 'fill',
      source: 'mapbox',
      'source-layer': 'landuse',
      filter: ['==', 'class', 'park'],
      paint: { 'fill-color': '#1A2220', 'fill-opacity': 0.4 }
    },
    {
      id: 'water',
      type: 'fill',
      source: 'mapbox',
      'source-layer': 'water',
      paint: { 'fill-color': '#1A1E20', 'fill-opacity': 0.5 }
    },
    {
      id: 'building',
      type: 'fill',
      source: 'mapbox',
      'source-layer': 'building',
      paint: { 'fill-color': '#1E1E1B', 'fill-opacity': 0.5 }
    },
    {
      id: 'road-minor',
      type: 'line',
      source: 'mapbox',
      'source-layer': 'road',
      minzoom: 13,
      filter: ['in', 'class', 'service', 'track', 'path', 'pedestrian'],
      paint: { 'line-color': '#3A3632', 'line-width': 1, 'line-opacity': 0.7 }
    },
    {
      id: 'road-street',
      type: 'line',
      source: 'mapbox',
      'source-layer': 'road',
      minzoom: 12,
      filter: ['in', 'class', 'street', 'street_limited'],
      paint: {
        'line-color': '#3A3632',
        'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.5, 14, 1.5, 18, 6],
        'line-opacity': 0.55
      }
    },
    {
      id: 'road-tertiary',
      type: 'line',
      source: 'mapbox',
      'source-layer': 'road',
      filter: ['==', 'class', 'tertiary'],
      paint: {
        'line-color': '#3A3632',
        'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 14, 2, 18, 8],
        'line-opacity': 0.6
      }
    },
    {
      id: 'road-primary',
      type: 'line',
      source: 'mapbox',
      'source-layer': 'road',
      filter: ['in', 'class', 'primary', 'secondary'],
      paint: {
        'line-color': '#4A4540',
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 14, 2.5, 18, 10],
        'line-opacity': 0.65
      }
    },
    {
      id: 'road-motorway',
      type: 'line',
      source: 'mapbox',
      'source-layer': 'road',
      filter: ['in', 'class', 'motorway', 'trunk'],
      paint: { 'line-color': '#4A4540', 'line-width': 2, 'line-opacity': 0.7 }
    },
    {
      id: 'road-label',
      type: 'symbol',
      source: 'mapbox',
      'source-layer': 'road',
      minzoom: 12,
      filter: ['all', ['has', 'name'], ['in', 'class', 'motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'street', 'street_limited', 'service', 'pedestrian']],
      layout: {
        'symbol-placement': 'line',
        'text-field': ['get', 'name'],
        'text-size': 11,
        'text-letter-spacing': 0.05,
        'text-max-angle': 30,
        'text-padding': 2
      },
      paint: {
        'text-color': '#8a8680',
        'text-halo-color': '#151513',
        'text-halo-width': 1.2,
        'text-halo-blur': 0.5
      }
    }
  ]
})
