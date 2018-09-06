// Save our API urls 
var usgsUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

d3.json(usgsUrl, function(error, data) {
  if(error){
    console.log("Error reading USGS earthquake data: ", error);
    throw error;
  }
  d3.json(tectonicUrl, function(error, platesData) {
    if(error){
      console.log("Error reading tectonic plates data: ", error);
      throw error;
    }
    createFeatures(data.features, platesData.features);
  });
});

// Function to set colors for each bin of magnitude
function setColor(d) {
  return d > 5 ? 'red':
          d > 4 ? 'coral':
          d > 3 ? 'orange':
          d > 2 ? 'gold':
          d > 1 ? 'yellowgreen':
          d > 0 ? 'lightgreen':
                  'lawngreen';
}

function createFeatures(earthquakeData, platesData) {
  function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
                       "</h3> <hr> <p>Time: " + new Date(feature.properties.time) + 
                       "<br> Magnitude: " + feature.properties.mag +"</p>");
    }
  
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
                              radius: feature.properties.mag*4,
                              fillColor: setColor(feature.properties.mag),
                              color: "black",
                              weight: 0.3,
                              opacity: 0.75,
                              fillOpacity: 0.8
                            });
    }
  });

  var myStyle = {
    "color": "#FFA500",
    "weight": 3,
    "opacity": 0.65,
    "fill": false
  };

  var plates = L.geoJSON(platesData, {
    style: myStyle
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes, plates);
}

// Function to create map with layers
function createMap(earthquakes,plates) {

  // Define base map layers
  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-satellite",
    accessToken: API_KEY
  });

  var grayscaleMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.high-contrast",
    accessToken: API_KEY
  });

  var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  // Define baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satelliteMap,
    "Grayscale": grayscaleMap,
    "Outdoors": outdoorsMap
  };

  // Create overlayMaps object to hold our overlay layers
  var overlayMaps = {
    "Fault Lines": plates,
    "Earthquakes": earthquakes    
  };

  // Create our map, giving it the satellite map, earthquakes and plates layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [satelliteMap, plates, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps ,overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + setColor(magnitudes[i] + 1) + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }

    return div;
  };
  legend.addTo(myMap);
}


