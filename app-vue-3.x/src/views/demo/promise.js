

/** 自定义 promise 进行覆盖 */
function Promise_D(executor) {
    // 添加属性
    this.PromiseStatue = 'pending';
    this.PromiseResult = null;
    // this.callback = {};
    this.callbacks =[];
    const self = this;

    // 申明
    function resolve(data) {
        // 状态只改变一次
        if (self.PromiseStatue != 'pending') return;
        // resolve 1 改变对象状态 , 设置对象的结果值

        self.PromiseStatue = 'fulfilled';
        self.PromiseResult = data;
        // 执行回调
        // if(self.callback.onResolved){
        //     self.callback.onResolved(data)
        // }
        self.callbacks.forEach(item=> item.onResolved(data));
    }
    function reject(data) {
        // 状态只改变一次
        if (self.PromiseStatue != 'pending') return;
        // reject 1 改变对象状态 , 设置对象的结果值
        self.PromiseStatue = 'reject';
        self.PromiseResult = data;

        // if(self.callback.onReject){
        //     self.callback.onReject(data)
        // }
        self.callbacks.forEach(item=> item.onReject(data));
        
    }
    // executor 内部是同步调用 , catch error
    try {
        executor(resolve, reject);
    } catch (e) {
        reject(e);
    }

}
Promise_D.prototype.then = function (onResolved, onReject) {
    // 成功
    if (this.PromiseStatue == 'fulfilled') {
        onResolved(this.PromiseResult);
    }
    // 失败
    if (this.PromiseStatue == 'reject') {
        onReject(this.PromiseResult);
    }

    if(this.PromiseStatue=='pending'){
        // 不能直接执行 , 保存在callback中
        // this.callback ={
        //     onResolved:onResolved,
        //     onReject:onReject,
        // }
        this.callbacks.push({onResolved:onResolved,onReject:onReject});

    }
}
Promise_D.prototype.catch = function () { }
Promise_D.prototype.finally = function () { }
