//适配Web Worker接口，使得插拔Worker不动程序逻辑
export var newWorker = function (fn) {
    //多线程fn适配单线程
    /* if(L.Browser.mobile) {
        var url = (URL||webkitURL).createObjectURL(new Blob(["(" + fn.toString() + ")(this)"], {type: "application/javascript"}));
        return new Worker(url);
    }*/
    var worker = {terminate:function () {
            console.debug('Fake worker terminate.');
        }};
    var exports = {};
    fn(exports);
    exports.postMessage=function (data) {
        worker.onmessage({data:data});
    }
    worker.postMessage=function(data){
        exports.onmessage({data:data});
    }
    return worker;
}