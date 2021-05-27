<template>
  <div class="container">
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import * as L from "leaflet";
// import * as topojson from "topojson";
// import '@/assets/js/bundle';
//extend Leaflet to create a GeoJSON layer from a TopoJSON file
// L.TopoJSON = L.GeoJSON.extend({
//   addData: function (data) {
//     var geojson, key;
//     if (data.type === "Topology") {
//       for (key in data.objects) {
//         // eslint-disable-next-line no-prototype-builtins
//         if (data.objects.hasOwnProperty(key)) {
//           geojson = topojson.feature(data, data.objects[key]);
//           L.GeoJSON.prototype.addData.call(this, geojson);
//         }
//       }
//       return this;
//     }
//     L.GeoJSON.prototype.addData.call(this, data);
//     return this;
//   },
// });
// L.topoJson = function (data, options) {
//   return new L.TopoJSON(data, options);
// };

// // 自定义tile
// L.GridLayer.DebugCoords = L.GridLayer.extend({
//   createTile: function (coords, done) {
//     var tile = document.createElement("div");
//     tile.innerHTML = [coords.x, coords.y, coords.z].join(", ");
//     tile.style.outline = "1px solid red";

//     setTimeout(function () {
//       done(null, tile); // Syntax is 'done(error, tile)'
//     }, 500 + Math.random() * 1500);

//     return tile;
//   },
// });
// L.gridLayer.debugCoords = function (opts) {
//   return new L.GridLayer.DebugCoords(opts);
// };

// L.Circle.Demo = L.Circle.extend({
//   getEvens: function () {
//     var events = L.Circle.prototype.getEvents.call(this);
//     events.moveend = this.redraw;
//   },
// });

// L.circle.demo = function (opts) {
//   return new L.Circle.Demo(opts);
// };

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// import ContourLayerExt from '@/assets/js/contour/ContourLayerExt'
import "@/assets/js/leaflet.canvas-markers.js";

import Axios from "axios";

import BinLayer from "@/assets/js/BinLayer";
import { Meta1 } from "@/assets/js/gl-shaded/Catalog";

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
        worldCopyJump: false,
      }),
    },
  },
  methods: {
    async initMap() {
      let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconAnchor: [12, 41], // 配置icon的偏移   png:21*41
        iconSize: [25, 41],
      });
      L.Marker.prototype.options.icon = DefaultIcon;
      let map = L.map("map", {
        worldCopyJump: false,
        preferCanvas: true,
        renderer: L.canvas({ tolerance: 10 }),
      }).setView([59, 30], 10);

      let marker = L.marker(map.getCenter(), { icon: DefaultIcon });

      var ciLayer = L.canvasIconLayer({}).addTo(map);
      ciLayer.addMarker(marker);
    },
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
  position: absolute;
  top: 0;
  right: 0;
  width: 20em;
  height: 7.5em;
  background: rgba(255, 255, 255, 0.5);
  z-index: 500;
  font: 12px Sans;
}

.crsMarker {
  border-top: 2px green solid;
  border-left: 2px green solid;
}
.marker-canvas {
  width: 100%;
  height: 100%;
}
</style>


