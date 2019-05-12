function initMap() {
    var infoWindow; //Ventana de informacion

    // Se inicializa el mapa con un zoom y un centro predeterminado
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 10.408975, lng: -75.508813 },
    disableDefaultUI: true // Se quitan los botones del mapa

  });
  infoWindow = new google.maps.InfoWindow; // Se inicializa la ventana de informacion

  //limita el zoom del scroll para no salir de la ciudad
  var opt = { minZoom: 13.75, maxZoom: 22 };
  map.setOptions(opt);

  // coordenada limite suroeste
  var so = new google.maps.LatLng(10.267611, -75.578984)
  //coordenada limite noreste
  var ne = new google.maps.LatLng(10.537838, -75.390558)

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

 marcarEstaciones(map);
 marcarParaderos(map);
 marcarpuntoRecarga(map);

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