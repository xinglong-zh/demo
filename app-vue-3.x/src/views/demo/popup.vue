<template>
  <div class="demo"></div>
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
  methods: {},
  created() {},
  mounted() {
    const gpu = new GPU();
    const multiplyMatrix = gpu
      .createKernel(function (a) {
        return a[this.thread.x] * 4;
      })
      .setOutput([3]);

    const c = multiplyMatrix([12, 14, 16]);
    console.log(c);
  },
};
</script>
<style lang="scss" scoped >
.demo {
  font-family: "cloud";
  font-size: 16px;
}
</style>