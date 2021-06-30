<template>
  <h3>探索对象池</h3>
  <div class="demo"></div>
</template>

<script>
export default {
  name: "chart",
  data() {
    return {};
  },
  mounted() {
    
    let factory  = this.objectPoolFactory(createFn);
    let canvas = factory.create();
    console.log(canvas);

    function createFn (){
      return document.createElement('canvas');
    }
  },
  methods: {
    objectPoolFactory: function (createFn) {
      let objects = [];
      // 利用闭包
      return {
        create: function () {
           let obj = objects.length? objects.shift(): createFn.apply(this,arguments);
           return obj;
        },
        recover: function (obj) {
            objects.push(obj);
        },
      };
    },
  },
};
</script>
<style scoped>
#mychart {
  height: 600px;
}
</style>

