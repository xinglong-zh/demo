<template>
  <div id="typhoon">
    <div class="topDiv">
      <label>年台风列表:</label>
      <select name="year" id="year">
        <option v-for="(item) in yearList" :value="item" :key="item">{{item}}</option>
      </select>
    </div>
    <div  class="typhoon-select">
      <!-- <div class="tySelItem" v-for="(item,i) in typhoonList" :key="i" @click="checkTyphoon(i)">
        <img v-if="typhoon===i" src="../../assets/images/选中.png" alt />
        <img v-else src="../../assets/images/选框.png" alt />
        <div>{{item}}</div>
      </div> -->
      <el-checkbox-group v-model="checkedTyphoonList" class="item" @change="handleTyphoonChange">
        <el-checkbox v-for="item in typhoonList" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
export default {
  name: "typhoon",
  data() {
    return {
      year: 2020,
      yearList: [2020, 2019, 2018, 2017, 2016, 2015],
      typhoon: undefined,
      typhoonList: [
        {label:'海神',value:'HAISHEN'},
        {label:'美莎克',value:'MAYSAK'},
        {label:'红霞',value:'NOUL'},
        {label:'米拉克',value:'MEKKHALA'},
      ],   // 台风列表，后期通过接口获取，目前配置在data 中
      checkedTyphoonList:[],
    };
  },
  methods: {
    /** x选中台风列表的方法checkTyphoon
     * @param {number} index 选中的台风的索引
     */
    checkTyphoon(index) {
      this.typhoon = index;
      this.$parent.$emit("handle-emit");
    },
    handleTyphoonChange(val){
      // console.log(val)
      this.$store.commit('setTyphoonList',{typhoon:val})
    }
  },
};
</script>
<style lang="scss" scoped>
$background-color: #000000a2;
#typhoon {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  border: 1px solid red;
}
.topDiv {
  height: 11%;
  display: flex;
  select {
    background-color:$background-color;
    color: white;
  }
  label{
    margin-right: 10px;
  }
}
#typhoonSel {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
// .tySelItem {
//   display: flex;
//   line-height: 1rem;
//   cursor: pointer;
// }
// .tySelItem > img {
//   width: 14px;
//   height: 14px;
// }
.typhoon-select{
  color: white;
  .item {
    display: flex;
    flex-direction: column;
  }
  ::v-deep .el-checkbox{
    color: white;
  }
  ::v-deep .is-checked{
    color: white;
  }
}
</style>