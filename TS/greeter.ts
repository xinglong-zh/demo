class Student {
    fullName: string;
    // 在构造函数上的参数上使用 public  等同  创建了同名的成员变量
    constructor(public firstName, public middleInitial, public lastName) {
        this.fullName = firstName + ' ' + middleInitial + ' ' + lastName
    }
}

interface Person {
    firstName: string,
    lastName: string
}


function greeter(person: Person) {
    return 'hello' + person.firstName + person.lastName
}

// let user = "jack"
// let user = [0, 2, 3,]
// let user = { firstName: 'xxx', lastName: 'yyy' }
let user = new Student('jane', 'M.', 'user')

document.body.innerHTML = greeter(user)

// 变量类型
let isDone: boolean = false
let list: Array<number> = [1, 2, 3]
let ls: number[] = [1, 2, 3]

let tuple: [string, number]
tuple = ['name', 10]   // tuple 已知数列和类型的数组
// tuple = [10, 10]  // error
// tuple[3] = true  //  error 越界时 ，使用联合类型  . 会使用undifine
enum Color { Red, Green, Blue }   // 默认情况下  从0开始编号

let c: Color = Color.Blue

let c_name: string = Color[1]   // 可以做mapping

// 类型断言1
let someValue: any = 'this is string'
let stringLength = (<string>someValue).length   // 告诉编译器 ， someValue 的类型是  string ， any to  string

// 类型断言2
let some_value: any = 'this is string'
let string_length = (some_value as string).length  // jsx 中使用as ，告诉编译器，any to string


// option bags 
interface SquareConfig {
    color?: string;  // 可选属性 ? 标识
    width?: number;
    [propName: string]: any  // 除 color width 的任意属性，any类型
}

function createSquare(config: SquareConfig): { color: string, area: number } {
    let newSquare = { color: 'white', area: 1000 }
    if (config.color) {
        newSquare.color = config.color
    }
    if (config.width) {
        newSquare.area = config.width * config.width
    }
    return newSquare
}


let mySquare = createSquare({ color: 'red' })

console.log(mySquare)


// 只读属性
interface Point {
    readonly x: number;
    readonly y: number;
}
let p1: Point = { x: 1, y: 2 }
// p1.x = 2   // error

let a: Array<number> = [1, 3, 4]
let ro: ReadonlyArray<number> = a

// a = ro   // error  只读 不可以被赋值 ，赋值到其他也不可以
a = ro as Array<number>;   //可以使用断言重写
a = <number[]>ro   // 断言的第二种形式

//  属性 readonly  变量 const

interface ClockInterface {
    currentTime: Date;
    setTime(d: Date)
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d
    };
    constructor(h: Date, m: Date) {

    }
    tick() {
        throw new Error("Method not implemented.");
    }
}


//  demo  
interface ClockConstructor {
    new(hour: number, minute: number): ClockInterface_1
}

interface ClockInterface_1 {
    tick();
}

// FIXME:  ClockConstructor
function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface_1 {

    return new ctor(hour, minute)
}

class DigitalClock implements ClockInterface_1 {
    constructor(h: number, m: number) { };
    tick() {
        console.log('beep')
    }
}

class AnalogClock implements ClockInterface_1 {
    constructor(h: number, m: number) { };
    tick() {
        console.log('tick tock')
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32)


// 接口可继承，多继承

interface Shape {
    color: string;
}
interface PenStroke {
    penWidth: number;
}
interface Square extends Shape, PenStroke {
    sideLength: number
}
let square = <Square>{};
square.color = 'blue';
square.sideLength = 10


class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message
    }
    greet() {
        return 'hello' + this.greeting
    }
}


let greeter_1 = new Greeter('hello')
console.log(greeter_1.greet())

class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal move ${distanceInMeters}.`)
    }
}

class Dog extends Animal {
    bark() {
        console.log(`dog bark`)
    }
}

const dog: Dog = new Dog();
dog.move(10)
dog.bark()


function buildName(firstName: string, lastName: string = 'will', ...restName: string[]) {
    return firstName + '-' + lastName + '-' + restName.join('-')
}

console.log(buildName('firstname', undefined, 'biu biu ', 'ming'))

// 使用泛型

function identity<T>(args: T): T {
    return <T>args
}

let output = identity<string>('mystring')  // 指定传入的类型
let output_1 = identity('mystring')   // 自动推导类型

function loggingIdentify<T>(args: T[]): T[] {
    console.log(args.length)
    return args
}

function loggingIdentify_1<T>(args: Array<T>): Array<T> {
    return args
}

let myIdentity: { <T>(args: T): T } = identity   // 带有调用签名的对象字面量

// 泛型接口
interface GenericIdentityFn<T> {
    (arg: T): T
}
function identity_1<T>(arg: T): T {
    return arg
}

let myIdentity_1: GenericIdentityFn<number> = identity_1   //  泛型接口，可以传递参数

// 类型兼容性
// ts 是 结构类型系统
// java 是名义类型系统

interface Named {
    name: string
}
class Person {
    name: string
}
let p: Named;
p = new Person()  // 结构类型系统认为，Named 和 person 具有想用的属性  因此赋值  .java 名义类型会报错

