var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Student = /** @class */ (function () {
    // 在构造函数上的参数上使用 public  等同  创建了同名的成员变量
    function Student(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + ' ' + middleInitial + ' ' + lastName;
    }
    return Student;
}());
function greeter(person) {
    return 'hello' + person.firstName + person.lastName;
}
// let user = "jack"
// let user = [0, 2, 3,]
// let user = { firstName: 'xxx', lastName: 'yyy' }
var user = new Student('jane', 'M.', 'user');
document.body.innerHTML = greeter(user);
// 变量类型
var isDone = false;
var list = [1, 2, 3];
var ls = [1, 2, 3];
var tuple;
tuple = ['name', 10]; // tuple 已知数列和类型的数组
// tuple = [10, 10]  // error
// tuple[3] = true  //  error 越界时 ，使用联合类型  . 会使用undifine
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {})); // 默认情况下  从0开始编号
var c = Color.Blue;
var c_name = Color[1]; // 可以做mapping
// 类型断言1
var someValue = 'this is string';
var stringLength = someValue.length; // 告诉编译器 ， someValue 的类型是  string ， any to  string
// 类型断言2
var some_value = 'this is string';
var string_length = some_value.length; // jsx 中使用as ，告诉编译器，any to string
function createSquare(config) {
    var newSquare = { color: 'white', area: 1000 };
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}
var mySquare = createSquare({ color: 'red' });
console.log(mySquare);
var p1 = { x: 1, y: 2 };
// p1.x = 2   // error
var a = [1, 3, 4];
var ro = a;
// a = ro   // error  只读 不可以被赋值 ，赋值到其他也不可以
a = ro; //可以使用断言重写
a = ro; // 断言的第二种形式
var Clock = /** @class */ (function () {
    function Clock(h, m) {
    }
    Clock.prototype.setTime = function (d) {
        this.currentTime = d;
    };
    ;
    Clock.prototype.tick = function () {
        throw new Error("Method not implemented.");
    };
    return Clock;
}());
// FIXME:  ClockConstructor
function createClock(ctor, hour, minute) {
    return new ctor(hour, minute);
}
var DigitalClock = /** @class */ (function () {
    function DigitalClock(h, m) {
    }
    ;
    DigitalClock.prototype.tick = function () {
        console.log('beep');
    };
    return DigitalClock;
}());
var AnalogClock = /** @class */ (function () {
    function AnalogClock(h, m) {
    }
    ;
    AnalogClock.prototype.tick = function () {
        console.log('tick tock');
    };
    return AnalogClock;
}());
var digital = createClock(DigitalClock, 12, 17);
var analog = createClock(AnalogClock, 7, 32);
var square = {};
square.color = 'blue';
square.sideLength = 10;
var Greeter = /** @class */ (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return 'hello' + this.greeting;
    };
    return Greeter;
}());
var greeter_1 = new Greeter('hello');
console.log(greeter_1.greet());
var Animal = /** @class */ (function () {
    function Animal() {
    }
    Animal.prototype.move = function (distanceInMeters) {
        if (distanceInMeters === void 0) { distanceInMeters = 0; }
        console.log("Animal move " + distanceInMeters + ".");
    };
    return Animal;
}());
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    function Dog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dog.prototype.bark = function () {
        console.log("dog bark");
    };
    return Dog;
}(Animal));
var dog = new Dog();
dog.move(10);
dog.bark();
