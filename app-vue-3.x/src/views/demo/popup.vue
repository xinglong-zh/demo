<template>
  <div>
    <div ref="demo" >
      <span style="font-family: cloud">3</span>
      <span style="font-family:wind">6</span>

    </div>
  </div>
</template>

<script>

import {formatNumber} from '@/utils/format'
export default {
  name: "demo",
  data(){
    return {
      item:{
            "STATION": "43150",
            "ODATE": "6/10/2019 00:00:00",
            "LDATE": "6/10/2019 00:00:00",
            "LTIME": "0",
            "LATITUDE": "17.699999999999999",
            "LONGITUDE": "83.299999999999997",
            "ELEVATION": "66.000000000000000",
            "TYPE": "-2147483648",
            "PRESS": "70.000000000000000",
            "MEAN": "32",
            "GPH": "18630.000000000000",
            "AT": "-80.70000000000000",
            "TD": "-101.7000000000000",
            "WD": "350",
            "WS": "0.0000000000000000",
            "Q_PRESS": "",
            "Q_MEAN": "",
            "Q_GPH": "",
            "Q_AT": "",
            "Q_TD": "",
            "Q_WD": "",
            "Q_WS": "",
            "TELEID": "",
            "RTIME": "1570291200000"
        },
    }
  },
  methods: {
    getCanvas(data,isAir,zoomLevel) {
      console.log('data',data,'isair',isAir,'zoom',zoomLevel)
      let tem = new Map();
      for(let i=0;i<10;i++){
        switch(i){
          case 1:
            tem.set(i,formatNumber(data.DT24))
            break;
            case 2:
              tem.set(i,'')
              break;
              case 3:
                tem.set(i,'')
               break;
                case 4:
                  tem.set(i,formatNumber(data.AT))
                  break;
                  case 5:
                    tem.set(i,'')
                    break;
                    case 6:
                      tem.set(i,'925')
                     break;
                      case 7:
                        tem.set(i,formatNumber(data.TD))
                        break;
                        case 8:
                          tem.set(i,'')
                          break;
                          case 9:
                            tem.set(i,'')
                            break
        }
      }
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext('2d');
      canvas.width=100
      canvas.height=100
      ctx.strokeRect(0,0,80,80)

      ctx.font = '12px serif'
      //  九个位置 , 使用循环开始绘制 ,  横向三个 ,然后加一  置零
      let counter = 1;  // 使用一个计数器
      for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
          let x= i*20+20
          let y= j*20+12
          // console.log(tem.get(counter++))
          ctx.fillText(tem.get(counter++),y,x)
        } 
      }
      // 开始绘制中心点
      ctx.font = '16px cloud'
      ctx.fillText(0,32,42)
      ctx.fillText('.',38,38)
      ctx.save()
      ctx.translate(38,38)
      ctx.rotate(0*Math.PI/180)
      ctx.font ='24px wind';
      ctx.fillText(3,0,-10)
      return canvas
    },
  },
  created(){
    let canvas = this.getCanvas(this.item,false,6)
    document.body.appendChild(canvas)
  },
  // mounted() {
  //   let canvas =  this.getCanvas(this.item,false,6);
  //   document.body.appendChild(canvas)
  // },
};
</script>
<style lang="scss" >
.demo {
  font-family: 'cloud';
  font-size: 16px;
}
canvas{
  border: 1px solid black;
  // font-family: 'wind';
  width: 100px;
  height: 100px;
}

</style>