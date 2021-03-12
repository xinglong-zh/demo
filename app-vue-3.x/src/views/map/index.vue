<template>
  <div class="container">
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import * as L from "leaflet";
import * as topojson from "topojson";
// import '@/assets/js/bundle';
//extend Leaflet to create a GeoJSON layer from a TopoJSON file
L.TopoJSON = L.GeoJSON.extend({
  addData: function (data) {
    var geojson, key;
    if (data.type === "Topology") {
      for (key in data.objects) {
        // eslint-disable-next-line no-prototype-builtins
        if (data.objects.hasOwnProperty(key)) {
          geojson = topojson.feature(data, data.objects[key]);
          L.GeoJSON.prototype.addData.call(this, geojson);
        }
      }
      return this;
    }
    L.GeoJSON.prototype.addData.call(this, data);
    return this;
  },
});
L.topoJson = function (data, options) {
  return new L.TopoJSON(data, options);
};

// 自定义tile
L.GridLayer.DebugCoords = L.GridLayer.extend({
  createTile: function (coords, done) {
    var tile = document.createElement("div");
    tile.innerHTML = [coords.x, coords.y, coords.z].join(", ");
    tile.style.outline = "1px solid red";

    setTimeout(function () {
      done(null, tile); // Syntax is 'done(error, tile)'
    }, 500 + Math.random() * 1500);

    return tile;
  },
});
L.gridLayer.debugCoords = function (opts) {
  return new L.GridLayer.DebugCoords(opts);
};

L.Circle.Demo = L.Circle.extend({
  getEvens:function(){
    var events = L.Circle.prototype.getEvents.call(this);
    events.moveend = this.redraw 
  }
})

L.circle.demo = function(opts){
  return new L.Circle.Demo(opts);
}

// import {canvasLayer} from '@/assets/js/contour/L.CanvasLayer'

// import ContourLayerExt from '@/assets/js/contour/ContourLayerExt' 



// import Axios from 'axios';

import BinLayer from '@/assets/js/BinLayer'
import { Meta1 } from '@/assets/js/gl-shaded/Catalog';

export default {
  name: "demoMap",
  data() {
    return {
      geojson: null,
      map: null,
    };
  },
  props: {
    option_map: {
      type: Object,
      default: () => ({
        zoomDelta: 0.5,
        zoom: 2,
        attributionControl: false,
        worldCopyJump:false,
      }),
    },
  },
  methods: {
    async initMap() {
      let map = L.map("map",{worldCopyJump:false}).setView([51.505, -0.09], 3);
      this.map = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)

      L.gridLayer.debugCoords().addTo(map);

      // new ContourLayerExt({url:'./contour.json'}).addTo(map);
      // 探索WelGL 差值问题
      let meta6  = new Meta1('http://10.1.64.146/mdfs/v1.1/','GRAPES_GFS/RAIN24_UNCLIPPED','21030808.027');
      let meta2 = new Meta1('http://10.1.64.146/mdfs/v1.1/','GRAPES_GFS/RAIN03_UNCLIPPED','21030808.006');
      let meta3 = new Meta1('http://10.1.64.146/mdfs/v1.1/','GRAPES_GFS/RAIN03_UNCLIPPED','21030808.012');
      let meta4 = new Meta1('http://10.1.64.146/mdfs/v1.1/','GRAPES_GFS/RAIN03_UNCLIPPED','21030808.018');
      let meta5 = new Meta1('http://10.1.64.146/mdfs/v1.1/','GRAPES_GFS/RAIN03_UNCLIPPED','21030808.024');
      let layer = new BinLayer({'color': 'rain',meta:meta2,aminate:true});
      layer.addTo(map);
      setTimeout(()=>layer.setMeta(meta3),1000);
      setTimeout(()=>layer.setMeta(meta4),1000);
      setTimeout(()=>layer.setMeta(meta5),1000);
      setTimeout(()=>layer.setMeta(meta6),1000);
      setTimeout(()=>layer.setMeta(meta4),4000);
      
    }
  },
  mounted() {
    this.initMap();
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  // width: 100vh;
  // overflow: hidden;
  box-sizing: border-box;
}
.map {
  height: 100vh;
  // width: 100vh;
  border: 1px solid red;
  box-sizing: border-box;
}
.info {
  width: 60px;
  background: silver;
  border: 1px solid red;
}

#info {
	position:absolute; 
	top:0; 
	right:0; 
	width: 20em; 
	height: 7.5em; 
	background: rgba(255,255,255,.5); 
	z-index:500; 
	font: 12px Sans;
}

.crsMarker {
	border-top: 2px green solid;
	border-left: 2px green solid;
}
</style>


