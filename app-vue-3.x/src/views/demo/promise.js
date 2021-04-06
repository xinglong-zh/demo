// 自定实现promise


// https://www.promisejs.org/implementing/
var PENDING  = '0'
var FULFILLED = '1'
var REJECTED = '2'

// 状态机

function Promise() {
    this.state = PENDING; // 初始状态
    
}