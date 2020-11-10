<template>
  <div class="container">
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import * as L from "leaflet";
import 'axios'
import Axios from 'axios';

export default {
  name: "demoMap",
  data() {
    return {
      geojson:null
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
      let map = L.map("map").setView([51.505, -0.09], 13);
      // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)
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

      const res =  await Axios.get('./feature.json')
      this.geojson = L.geoJSON(res.data,
      {
        style:function(geoJsonFeature){
          // console.log('style',geoJsonFeature)
          // if(geoJsonFeature.properties.name){
          //   return {
          //     // color:'red'
          //   }
          // }else{
          //   return {
          //     opacity:0
          //   }
          // }
          if(geoJsonFeature.properties.desc){
            // 主线
            return {
              color:'red',
              opacity:1
            }
          }else{
            // 分支
            return {
              // 
              // color:'red',
              opacity:0.5,
              dashArray:'5 1 0'
            }
          }
        },
        pointToLayer:function(geoJsonPoint,latlng){
          // console.log('point',geoJsonPoint,latlng)
          // if(geoJsonPoint.properties)
          // return L.circleMarker(latlng,{radius:3})
          let markerOptions = {
            color:'red',
            opacity:1,
            radius:2,
          }
          // 主线 trace  都保留了tracekey 属性 用来追踪
          if(geoJsonPoint.properties.trace){
              markerOptions = Object.assign({},markerOptions,{radius:4,opacity:1})         
          }else{
              markerOptions = Object.assign({},markerOptions,{color:''})
          }
          return L.circleMarker(latlng,markerOptions)
        },
        onEachFeature:this.featuresInteractive
      }
        
        ).addTo(map)
      map.fitBounds(this.geojson.getBounds())
    },
    /**
     * 自定义响应事件
     */
    featuresInteractive(feature,layer){
         let _this = this;
        // console.log('methods',feature,layer)
        if(feature.geometry.type==='Point'){
            let marker = layer
            marker.on(
              {'mouseover':mouseover,
              "mouseout":mouseout,
              'click':click
              }
              )
        }

        /**
         * 自定义触发事件
         */
        function mouseover(){
          console.log('mouseover-e')
        }
        function mouseout(){
           console.log('mouseout-e')
        }
        function click(e){
           console.log('click-e',e, feature)
           // reset style
           // 1  本身是trace 上面的点 , 点击寻找当前的 traceKey
          //  let traceKey = feature.properties.traceKey


           // 可以重置 geojson内部的样式 
           console.log(_this)
           
        }
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
.map{
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
</style>


