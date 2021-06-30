<template>
  <div class="demo">6</div>
  <canvas id="canvas"> canvas 内容 </canvas>
  <canvas id="canvas2" height="300" width="300"> canvas 内容内容</canvas>
</template>

<script>
import { GPU } from "gpu.js";
import * as GIF from "./gif.js";
import "./gif.worker.js";
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
    tick() {
      // let gif = new GIF({
      //   workers: 2,
      //   quality: 10,
      // });

      // 在canvas 上循环画点
      let canvas = document.querySelector('#canvas2');
      let ctx = canvas.getContext("2d");
      // ctx.save();
      ctx.fillStyle ="red"
      ctx.clearRect(0, 0, 300, 300);
      // ctx.fillStyle = "white 18px";
      // ctx.fillRect(0,0,100,100)
      let random = (Math.random() * 300).toFixed(0);
      // console.log(random);
      ctx.fillStyle = "black 18px";
      ctx.fillText("1", random, random);
      requestAnimationFrame(this.tick);


      // gif.addFrame(canvas,{delay:200,copy:true});
      // gif.render();
      // gif.on("finished", function (blob) {
        // window.open(URL.createObjectURL(blob));
        // 后台下载
        // let a = document.createElement("a");
        // a.download = "下载";
        // a.href = URL.createObjectURL(blob);
        // document.body.appendChild(a);
        // a.click();
        // a.remove();
      // });
    },
    generateGIF() {
      let gif = new GIF({
        workers: 2,
        quality: 10,
      });

      let canvas = document.querySelector("#canvas2");
      gif.addFrame(canvas);
      for(let i=0;i<4;i++){
         requestAnimationFrame(()=>{
           gif.addFrame(canvas,{height:300,width:300});
         })
      }
      gif.render();

      gif.on("finished", function (blob) {
        // window.open(URL.createObjectURL(blob));
        // 后台下载
        // let a = document.createElement("a");
        // a.download = "下载";
        // a.href = URL.createObjectURL(blob);
        // document.body.appendChild(a);
        // a.click();
        // a.remove();
      });
    },
    taskDemo(){
      // 测试异步
      setTimeout(() => {
         console.log('time out 100');
      }, 100);
      let promise = new Promise((resolve,reject)=>{
        setTimeout(()=>{
          console.log('resolve 100');
          resolve('promise 100');
        })
      })
      promise.then(res=>{console.log(res)});
    }
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
    // let canvas = document.getElementById("canvas");
    // canvas.height =90
    // canvas.width =90
    // this.getCanvas({}, canvas, true);
    // document.body.insertBefore(canvas, null);

    this.tick();
    this.generateGIF();
    this.taskDemo();
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
#canvas2 {
  border: 1px solid red;
  font-family: "wind";
}
</style>