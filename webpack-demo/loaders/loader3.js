module.exports = function(source){
    console.log('loader3 sync');
    this.callback(null,source);
}