
Vue.component('info', {
    props: ['informacion'],
    template: `
    <ul class="collection">
      <li class="collection-item">{{ informacion.nombre }}</li>
      <li class="collection-item">{{ informacion.troncales }}</li>
      <li class="collection-item">{{ informacion.preTroncales }}</li>
      <li class="collection-item">{{ informacion.Alimentadores }}</li>
    </ul>`
  })
  
  //aqui se agregara el codigo para la ventana flotante usando vue
  var vf = new Vue({
    el: '#vf',
    data: {
      //se usan booleanos para mostrar o quitar los marcadores del mapa, si estan en true al llamar a la funcion se eliminaran y pasaran su valor a false, y si estan en false ocurrira lo contrario
      mostrarEstacion: true,
      mostrarParaderos: true,
      mostrarPuntoRecarga: true,
      bloqueInformacion: false,//este es el mensaje que se mostrara en el panel de informacion, cada vez que se cambie su valor se modificara en el panel de informacion
      informacion: {
        nombre:'',
        troncales:'',
        preTroncales:'',
        alimentadores:''
      },
      isActiveT: false,
      isActiveP: false,
      isActiveA: false,
      isActiveC: false,
      listaPreToncales: [],
      listaTroncales: [],
      listaAlimentadores: [],
      listaCircular: []
    },
    methods: {
      activarT: function(event){
        if(this.isActiveT){
          this.isActiveT=false;
        }
        else{
          this.isActiveT = true;
          this.isActiveP = false;
          this.isActiveA = false;
          this.isActiveC = false;
        }
      },
      activarP: function(event){
        if(this.isActiveP){
          this.isActiveP=false;
        }
        else{
          this.isActiveT = false;
          this.isActiveP = true;
          this.isActiveA = false;
          this.isActiveC = false;
        }
      },
      activarA: function(event){
        if(this.isActiveA){
          this.isActiveA=false;
        }
        else{
          this.isActiveT = false;
          this.isActiveP = false;
          this.isActiveA = true;
          this.isActiveC = false;
        }
      },
      activarC: function(event){
        if(this.isActiveC){
          this.isActiveC=false;
        }
        else{
          this.isActiveT = false;
          this.isActiveP = false;
          this.isActiveA = false;
          this.isActiveC = true;
        }
      },
      mostrarE: function(event){//se ejecuta cuando se preciona el icono de la estacion
        if(this.mostrarEstacion){
          listaMarcadoresEstaciones.forEach((marcador) => {
          marcador.setMap(null);
        });
        this.mostrarEstacion = false;
        }
        else{
          listaMarcadoresEstaciones.forEach((marcador) => {
            marcador.setMap(map);
          });
          this.mostrarEstacion = true;
        }
      },
      mostrarP: function(event){//se ejecuta cuando se preciona el icono de los paraderos
        if(this.mostrarParaderos){
          listaMarcadoresparaderos.forEach((marcador) => {
          marcador.setMap(null);
        });
        this.mostrarParaderos = false;
        }
        else{
          listaMarcadoresparaderos.forEach((marcador) => {
            marcador.setMap(map);
          });
          this.mostrarParaderos = true;
        }
      },
      mostrarPR: function(event){//se ejecuta cuando se preciona el icono de los puntos de recarga
        if(this.mostrarPuntoRecarga){
          listaMarcadorespuntoRecarga.forEach((marcador) => {
          marcador.setMap(null);
        });
        this.mostrarPuntoRecarga = false;
        }
        else{
          listaMarcadorespuntoRecarga.forEach((marcador) => {
            marcador.setMap(map);
          });
          this.mostrarPuntoRecarga = true;
        }
      },
      desactivarMarcadores: function(){//se ejecuta cuando se preciona el icono de los puntos de recarga
         listaMarcadoresEstaciones.forEach((marcador) => {
           marcador.setMap(null);
         });
         listaMarcadoresparaderos.forEach((marcador) => {
          marcador.setMap(null);
        });
        listaMarcadorespuntoRecarga.forEach((marcador) => {
          marcador.setMap(null);
        });
        listaMarcadoresRuta.forEach((marcador) => {
          marcador.setMap(null);
        });
        
      },
      mostrarRutaRuta: function(ruta){
        
        this.desactivarMarcadores();
        listaMarcadoresRuta = [];
        ruta.paraderosIDA.forEach((paraderos) => {
           var marker = new google.maps.Marker({ // se crea un marcador por estacion
            draggable: false, // No permite  que el marcador pueda moverse
            animation: google.maps.Animation.DROP,
            position: {lat: paraderos.lat, lng:paraderos.lng }, // Se obtiene las latitudes y longitudes de las estaciones en el json
            icon: iconos.marcadorParadero // Esta es un marcador naranja que nos proporciona google
          });
          listaMarcadoresRuta.push(marker);
          //agrega infowindow con nombre del paradero
          addInfoWindowv1_29(marker, paraderos.nombre);

        });

        ruta.paraderosRegreso.forEach((paraderos) => {
          var marker = new google.maps.Marker({ // se crea un marcador por estacion
           draggable: false, // No permite  que el marcador pueda moverse
           animation: google.maps.Animation.DROP,
           position: {lat: paraderos.lat, lng:paraderos.lng }, // Se obtiene las latitudes y longitudes de las estaciones en el json
           icon: iconos.marcadorParaderoR // Esta es un marcador naranja que nos proporciona google
         });
         listaMarcadoresRuta.push(marker);
         addInfoWindowv1_29(marker, paraderos.nombre);
       });

       ruta.estaciones.forEach((paraderos) => {
        var marker = new google.maps.Marker({ // se crea un marcador por estacion
         draggable: false, // No permite  que el marcador pueda moverse
         animation: google.maps.Animation.DROP,
         position: {lat: paraderos.lat, lng:paraderos.lng }, // Se obtiene las latitudes y longitudes de las estaciones en el json
         icon: iconos.marcadorEstacion // Esta es un marcador naranja que nos proporciona google
       });
       listaMarcadoresRuta.push(marker);
       console.log("nombres? " + paraderos.nombre + " aprouval")
       console.log(estaciones_json[paraderos.nombre])
       
       // se crea el mensaje de la info de los marcadores
       var message = buildInfoWindowMessage(estaciones_json[paraderos.nombre])
       //anexa informacion a marcador
       addInfoWindow(marker, message, estaciones_json[paraderos.nombre]);
       
     });

        listaMarcadoresRuta.forEach((marcador) => {
          marcador.setMap(map);
        });
       
      }
    },
    mounted: function(){
        rutas_json.forEach((ruta) => {
          if(ruta.tipo == "PreTroncal"){
            this.listaPreToncales.push(ruta);

            
          }
          else if(ruta.tipo == "Alimentador"){
            this.listaAlimentadores.push(ruta);
            
          }

          else if(ruta.tipo == "Troncal"){
            this.listaTroncales.push(ruta);
            
          }

          else if(ruta.tipo == "Circular"){
            this.listaCircular.push(ruta);
            
          } 
          else {
            console.log("Esa ruta no tiene tipo");
            
          }
        });
        
    }
  })