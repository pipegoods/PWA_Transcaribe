console.log(mian);
var listaMarcadores = [];
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 10.408975, lng: -75.508813 }
  });
  var image = 'icon/32x20.png';

  for (var clave in mian){
    // Controlando que json realmente tenga esa propiedad
    if (mian.hasOwnProperty(clave)) {
      console.log(mian[clave]);
      
      // Mostrando en pantalla la clave junto a su valor
      console.log ("La clave es " + clave+ " y el valor es " + mian[clave].lgn);
      var marker = new google.maps.Marker({
        draggable: false,
        icon: image,
        animation: google.maps.Animation.DROP,
        position: {lat: mian[clave].lgn, lng: mian[clave].lat }
      });
      listaMarcadores.push(marker);
      // se crea el mensaje de la info de los marcadores
      var message = buildInfoWindowMessage(mian[clave], )
      addInfoWindow(marker, message);
    }
  }
  
  listaMarcadores.forEach((marcador) => {
    marcador.setMap(map);
  });

  google.maps.event.addListener(map, 'zoom_changed',function() {
    console.log(map.getZoom());
  });

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