<template>
  <h1>探索 canvas + webgl</h1>
  <canvas id="glcanvas" height="300" width="300"> 浏览器不支持canvas </canvas>
  <canvas id="canvas" height="300" width="300">浏览器不支持canvas</canvas>
</template>
<script>
import {
  fsSource,
  vsSource,
  createShader,
  createProgram,
  resizeCanvas,
} from "./Util"; // 引入
import {ShadedLayer} from '@/assets/js/gl-shaded/ShadedLayer'
export default {
  name: "webgl",
  data() {
    return {};
  },
  mounted() {
    /**@type {HTMLCanvasElement} */
    let canvas = document.querySelector("#glcanvas");
    let gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  },
  methods: {
    
  },
};
</script>
<style lang="scss" scoped>
.demo {
  width: 30px;
  height: 30px;
  background: #000;
  position: relative;
  border: 1px solid red;
}
canvas {
  border: 1px solid red;
}
</style>