<template>
  <div class="container">
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import * as L from "leaflet";
import * as topojson from "topojson";
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

// import Axios from 'axios';

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
        crs: L.CRS.EPSG4326,
        zoomSnap: 0,
        zoomDelta: 0.5,
        frame: false,
        zoomControl: false,
        center: [38, 104],
        zoom: 4,
        attributionControl: false,
      }),
    },
  },
  methods: {
    async initMap() {
      let map = L.map("map").setView([51.505, -0.09], 3);
      this.map = map;
      // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)
      // L.tileLayer("http://localhost/darkmap/{z}/{x}/{y}.png", {
      //   zoomOffset: 0,
      // }).addTo(map);

      // Axios.get('region.json').then(res=>{
      //   L.topoJson(res.data,{color:'red',weight:1}).addTo(map)
      // })

      L.tileLayer("http://10.1.64.146/darkmap/{z}/{y}/{x}.png", {
        zoomOffset: 0,
      }).addTo(map);

      L.gridLayer.debugCoords().addTo(map);

      // var trd = [63.41, 10.41];

      // var marker = L.marker(trd).addTo(map);

      // var pane = map.getPane("markerPane");

      // var paneCorner = document.createElement("div");
      // paneCorner.style.width = "12px";
      // paneCorner.style.height = "12px";
      // paneCorner.style.borderTop = "2px red solid";
      // paneCorner.style.borderLeft = "2px red solid";

      // pane.appendChild(paneCorner);

      // marker._icon.style.border = "1px solid blue";

      //  L.marker(map.unproject([0, 0]), {
      //   icon: L.divIcon({
      //     className: "crsMarker",
      //     iconAnchor: [0, 0],
      //   }),
      // }).addTo(map);

      // var markerOffsetLine = L.polyline(
      //   [
      //     [0, 0],
      //     [0, 0],
      //   ],
      //   { color: "skyblue" }
      // ).addTo(map);
      // var iconOffsetLine = L.polyline(
      //   [
      //     [0, 0],
      //     [0, 0],
      //   ],
      //   { color: "blue" }
      // ).addTo(map);

      // function info() {
      //   var pixelOrigin = map.getPixelOrigin();
      //   var markerPixelCoords = map.project(trd, map.getZoom());
      //   var markerAnchor = marker.options.icon.options.iconAnchor;
      //   var markerOffset = marker._icon._leaflet_pos;

      //   document.getElementById("info").innerHTML =
      //     '<div style="color: green">CRS origin: 0,0</div>' +
      //     '<div style="color: red">px origin: &Delta;' +
      //     pixelOrigin.x +
      //     "," +
      //     pixelOrigin.y +
      //     "</div>" +
      //     '<div style="color: blue">marker px coords:' +
      //     markerPixelCoords.x.toFixed(2) +
      //     "," +
      //     markerPixelCoords.y.toFixed(2) +
      //     "</div>" +
      //     '<div style="color: blue">marker anchor: &Delta;' +
      //     markerAnchor[0] +
      //     "," +
      //     markerAnchor[1] +
      //     "</div>" +
      //     '<div style="color: skyblue">marker pane offset: &Delta;' +
      //     markerOffset.x +
      //     "," +
      //     markerOffset.y +
      //     "</div>";

      //   markerOffsetLine.setLatLngs([
      //     map.unproject(pixelOrigin),
      //     map.unproject(pixelOrigin.add(markerOffset)),
      //   ]);
      //   iconOffsetLine.setLatLngs([
      //     map.unproject(pixelOrigin.add(markerOffset)),
      //     map.unproject(pixelOrigin.add(markerOffset).subtract(markerAnchor)),
      //   ]);
      // }

      // map.on("load move moveend zoomend viewreset", info);

      // info();

      // let info = L.control();
      //  control 用来展示信息 ,和交互
      // info.onAdd = function(){
      //   this._div = L.DomUtil.create('div','info')
      //   this.update()
      //   return this._div
      // }
      // info.update = function(){
      //   this._div.innerHTML = `info demo`
      // }
      // info.addTo(map)

      // let mark1 = L.marker([39.61, -105.02]),mark2 = L.marker([39.74, -104.99])
      // let marks = L.featureGroup([mark1,mark2])
      // let baseMaps = {
      //   "<span style='border:1px solid'>tile</span>":tile
      // }
      // let overLayerMaps ={
      //   'mark':marks
      // }
      // L.control.layers(baseMaps,overLayerMaps).addTo(map)
      // L.control.scale().addTo(map)

      // const res =  await Axios.get('./feature.json')
      // this.geojson = L.geoJSON(res.data,
      // {
      //   style:function(geoJsonFeature){
      //     // console.log('style',geoJsonFeature)
      //     // if(geoJsonFeature.properties.name){
      //     //   return {
      //     //     // color:'red'
      //     //   }
      //     // }else{
      //     //   return {
      //     //     opacity:0
      //     //   }
      //     // }
      //     if(geoJsonFeature.properties.desc){
      //       // 主线
      //       return {
      //         color:'red',
      //         opacity:1
      //       }
      //     }else{
      //       // 分支
      //       return {
      //         //
      //         // color:'red',
      //         opacity:0.5,
      //         dashArray:'5 1 0'
      //       }
      //     }
      //   },
      //   pointToLayer:function(geoJsonPoint,latlng){
      //     // console.log('point',geoJsonPoint,latlng)
      //     // if(geoJsonPoint.properties)
      //     // return L.circleMarker(latlng,{radius:3})
      //     let markerOptions = {
      //       color:'red',
      //       opacity:1,
      //       radius:2,
      //     }
      //     // 主线 trace  都保留了tracekey 属性 用来追踪
      //     if(geoJsonPoint.properties.trace){
      //         markerOptions = Object.assign({},markerOptions,{radius:4,opacity:1})
      //     }else{
      //         markerOptions = Object.assign({},markerOptions,{color:''})
      //     }
      //     return L.circleMarker(latlng,markerOptions)
      //   },
      //   onEachFeature:this.featuresInteractive
      // }

      //   ).addTo(map)
      // map.fitBounds(this.geojson.getBounds())
    },
    /**
     * 自定义响应事件
     */
    featuresInteractive(feature, layer) {
      let _this = this;
      // console.log('methods',feature,layer)
      if (feature.geometry.type === "Point") {
        let marker = layer;
        marker.on({ mouseover: mouseover, mouseout: mouseout, click: click });
      }

      /**
       * 自定义触发事件
       */
      function mouseover() {
        console.log("mouseover-e");
      }
      function mouseout() {
        console.log("mouseout-e");
      }
      function click(e) {
        console.log("click-e", e, feature);
        // reset style
        // 1  本身是trace 上面的点 , 点击寻找当前的 traceKey
        //  let traceKey = feature.properties.traceKey

        // 可以重置 geojson内部的样式
        console.log(_this);
      }
    },
  },
  mounted() {
    this.initMap();
    // this.testControl();
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


