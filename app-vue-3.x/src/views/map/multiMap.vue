<template>
  <div class="container">
      <BaseMap v-for="i in number" :key="'map'+i" class="item" :id="'map'+i" @bound-change="boundChange" :bounds="bounds">  
      </BaseMap>
  </div>
</template>

<script>
import BaseMap from './baseMap' 

export default {
name:'multiMap',
components:{
BaseMap,
},
data(){
BaseMap
    return{
        number:4
    }
},
methods:{
    boundChange:function(value){
        this.bounds = value;
    }
}
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  box-sizing: border-box;
  display: flex;
}
.item{
    height: 50%;
    width: 49%;
    // border: 1px solid red;
}
</style>>
