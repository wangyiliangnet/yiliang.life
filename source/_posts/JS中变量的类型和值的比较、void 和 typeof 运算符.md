---
title: JS中变量的类型和值的比较、void 和 typeof 运算符
date: 2017-02-27
tags:
    - JavaScript
    - 变量类型
    - typeof
    - void
---
在ES规范中提到ES中变量类型有 Undefined、Null、Boolean、String、Symbol、Number和Object（注意大写），其中Symbol是ES6新增的特性，任何变量都属于这些类型之一。

ES中提供了 typeof  运算符来检测一个值的类型
``` javascript
var a;
typeof a;               // "undefined"
typeof "hello world";   // "string"
typeof 42;              // "number"
typeof true;            // "boolean"
typeof null;            // "object" -- JS实现的bug，但是不会被修复
typeof undefined;       // "undefined"
typeof { b: "c" };      // "object"
typeof Symbol();        // "symbol"
```
常见的类型 typeof 返回的始终都是这七个字符串之一。

在ES规范中提到，对于规范之外浏览器实现的宿主对象 typeof 可以返回除了 "undefined", "boolean", "function", "number", "symbol", "string"之外的字符串。
例如在IE下：
``` javascript
var xhr = new ActiveXObject("Msxml2.XMLHTTP");
typeof xhr.abort;
// "unknow"
```
在ES6规范中，这是不鼓励的，如果可以的话浏览器应该尽可能返回"object"。

document.all 是IE最早支持的属性，很多代码使用它是否存在来判断是否是 IE 浏览器，在 Chrome、Firefox实现这个属性后，为了兼容之前的代码，有了下面的奇葩：
``` javascript
typeof document.all
// undefined
document.all
// HTMLAllCollection[1839] (1839为元素总数)
```

基本类型和引用类型（对象）
基本类型包括 Undefined、Null、Boolean、String、Symbol、Number。
引用类型则只有 Object。
基本类型的值包括：
Undefined和Null类型分别只有一个值：undefined 和 null
Boolean类型：true、false
String类型：'abc'、"abc"
Symbol类型：Symbol.for('foo')、Symbol('foo')
Number类型：3.14、12、0.12e12、NaN、Infinity
基本类型和引用类型的主要区别在于：
基本类型按值比较，引用类型按引用比较：
``` javascript
 
({} === {})  // two different empty objects
// false
 
var obj1 = {};
var obj2 = obj1;
obj1 === obj2
// true
 
var prim1 = 123;
var prim2 = 123;
prim1 === prim2
// true
```
基本类型始终都是不可变的：
基本类型的属性都是不可修改、添加或删除的。
``` javascript
var str = 'abc';
 
str.length = 1; // try to change property `length`
str.length      // ⇒ no effect
// 3
 
str.foo = 3; // try to create property `foo`
str.foo      // ⇒ no effect, unknown property
// undefined
```
引用类型在默认情况下则是可变的：
``` javascript
var obj = {};
obj.foo = 123; // add property `foo`
obj.foo
// 123
```
undefined是global对象下的属性，不是保留字。所以理论上可以对它们进行删除和赋值（不会出错，但是因为不可配置、不可写，所以删除和赋值是无效的），也可以定义同名的变量。同样的还有Infinity和NaN。
``` javascript
Object.getOwnPropertyDescriptor(window, 'undefined');
// Object {value: undefined, writable: false, enumerable: false, configurable: false}
```
而null、true、false则是ES的保留字，是不能赋值和定义同名变量的。

判断类型
Undefined
Undefined类型只有undefined一个值，所以可以通过判断变量是否等于undefined。
undefined代表着没有值，任何未被赋值过的变量的值都是undefined。除此之外可以显示地给一个变量赋值undefined，不存在的对象属性、没有传值的函数参数、没有返回值的函数调用结果以及 void 运算符也都会返回 undefined。
``` javascript
if (x === void(0)) {
// x的值是undefined
}
if (typeof x === 'undefined') {
// x的值是undefined
}
```

在ES3中 window下的undefined可读可写的，而在ES5以后修复了这个问题。并且因为undefined不是保留字，用户可以在非window作用域下定义同名的变量。
``` javascript
undefined = 123;
 
function foo(){
    var undefined = 123;
    console.log(undefined);
}
foo();
// 123
 
if (true) {
    let undefined = 123;
    console.log(undefined)
}
// 123
```

Null类型
Null类型只有null一个值，所以也可以通过判断变量是否等于 null。
null代表着没有引用对象，通常使用在任何期望存在一个对象的地方。
``` javascript
if (x === null) {
// x的值是null
}
if (typeof x === 'null') {
// x的值是null
}
```

undefined 和 null 都没有任何属性，包括常见的 toString() 和 valueOf()。

Number 类型
JS里数值只有一种类型，不区分整型、浮点型。
``` javascript
5.000
// 5
```
Number 类型通常有以下几种形式:
整数： 1 2
小数：1.2  0.2 .2
十六进制数: 0xFF
八进制数: 012
指数: 5e2 5E2 5E-2
Inifinity
NaN

String、Symbol和Number
这三种类型都可以通过 typeof 来判断。