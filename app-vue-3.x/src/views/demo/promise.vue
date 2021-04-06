<template>
  <div class="demo"></div>
</template>

<script>
export default {
name:'testPromise',
data(){
    return{

    }
},
mounted(){
        let p = new Promise((resolve,reject)=>{
            resolve(10);
        })
        console.info(p);
        
},
methods:{},
}
</script>

<style lang="scss" scoped>
.demo {
    width: 100%;
    height: 100%;
}
</style>