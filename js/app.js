
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
      isActiveC: false
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
      }
    }
  })