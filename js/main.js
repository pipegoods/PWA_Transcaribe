var listaMarcadoresEstaciones = []; //Arreglo lista de los marcadores de las estaciones
function initMap() {
    var infoWindow; //Ventana de informacion

    // Se inicializa el mapa con un zoom y un centro predeterminado
    var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 10.408975, lng: -75.508813 },
    disableDefaultUI: true // Se quitan los botones del mapa

  });
  infoWindow = new google.maps.InfoWindow; // Se inicializa la ventana de informacion

  //limita el zoom del scroll para no salir de la ciudad
  var opt = { minZoom: 13.75, maxZoom: 22 };
  map.setOptions(opt);

  // coordenada limite suroeste
  var so = new google.maps.LatLng(10.322967, -75.585290)
  //coordenada limite noreste
  var ne = new google.maps.LatLng(10.462836, -75.451327)

  //bouns para vizualizar solo Cartagena
  var strictBounds = new google.maps.LatLngBounds(so,ne);

  // EventListener evento de desplazamiento en el mapa
  google.maps.event.addListener(map, 'dragend', function () {
    if (strictBounds.contains(map.getCenter())) {
      return;
    } 
    var c = map.getCenter(),
    x = c.lng(),
    y = c.lat(),
    maxX = strictBounds.getNorthEast().lng(),
    maxY = strictBounds.getNorthEast().lat(),
    minX = strictBounds.getSouthWest().lng(),
    minY = strictBounds.getSouthWest().lat();

    if (x < minX) {
      x = minX;
    } if (x > maxX) {
      x = maxX;
    } if (y < minY) {
      y = minY;
    } if (y > maxY) {
      y = maxY;
    } 
    map.setCenter(new google.maps.LatLng(y, x));
 });

  // Se hace un recorrido a la informacion del json de las estaciones
  for (var estaciones in estaciones_json){ 
    if (estaciones_json.hasOwnProperty(estaciones)) {
      var marker = new google.maps.Marker({ // se crea un marcador por estacion
        draggable: false, // No permite  que el marcador pueda moverse
        animation: google.maps.Animation.DROP,
        position: {lat: estaciones_json[estaciones].lgn, lng: estaciones_json[estaciones].lat }, // Se obtiene las latitudes y longitudes de las estaciones en el json
        icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png' // Esta es un marcador naranja que nos proporciona google
      });
      listaMarcadoresEstaciones.push(marker);
      // se crea el mensaje de la info de los marcadores
      var message = buildInfoWindowMessage(estaciones_json[estaciones])
      //anexa informacion a marcador
      addInfoWindow(marker, message);
    }
  }
  
  // Aqui se recorre la lista de los marcadores y se colocan en el mapa
  listaMarcadoresEstaciones.forEach((marcador) => {
    marcador.setMap(map);
  });

  // Funcion para tomar la pocision en tiempo real del usuario
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
      var polygon = createPolygon();
      var posInCtg = isMarkerInPolygon(pos, polygon)
      if(posInCtg) {
        infoWindow.setPosition(pos);
        infoWindow.setContent('Usted se encuentra aqui');
        infoWindow.open(map);
        map.setCenter(pos);
        map.setZoom(15);
      } else{
        //reemplazar con una notificacion mas agradable a la vista
        alert("usted no se encuentra en cartagena :v");
      }
      
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }
  // Final funcion


}

//funcion en la que se construyen las cadenas que contienen las rutas
function buildRutasInforMessage(estacion, cadSitio){ 
  var varSitio = cadSitio + ": "; 
  try {
    if(estacion[cadSitio].length > 0){
      estacion[cadSitio].forEach((sitio) => {
        varSitio = varSitio+ " " + sitio + ",";
      });
      varSitio = varSitio.substring(0,varSitio.length-1);
      varSitio = varSitio + '<br>';
    } else {
      varSitio = varSitio + "Ninguno" + '<br>';
    }  
    return varSitio;
  } catch (TypeError) {
    varSitio = varSitio + "Ninguno" + '<br>';
    return varSitio;
  }
}

// se crea el mensaje de la info de los marcadores
function buildInfoWindowMessage(estacion) {
  var estacion_name = '<b>' + estacion.name + '</b>' + '<br>';
  var troncales = buildRutasInforMessage(estacion, "Troncales");
  var alimentadores =  buildRutasInforMessage(estacion, "Alimentadores");
  var preTroncales = buildRutasInforMessage(estacion, "PreTroncales");
  buildRutasInforMessage(estacion, troncales);
  return estacion_name + troncales + alimentadores + preTroncales;
}

// añade el window info de las estaciones a los marcadores
function addInfoWindow(marker, message) {

  var infoWindow = new google.maps.InfoWindow({
      content: message
  });

  google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open(map, marker);
  });
}

//crea poligono para el area de Cartagena
function createPolygon() {
  var frontierCoords = [
    new google.maps.LatLng(10.45765,-75.51169), 
    new google.maps.LatLng(10.42439,-75.55666), 
    new google.maps.LatLng(10.4149,-75.55229), 
    new google.maps.LatLng(10.4088,-75.55336), 
    new google.maps.LatLng(10.40355,-75.55784), 
    new google.maps.LatLng(10.39717,-75.56611), 
    new google.maps.LatLng(10.39625,-75.5664), 
    new google.maps.LatLng(10.39593,-75.56464), 
    new google.maps.LatLng(10.39389,-75.56275), 
    new google.maps.LatLng(10.39254,-75.56105), 
    new google.maps.LatLng(10.39187,-75.55896), 
    new google.maps.LatLng(10.39011,-75.54494), 
    new google.maps.LatLng(10.381,-75.52385), 
    new google.maps.LatLng(10.35187,-75.51554), 
    new google.maps.LatLng(10.34305,-75.50915), 
    new google.maps.LatLng(10.34202,-75.48493), 
    new google.maps.LatLng(10.36919,-75.45333), 
    new google.maps.LatLng(10.39034,-75.44771), 
    new google.maps.LatLng(10.40083,-75.44507), 
    new google.maps.LatLng(10.40878,-75.44741), 
    new google.maps.LatLng(10.42528,-75.46049), 
    new google.maps.LatLng(10.42076,-75.488)
  ];

  var area = new google.maps.Polygon({
    paths: frontierCoords,
  });
  return area;
}

//evalua si el usuario esta dentro de Cartagena
function isMarkerInPolygon(marker, polygon){
  var pos = google.maps.geometry.poly.containsLocation(marker, polygon) ? true : false;
  return pos;
}