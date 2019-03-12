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

  // Se hace un recorrido a la informacion del json de las estaciones
  for (var estaciones in estaciones_json){ 
    if (estaciones_json.hasOwnProperty(estaciones)) {
      var marker = new google.maps.Marker({ // se crea un marcador por estacion
        draggable: false, // No permite  que el marcador pueda moverse
        animation: google.maps.Animation.DROP,
        position: {lat: estaciones_json[estaciones].lgn, lng: estaciones_json[estaciones].lat }, // Se obtiene las latitudes y longitudes de las estaciones en el json
        icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png' // Esta es un marcador naranja que nos proporciona google
      });
      listaMarcadores.push(marker);
      // se crea el mensaje de la info de los marcadores
      var message = buildInfoWindowMessage(mian[clave], )
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
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Usted se encuentra aqui');
      infoWindow.open(map);
      map.setCenter(pos);
      map.setZoom(15);
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

// se crea el mensaje de la info de los marcadores
function buildInfoWindowMessage(estacion) {
  var message = estacion.name;
  return message;
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