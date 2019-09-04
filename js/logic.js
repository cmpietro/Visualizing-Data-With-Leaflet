//Visualizing DATA with leaflet

//Store the API endpoint in queryUrl   (?)
// var queryUrl = 'https://earthquake.usgs.gove/earthquakes/feed/v1.o/summary/all_week.geojson'

//Get the request to the query URL
// d3.json(queryUrl, function(data) {
//    createFeatures(data.features);
//    console.log(data.features)
//});
//function createFeatures(earthquakeData) {
    //Define the function we want to run for each feature in the array
    //give each feature a poppup describing place and time
    //function onEachFeature(feature, layer) {

  //  }
//}
//Selectable backgrounds for the map layers:
//Gray Map Background
var graymap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?"+
"access_token=pk.eyJ1IjoiY21waWV0cm8iLCJhIjoiY2p6cG05dHpvMDB4NTNkcDkwaGdrNjJrMyJ9.bQp9QOuCgEukrvm63S4iHQ");

//Satellite Background
var satellitemap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1IjoiY21waWV0cm8iLCJhIjoiY2p6cG05dHpvMDB4NTNkcDkwaGdrNjJrMyJ9.bQp9QOuCgEukrvm63S4iHQ" );

//Outdoors Background
var outdoors_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1IjoiY21waWV0cm8iLCJhIjoiY2p6cG05dHpvMDB4NTNkcDkwaGdrNjJrMyJ9.bQp9QOuCgEukrvm63S4iHQ"  );

//Map object to an array of layers
var map = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 5, 
    layers: [graymap_background, satellitemap_background, outdoors_background]
});

//adding the "graymap" tile layer to the map
graymap_background.addTo(map);

//layers for the different data sets, earthquakes and tectonic plates(bonus)
var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

//base layers for the map
var baseMaps = {
    Satellite: satellitemap_background,
    Grayscale: graymap_background,
    Outdoors: outdoors_background
};

//Overlays
var overlayMaps = {
    "Tectonic Plates": tectonicplates,
    "Earthquakes": earthquakes
};

// control which layers are visible using L
L
    .control
    .layers(baseMaps, overlayMaps)
    .addTo(map);

// get the earthquake geoJson data 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(data) {

    function styleInfo(feature) {
        return {
            opacity: 1, 
            fillOpacity: 1, 
            fillColor: getColor(feature.properties.magnitude),
            color: "#000000",
            radius: getRadius(feature.properties.magnitude),
            stroke: true,
            weight: 0.5
        };
    }

//define the colors of the marker based on the Mag of the eqrthquake
function getColor(magnitude) {
    switch(true) {
        case magnitude > 5:
            return "#ea2c2c";
        case magnitude > 4:
            return "#ea822c";
        case magnitude > 3:
            return "#ee9c00";
        case magnitude > 2:
            return "#eecc900";
        case magnitude > 1:
            return "#d43300";
        default: 
            return "#98ee00";
    }
}

// define the radius of the earthquake marker based on magnitude
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 3;
}

//adding a geoJson layer for the map
L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
    },

    styleMedia: styleInfo,
    onEachFeature: function(feature, layer) {
        layer.bindPopup('Magnitude: ' + feature.properties.mag + '<br>Location:  ' + feature.properties.place);
    }
}).addTo(earthquakes);

earthquakes.addTo(map);

//legend
var legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function() {
    var div = L.DomUtil
    .create('div', 'info legend');

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
        '#98ee00',
        '#d43300',
        '#eecc00',
        '#ee9c00',
        '#ea822c',
        '#ea2c2c'
    ];
    
    for (var i = 0; i <grades.length; i++) {
        div.innerHTML += '<i style="background: ' +  colors[i] + '"></i> ' + 
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;

};

legend.addTo(map);

//retrieve tectonic plate geoJson data
d3.json('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json', 
    function(platedata) {

        L.geoJson(platedata, {
            color: 'orange',
            weight: 2
        })
        .addTo(tectonicplates);

        tectonicplates.addTo(map);
    });

});


