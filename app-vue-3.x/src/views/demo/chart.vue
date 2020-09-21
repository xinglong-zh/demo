<template>
  <div>
    <div>检验指标</div>
    <div id="mychart"></div>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  name: "chart",
  data() {
    return {};
  },
  mounted() {
    this.drawchart();
  },
  methods: {
    drawchart(id = "mychart") {
      let chart = echarts.init(document.getElementById(id));
      const option = {
        color: ["#6A5BCE"],
        title: {
          text: "航空危险天气预报准确率客观检验",
          left: "50%",
          textAlign: "center",
        },
        xAxis: {
          type: "category",
          data: [
            "北京",
            "天津",
            "河北",
            "山西",
            "内蒙古",
            "上海",
            "江苏",
            "浙江",
            "安徽",
            "北京",
            "天津",
            "河北",
            "山西",
            "内蒙古",
            "上海",
            "江苏",
            "浙江",
            "安徽",
          ],
        },
        legend: [
          {
            show: true,
          },
        ],
        yAxis: {
          name: "晴雨准确率",
          type: "value",
          axisLabel: {
            formatter: `{value} %`,
          },
        },
         toolbox: {
          show: true,
          feature: {
            saveAsImage: {},
            dataZoom: {},
          },
        },
        series: [
          {
            data: [
              91,
              90,
              60,
              100,
              70,
              10,
              30,
              80,
              20,
              21,
              90,
              60,
              100,
              70,
              10,
              30,
              80,
              20,
            ],
            type: "bar",
            name: "晴雨准确率",
          },
        ],
      };
      chart.setOption(option);
    },
  },
};
</script>
<style scoped>
#mychart {
  height: 600px;
}
</style>

