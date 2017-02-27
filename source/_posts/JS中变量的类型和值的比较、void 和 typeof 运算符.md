---
title: JS中变量的类型和值的比较、void 和 typeof 运算符
date: 2017-02-27
tags:
    - JavaScript
    - 变量类型
    - typeof
    - void
---
在 ES 规范中提到 ES 中变量类型有 Undefined、Null、Boolean、String、Symbol、Number和Object（注意大写），其中 Symbol 是 ES6 新增的特性，任何变量都属于这些类型之一。

ES中提供了 `typeof` 运算符来检测一个值的类型
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
对于常见的类型，`typeof` 返回的始终都是这七个字符串之一。

在ES规范中提到，对于规范之外浏览器实现的宿主对象 `typeof` 可以返回除了 `"undefined"`、`"boolean"`、 `"function"`、`"number"`、`"symbol"` 和 `"string"`之外的字符串。
<!-- more -->
例如在IE下：
``` javascript
var xhr = new ActiveXObject("Msxml2.XMLHTTP");
typeof xhr.abort;
// "unknow"
```
在ES6规范中，这是不鼓励的，如果可以的话浏览器应该尽可能返回 `"object"`。

`document.all` 是 IE 最早支持的属性，很多代码使用它是否存在来判断是否是IE浏览器，在 Chrome、Firefox 实现这个属性后，为了兼容之前的代码，有了下面的奇葩：
``` javascript
typeof document.all
// undefined
document.all
// HTMLAllCollection[1839] (1839为元素总数)
```

基本类型和引用类型（对象）
基本类型包括 Undefined、Null、Boolean、String、Symbol、Number。引用类型则只有 Object。

基本类型的值包括：
* Undefined 和 Null 类型分别只有一个值：`undefined` 和 `null`
* Boolean 类型：`true`、`false`
* String 类型：`'abc'`、`"abc"`
* Symbol 类型：`Symbol.for('foo')`、`Symbol('foo')`
* Number 类型：`3.14`、`12`、`0.12e12`、`NaN`、`Infinity`

基本类型和引用类型的主要区别在于：基本类型按值比较，引用类型按引用比较：
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
基本类型始终都是不可变的：基本类型的属性都是不可修改、添加或删除的。
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
`undefined` 是 global 对象下的属性，不是保留字。所以理论上可以对它们进行删除和赋值（不会出错，但是因为不可配置、不可写，所以删除和赋值是无效的），也可以定义同名的变量。同样的还有 `Infinity` 和 `NaN`。
``` javascript
Object.getOwnPropertyDescriptor(window, 'undefined');
// Object {value: undefined, writable: false, enumerable: false, configurable: false}
```
而 `null`、`true`、`false` 则是 `ES` 的保留字，是不能赋值和定义同名变量的。

##### 判断类型
###### Undefined
Undefined 类型只有 `undefined` 一个值，所以可以通过判断变量是否等于 `undefined`。
`undefined` 代表着没有值，任何未被赋值过的变量的值都是 `undefined`。除此之外可以显示地给一个变量赋值 `undefined`，不存在的对象属性、没有传值的函数参数、没有返回值的函数调用结果以及 `void` 运算符也都会返回 `undefined`。
``` javascript
if (x === void(0)) {
// x的值是undefined
}
if (typeof x === 'undefined') {
// x的值是undefined
}
```
在 ES3 中 `window` 下的 `undefined` 可读可写的，而在 ES5 以后修复了这个问题。并且因为 `undefined` 不是保留字，用户可以在非 `window` 作用域下定义同名的变量。
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
###### Null
Null 类型只有 `null` 一个值，所以也可以通过判断变量是否等于 `null`。
`null` 代表着没有引用对象，通常使用在任何期望存在一个对象的地方。
``` javascript
if (x === null) {
// x的值是null
}
if (typeof x === 'null') {
// x的值是null
}
```
`undefined` 和 `null` 都没有任何属性，包括常见的 `toString()` 和 `valueOf()`。
###### Number
JS 里数值只有一种类型，不区分整型、浮点型。
``` javascript
5.000
// 5
```
Number 类型通常有以下几种形式:

|||
|---|---|
|整数|1 2|
|小数|1.2  0.2 .2|
|十六进制数|0xFF|
|八进制数|012（严格模式下不能使用）|
|指数|5e2 5E2 5E-2|
|Inifinity| |
|NaN| |

String、Symbol 和 Number 这三种类型都可以通过 `typeof` 来判断。

###### Object
所有不是基本类型的值都是对象。对象也可以通过 `typeof` 判断。但通常我们需要判断不同具体的对象类型。例如 Array、Function、RegExp等，以及浏览器中的 Document、NodeList， 或者是否等于全局的 `window`。
![对象](http://qhyxpic.oss.kujiale.com/2017/02/27/LC2AF2QKAEDGUAPEAAAAAEI8_476x464.jpg)

不考虑 IE8 以下的情况时，可以使用 `Object.prototype.toString.call`。因为 `Object.prototype.toString` 是浏览器内部实现，不可被修改，所以是非常可靠的。

``` javascript
var class2type = {
    '[object HTMLDocument]': 'Document',
    '[object HTMLCollection]': 'NodeList',
    '[object StaticNodeList]': 'NodeList',
    '[object IXMLNodeList]': 'NodeList',
    '[object DOMWindow]': 'Window',
    '[object global]': 'Window'
};
'Boolean,Number,String,Function,Array,Date,RegExp,Window,Document,Arguments,NodeList,Error'.split(',').forEach(function(type){
    class2type['[object ' + type + ']'] = type;
});
function type(obj) {
    return class2type[Object.prototype.toString.call(obj)] || 'Object';
}
```
包装类型
Boolean、Number、String这三种类型都有对应的构造函数：`Boolean`、`Number`、`String`。
这些构造函数的实例（称为包装对象）包含了对应的基本类型的值。这些函数都有两种调用方式：
作为构造函数调用：返回一个包装对象，它的类型是 Object。
``` javascript
typeof new String('abc')
// 'object'
new String('abc') === new String('abc')
// false
new String('abc') === 'abc'
// false
```
一般不推荐使用构造函数来创建这些包装对象，而直接使用字面量来创建基本类型。在使用时会隐式地转换为包装对象，从而可以使用构造函数原型链上的方法。
``` javascript
'abc'.charAt === String.prototype.charAt
// true
```
作为普通函数调用：将输入参数转换为对应的基本类型返回。
``` javascript
String(123)
// '123'
String('abc') === String('abc')
// true
```
将包装类型转换为基本类型，使用 `valueOf()`：
``` javascript
new Boolean(true).valueOf()
// true
new Number(123).valueOf()
// 123
new String('abc').valueOf()
// 'abc'
```
##### 类型转换
###### Object

|value|Result|
|-----|------|
|(Called with no parameters)|{}|
|undefined|{}|
|null|{}|
|A boolean bool|new Boolean(bool)|
|A number num|new Number(num)|
|A string str|new String(str)|
|An object obj|obj (unchanged, nothing to convert)|
将 Object 转换为基础类型
* 如果需要的基础类型是 Number：先调用 `object` 的 `valueOf()`，如果返回的不是基础类型，则调用 `toString()`。
* 如果需要的基础类型是 String: 先调用 `object` 的 `toString()`，如果返回的不是基础类型，则调用 `valueOf()`。
* 默认的 `valueOf()` 会返回 `object()` 的引用，默认的 `toString()` 会返回类型信息。

###### Boolean
Trythy and falsy values: 在所有需要输入布尔值的地方，传入任何值，都会被转换为布尔类型，其中会被转换为 `false` 的，称为 falsy 的，会被转换为 `true` 的，成为 truthy 的。
会被转换为 `false` 的有：
* undefined
* null
* 0
* NaN
* ''
所有其他值，包括所有 Object（甚至是空对象、空数组、`new Boolean(false)`、`new Number(0)`）都会转换为 `true`。
所以我们在写如下代码时要考虑 `x` 为 `0` 或 `''` 时是否需要进入if分支。
``` javascript
if (x) {
    // x has a value
}
```
显式转换为 Boolean 类型：

|||
|----------|----------|
|Boolean(value)|Boolean作为普通函数调用|
|value ? true : false||
|!!value|单个!运算符会将value转换为相反的Boolean类型，所以需要两个!|
逻辑运算符（`&&` 、`||` 和 `!`）
* `a && b`： 如果 `a` 为 trythy，则表达式的值为 `b`，否则表达式的值为 `a`。
* `a || b`： 如果 `a` 为 truthy，则表达式的值为 `a`, 否则表达式的值为 `b`。
* `!a`：如果 a 为 truthy，则表达式的值为 `false`，否则表达式的值为 `true`。

`&&` 和 `||` 不会转换变量类型，它们的值还是运算数原始的类型。所以在需要使用 Boolean 类型的地方，我们通常需要写成 `!!(a && b)` 和 `!!(a || b)` 把运算结果显式转换为 Boolean。

###### Number
显式转换为 Number 类型：

|||
|----------|----------|
|Number(value)|	Number作为普通函数调用|
|+value||

转换规则：

|value|Result|
|----------|----------|
|undefined|NaN|
|true|1|
|null|0|
|false|0|
|An object|先调用 valueOf()，如果返回非基础类型，则调用 toString()，然后将返回的基础类型转换为Number|
|A string|字符串前后的空格会被忽略之后<br />空字符串：0<br />解析字符串： Number('1e3')： 1000<br />Number('0.123')： 0.123<br />Number('NaN') ： NaN<br />Number('Infinity')： Infinity|

`parseFloat(string)`
`parseFloat()` 会将参数先转换为 String（参见转换到String），然后再将 String 转换为 Number。
``` javascript
parseFloat(true)  // same as parseFloat('true')
// NaN
parseFloat(null)  // same as parseFloat('null')
// NaN
parseFloat('')
// NaN
parseFloat('123.45#') // 会一直解析到第一个非法的字符
// 123.45
```
parseInt(str, radix?) 2<=radix<=36
``` javascript
parseInt('')
// NaN
parseInt('12.9', 10)
// 12
parseInt('12.1', 10)
// 12
```

不要使用 `parseInt()` 将 Number 类型转换为整数。
``` javascript
parseInt(1000000000000000000000.5, 10)
// 1
```

###### String
显式转换为 String 类型

|||
|----------|----------|
|String(value)|	String作为普通函数调用|
|''+value||
|value.toString()|(Does not work for undefined and null!)|

隐式类型转换
在 JS 中大多数运算符和内置的函数、方法都会对参数进行类型转换从而得到它们需要的类型。
例如乘号运算符会将两个运算数转换成 Number 类型。
``` javascript
'3' * '4';
// 12
```
隐式类型转换会隐藏存在的问题
例如，对于用户在表单中输入的数字，通常 JS 拿到的都是字符串类型的，如果直接对这个值进行数值操作，JS 不会报错，而是会隐式地进行类型转换，会造成意想不到的问题。
``` javascript
var numberLikeString = document.getElementById('numberInput').value; // '100'
 
numberLikeString + 20
// '10020';
 
document.getElementById('numberInput').value = 100;
document.getElementById('numberInput').value
// '100'
```
常见的场景还有 jQuery 里的 `$.data()`。
``` html
<div id="test" data-a="123" data-b="1e10" data-c="0.1" data-d=".1" data-e="undefined" data-f="null" data-g="{x:1}" data-h="true">a div</div>
 
<script>
$('#test').data();
$('#test').data('i', '123');
$('#test').data();
</script>
```
参考：http://api.jquery.com/data/#data2

运算符中的隐式类型转换
``` javascript
[1, 2] + [3]
// 1,23
```

\+ 运算符
* 如果两边都是 Object, 则调用 `valueOf()` 或者 `toString()`>。 转换为基础类型。（顺序不一定，例如对 Date 类型，先使用 `toString()`）
* 如果其中一个运算符为 String，则将另一个转换为 String，然后返回字符串拼接的结果。
* 否则，两个运算数都转换为 Number。

`===` 和 `!==` 运算符
x `!== y` 和 `!(x === y)` 是等价的。如果是不同类型，则 `===` 始终为 `false`，`!==` 始终为 `true` 。否则：
* `undefined === undefined`
* `null === null`
* 两个 Number：`NaN !== NaN` `+0 === -0` `x === x`
* 两个 Object： 必须是同一个引用

`==` 和 `!=` 运算符
x `!= y` 和 `!(x == y)` 是不等价的。
* `undefined == null`
* 如果一个 String，一个 Number，则将 String 转换为 Number。
* 如果一个是 Boolean，一个是非 Boolean，则将 Boolean 转换为 Number，然后继续。
* 如果对象和 String 或 Number 比较，则现将对象转换为基础类型。

`<`、`>`、`<=`、`>=`
* 如果是对象，则先转换为基础类型。先调用 `valueOf()`，再调用 `toString()`。
* 如果两边都是 String，则按顺序比较16位字符编码。
* 否则两边都转换为 Number。