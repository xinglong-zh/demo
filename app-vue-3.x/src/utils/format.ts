// export const formatDate = (date:Date)=>{
//     if(date){
//       let y = date.getFullYear()
//       let m = date.getMonth() + 1
//       m = m < 10 ? '0' + m : m
//       let d = date.getDate()
//       d = d < 10 ? ('0' + d) : d
//       return y + '-' + m + '-' + d
//     }
//   }
  
  /**
       * 格式化数据  undefine --> 空
       * 小数点后3位 
       * -20000 非法
       */
  export const formatNumber = (str:any) =>{
    let res
    if(!str){
       res = 'x'
     }else if(str<-2000){
       res = 'x'
     }else {
       res = Math.round(str)
     }
     return res
  
  }
  
  
  /**
   * 两个数之间的随机整数
   * @param {Number} min 
   * @param {Number} max 
   */
  export  function getRandomInt(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
  }
  
  