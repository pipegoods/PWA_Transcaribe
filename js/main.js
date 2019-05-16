var listaMarcadoresEstaciones = []; //Arreglo lista de los marcadores de las estaciones
var listaMarcadoresparaderos = [];
var listaMarcadorespuntoRecarga = [];
var listaMarcadoresRuta = [];
var map;
var iconos = {
  iconoEstacion: 'icon/100x64-1(2).png',
  iconoParadero: 'icon/100x64-3(2).png',
  iconoPuntoRecarga: 'icon/100x64-2(2).png',
  marcadorEstacion: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
  marcadorParadero: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  marcadorPuntoRecarga: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  marcadorParaderoR: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
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
function addInfoWindow(marker, message, estacion) {

  var infoWindow = new google.maps.InfoWindow({
      content: message
  });

  google.maps.event.addListener(marker, 'click', function () {
      //infoWindow.open(map, marker);
      vf.bloqueInformacion = true;
      vf.informacion.nombre = estacion.name;
      vf.informacion.troncales = buildRutasInfo(estacion, "Troncales")
      vf.informacion.preTroncales = buildRutasInfo(estacion, "PreTroncales")
      vf.informacion.Alimentadores = buildRutasInfo(estacion, "Alimentadores")
      
  });
}

function buildRutasInfo(estacion, cadSitio){ 
  var varSitio = cadSitio + ": "; 
  try {
    if(estacion[cadSitio].length > 0){
      estacion[cadSitio].forEach((sitio) => {
        varSitio = varSitio+ " " + sitio + ",";
      });
      varSitio = varSitio.substring(0,varSitio.length-1);
    } else {
      varSitio = varSitio + "Ninguno";
    }  
    return varSitio;
  } catch (TypeError) {
    varSitio = varSitio + "Ninguno";
    return varSitio;
  }
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

function marcarEstaciones(map){
  // Se hace un recorrido a la informacion del json de las estaciones
  for (var estaciones in estaciones_json){ 
    if (estaciones_json.hasOwnProperty(estaciones)) {
      var marker = new google.maps.Marker({ // se crea un marcador por estacion
        draggable: false, // No permite  que el marcador pueda moverse
        animation: google.maps.Animation.DROP,
        position: {lat: estaciones_json[estaciones].lat, lng: estaciones_json[estaciones].lng }, // Se obtiene las latitudes y longitudes de las estaciones en el json
        icon: this.iconos.marcadorEstacion // Esta es un marcador naranja que nos proporciona google
      });
      listaMarcadoresEstaciones.push(marker);
      // se crea el mensaje de la info de los marcadores
      var message = buildInfoWindowMessage(estaciones_json[estaciones])
      //anexa informacion a marcador
      addInfoWindow(marker, message, estaciones_json[estaciones]);
    }
  }
  
  // Aqui se recorre la lista de los marcadores y se colocan en el mapa
  listaMarcadoresEstaciones.forEach((marcador) => {
    marcador.setMap(map);
  });
}

function marcarParaderos(map){
  // Se hace un recorrido a la informacion del json de las estaciones
  for (var paraderos in paraderos_json){ 
    if (paraderos_json.hasOwnProperty(paraderos)) {
      var marker = new google.maps.Marker({ // se crea un marcador por estacion
        draggable: false, // No permite  que el marcador pueda moverse
        animation: google.maps.Animation.DROP,
        position: {lat: paraderos_json[paraderos].lat, lng: paraderos_json[paraderos].lng }, // Se obtiene las latitudes y longitudes de las estaciones en el json
        icon: this.iconos.marcadorParadero // Esta es un marcador naranja que nos proporciona google
      });
      listaMarcadoresparaderos.push(marker);
    }
  }
  
  // Aqui se recorre la lista de los marcadores y se colocan en el mapa
  listaMarcadoresparaderos.forEach((marcador) => {
    marcador.setMap(map);
  });
}

function marcarpuntoRecarga(map){
  // Se hace un recorrido a la informacion del json de las estaciones
  for (var puntoRecarga in puntoRecarga_json){ 
    if (puntoRecarga_json.hasOwnProperty(puntoRecarga)) {
      var marker = new google.maps.Marker({ // se crea un marcador por estacion
        draggable: false, // No permite  que el marcador pueda moverse
        animation: google.maps.Animation.DROP,
        position: {lat: puntoRecarga_json[puntoRecarga].lat, lng:puntoRecarga_json[puntoRecarga].lng }, // Se obtiene las latitudes y longitudes de las estaciones en el json
        icon: this.iconos.marcadorPuntoRecarga // Esta es un marcador naranja que nos proporciona google
      });
      listaMarcadorespuntoRecarga.push(marker);
    }
  }
  
  // Aqui se recorre la lista de los marcadores y se colocan en el mapa
  listaMarcadorespuntoRecarga.forEach((marcador) => {
    marcador.setMap(map);
  });
}
