<template>
  <div class="demo">6</div>
  <canvas id="canvas" > canvas 内容 </canvas>
</template>

<script>
import { GPU } from "gpu.js";
export default {
  name: "demo",
  data() {
    return {
      item: {},
    };
  },
  methods: {
    getCanvas: function (item, canvas, isAir = true) {
      // let canvas = document.createElement('canvas');
      if (isAir) {
        if (!canvas) {
          canvas.height = 90;
          canvas.width = 90;
          canvas.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
        }

        let ctx = canvas.getContext("2d");
        ctx.font = "16px";
        let k = 0;
        for (let i = 0; i < 3; ++i) {
          for (let j = 0; j < 3; ++j) {
            ctx.fillText(k++, 10 + i * 30, 20 + j * 30);
          }
        }
        ctx.font = "16px cloud";
        ctx.fillText("7", 36, 50); // 需要变量
        ctx.font = "30px wind";
        ctx.translate(45, 45);
        ctx.rotate((90 * Math.PI) / 180); // 需要变量
        ctx.font = "30px wind";
        ctx.fillText("6", 0, -10); // 需要变量
      } else {
        if (!canvas) {
          canvas.height = 150;
          canvas.width = 90;
          canvas.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
        }

        let ctx = canvas.getContext("2d");
        ctx.font = "16px";
        let k = 0;
        for (let i = 0; i < 3; ++i) {
          for (let j = 0; j < 5; ++j) {
            ctx.fillText(k++, 10 + i * 30, 20 + j * 30);
          }
        }
        ctx.font = "16px cloud";
        ctx.fillText("7", 36, 80); // 需要变量
        ctx.font = "30px wind";
        ctx.translate(45, 75);
        ctx.rotate((90 * Math.PI) / 180); // 需要变量
        ctx.font = "30px wind";
        ctx.fillText("6", 0, -10); // 需要变量
      }

      return canvas;
    },
  },
  created() {},
  mounted() {
    // const gpu = new GPU();
    // const multiplyMatrix = gpu
    //   .createKernel(function (a) {
    //     return a[this.thread.x] * 4;
    //   })
    //   .setOutput([3]);

    // const c = multiplyMatrix([12, 14, 16]);
    // console.log(c);

    // document.getElementById('demo').parentNode.insertBefore(this.getCanvas(),null);
    let canvas = document.getElementById("canvas");
    canvas.height =90
    canvas.width =90
    this.getCanvas({}, canvas, true);
    document.body.insertBefore(canvas, null);
  },
};
</script>
<style lang="scss" scoped >
@font-face {
  font-family: "wind";
  src: url("./wind.ttf") local("wind");
  font-display: swap;
}

@font-face {
  font-family: "cloud";
  src: url("./cloud.ttf") local("cloud");
  font-display: swap;
}

#canvas {
  border: 1px solid red;
  font-family: "wind";
}
</style>