
mapboxgl.accessToken = 'pk.eyJ1IjoiYWJlYXBpIiwiYSI6ImNqazZpbHY5OTBxOWYzcHAyMGt3YXYwaWMifQ.AGJ6PQ8o8VzvxT6sGOOXYw';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',

    // Centers map about Manhattan from 
    // pitch/bearing [80, -17.6] perspective
    center: [-73.9840, 40.7549], 
    maxZoom: 16,
    minZoom: 12,
    pitch: 80,
    bearing: -17.6
});

// 'Building' layter with data on building-height from OpenStreetMap
map.on('load', function() {
    // Inserts layer beneath any symbol layer.
    var layers = map.getStyle().layers;

    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',

            // Interpolate expression to add a smooth transition effect to the
            // buildings as the user zooms in (see: MapBox 3D Building API) 
            'fill-extrusion-height': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "min_height"]
            ],
            'fill-extrusion-opacity': 0.6
        }
    }, labelLayerId);
});
