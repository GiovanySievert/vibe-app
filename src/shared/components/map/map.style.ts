export const vibesMapStyle = JSON.stringify({
  version: 8,
  sources: {
    mapbox: {
      type: 'vector',
      url: 'mapbox://mapbox.mapbox-streets-v8',
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#151513' },
    },
    {
      id: 'landuse-park',
      type: 'fill',
      source: 'mapbox',
      'source-layer': 'landuse',
      filter: ['==', 'class', 'park'],
      paint: { 'fill-color': '#1A2220', 'fill-opacity': 0.4 },
    },
    {
      id: 'water',
      type: 'fill',
      source: 'mapbox',
      'source-layer': 'water',
      paint: { 'fill-color': '#1A1E20', 'fill-opacity': 0.5 },
    },
    {
      id: 'building',
      type: 'fill',
      source: 'mapbox',
      'source-layer': 'building',
      paint: { 'fill-color': '#1E1E1B', 'fill-opacity': 0.5 },
    },
    {
      id: 'road-secondary',
      type: 'line',
      source: 'mapbox',
      'source-layer': 'road',
      filter: ['in', 'class', 'service', 'street'],
      paint: { 'line-color': '#3A3632', 'line-width': 1, 'line-opacity': 0.7 },
    },
    {
      id: 'road-primary',
      type: 'line',
      source: 'mapbox',
      'source-layer': 'road',
      filter: ['in', 'class', 'primary', 'secondary'],
      paint: { 'line-color': '#4A4540', 'line-width': 1.5, 'line-opacity': 0.8 },
    },
    {
      id: 'road-motorway',
      type: 'line',
      source: 'mapbox',
      'source-layer': 'road',
      filter: ['in', 'class', 'motorway', 'trunk'],
      paint: { 'line-color': '#55524D', 'line-width': 2, 'line-opacity': 0.85 },
    },
  ],
})
