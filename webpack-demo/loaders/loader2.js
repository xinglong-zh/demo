
module.exports  = function(source){
    console.log('async loader2');
    const callback = this.async();
    setTimeout(()=>{
        callback(null,source);
    },2000)
}