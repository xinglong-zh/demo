<template>
  <div class="container">
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import * as L from "leaflet";

export default {
  name: "demoMap",
  data() {
    return {};
  },
  props: {
    option_map: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    initMap() {
      let map = L.map("map").setView([51.505, -0.09], 13);
      let tile =L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      let info = L.control();
      //  control 用来展示信息 ,和交互
      info.onAdd = function(){
        this._div = L.DomUtil.create('div','info')
        this.update()
        return this._div
      }
      info.update = function(){
        this._div.innerHTML = `info demo`
      }
      info.addTo(map)

      let mark1 = L.marker([39.61, -105.02]),mark2 = L.marker([39.74, -104.99])
      let marks = L.featureGroup([mark1,mark2])
      let baseMaps = {
        "<span style='border:1px solid'>tile</span>":tile
      }
      let overLayerMaps ={
        'mark':marks
      }
      L.control.layers(baseMaps,overLayerMaps).addTo(map)
      L.control.scale().addTo(map)
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


