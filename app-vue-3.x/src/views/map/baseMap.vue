<template>
  <div class="map" :id="id" @focus="focus" @blur="blur"></div>
</template>

<script>
import * as L from 'leaflet';

export default {
  name: "baseMap",
  data() {
    return {
        map:null,
        master:false,
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
        worldCopyJump:true,
      }),
    },
    id:{
        type:String,
        default:'map1',
        required:true,
    },
    bounds:{
        type:Object,
    }
  },
  methods:{
      async initMap(){
          this.map = L.map(this.id).setView([51.505,-0.09],3);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.map)
      },
      focus() {
      this.map.on("moveend ", this.emit, this);
      this.master = true;
    },
    blur() {
      this.map.off("moveend", this.emit, this);
      this.master = false;
    },
    emit() {
    //   this.$store.commit("bounds_changed", { bounds: this.map.getBounds() });
      this.$emit('bound-change',this.map.getBounds());
    },
  },
  mounted(){
      this.initMap();
  }
  
};
</script>

<style lang="scss" scoped>
.map{
    border: 2px solid yellow;
    height: 100%;
}
</style>