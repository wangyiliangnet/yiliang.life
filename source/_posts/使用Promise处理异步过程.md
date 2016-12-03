---
title: 使用Promise处理异步过程
tags:
    - JavaScript
    - 异步
    - Promise
---
### 什么是Promise
Promise是一种编程模式或者编程思想，用来更好地处理异步过程。
在Promise之前，我们通常会使用回调函数来处理异步过程，例如有三个异步过程A、B、C，但它们需要依次执行，每一个过程都依赖上一个过程的结果，那么就需要把下一个过程作为回调函数传给上一个过程：
``` javascript
//执行第一个异步过程;
A(function (somethingFromA) {
    //执行第二个异步过程;
    B(somethingFromA, function (somethingFromB) {
        //执行第三个异步过程;
        C(someThingFromB);
    });
});
```
当回调层数增多时，代码就变得不那么清楚了。特别是在模块之间相互调用，同步和异步过程都有的时候，处理起来就非常麻烦。
![回调地狱](/assets/img/callback-hell.jpeg)
<!-- more -->
使用Promise可以这样写：
``` javascript
function A() {
    //do someting async;
    return Promise.resolve(result);
}

function B(sometingFromA) {
    //do someting async depending on something from A;
    return Promise.resolve(result);
}

function C(somethingFromB) {
    //do someting async depending on something from B;
    return result
}

A().then(B).then(C);
```
如果对异步过程加上错误处理，代码就更复杂了：
``` javascript
//执行第一个异步过程;
A(function (somethingFromA, error) {
    if(error){
        //deal with the error;
    }
    //执行第二个异步过程;
    B(somethingFromA, function (somethingFromB, error) {
        if(error){
            //deal with the error;
        }
        //执行第三个异步过程;
        C(someThingFromB);
    });
});
```
使用Promise进行错误处理：
``` javascript
function A() {
    if(somethingWrong){
        return Promise.reject(error);
    }
    //do someting async;
    return Promise.resolve(result);
}

function B(sometingFromA) {
    if(somethingWrong){
        return Promise.reject(error);
    }
    //do someting async depending on something from A;
    return Promise.resolve(result);
}

function C(somethingFromB) {
    if(somethingWrong){
        return Promise.reject(error);
    }
    //do someting async depending on something from B;
    return result
}

A().then(B).then(C).catch(function (error) {
    //deal with the error;
});
```
更多Promise的具体语法，参考 http://liubin.org/promises-book/。
在实际应用中，我们会遇到一些问题。例如使用我们无法修改的第三方代码，比方说上面的函数B是第三方的代码，要如何将其Promise化：
首先，我们通常会知道这个函数B是同步还是异步的，如果是异步函数一般都需要我们传一个回调作为参数。
如果函数B是同步的，对它进行一次封装：
``` javascript
var B = function () {
    return Promise.resolve(B());
}
```
如果函数B是异步的，则返回一个promise，在B的回调里resolve这个promise：
``` javascript
var B = function () {
    return new Promise(function (resolve, reject) {
        B(function (somethingFromB ){
            resolve(someThingFromB);
        })
    });
}
```
Promise还有一个很重要的功能，就是进行流程控制。还是用上面的A、B、C来举例，A、B之间相互独立，C依赖A和B两个的结果，假如A、B都返回promise，则可以这样写：
``` javascript
Promise.all([A(), B()]).then(function (result) {
    var somethingFromA = result[0],
        somethingFromB = result[1];

    C(somethingFromA, somethingFromB);
});
```
### Promise里一些关键概念
##### Promise.resolve、Promise.reject和new Promise:
``` javascript
var a = 21;

//以下两种写法等效
Promise.resolve(a);

new Promise(function (resolve, reject) {
    resolve(a);
});

//以下两种写法等效
Promise.reject(a);

new Promise(function (resolve, reject) {
    reject(a);
});
```
##### resolve或者reject的是promise，以resolve为例：
``` javascript
var promise21 = Promise.resolve(21);
//promise21是promise;

Promise.resolve(promise).then( function(result) {
    //这里得到的result是21而不是promise21;
    console.log(result);
    //21
});
```
promise的resolve方法会对参数进行处理，假设参数为p：
如果p是promise，则不会直接resolve p本身，而是resolve了p所resolve的结果，否则，直接resolve p。
通过这种方式，可以对同步和异步过程进行统一处理，而不需要区分是否异步。
##### promise.then会返回一个新的promise，因此可以连续使用then，在resolve或者reject的handle函数里返回值将被当做改promise的resolve值：
``` javascript
//return非promise;
Promise.resovle(21)
    .then(function (result) {
        return result * 2;
    })
    .then(function (result) {
        console.log(result);
        //42;
    });

//return一个promise; 会将该promise的作为下一个then的起点，也就是将该promise的resolve或者reject的值作为下一个then的resovle或者reject的参数
Promise.resovle(21)
    .then(function (result) {
        return Promise.resolve(result * 3);
    })
    .then(function (result) {
        console.log(result);
        //63;
    });

//当返回一个reject的promise：
Promise.resovle(21)
    .then(function (result) {
        return Promise.reject(result * 2);
    })
    .then(
        function (result) {
            console.log(result);
            //不会执行;
        },
        function (result) {
            console.log(result);
            //42;
        }
    );

//注意下面两种写法的区别：
//写法1：
var promise21 = Promise.resolve(21);

promise21.then(function (result) {
    console.log(result);
    return result * 2;
});

promise21.then(function (result) {
    console.log(result);
    return result + 1;
});

//21
//22

//写法2：
var promise21 = Promise.resolve(21);

promise21
    .then(function (result) {
        console.log(result);
        return result * 2;
    })
    .then(function (result) {
        console.log(result);
        return result + 1;
    });

//21
//42
```
现在为止，浏览器原生支持Promise的情况如下：
![回调地狱](/assets/img/promise-support.png)

除了IE，别的支持的都很好。就算需要考虑IE，也可以解决：
1. 使用polyfill库，像虚拟体验馆在用的RSVP，就实现了标准的Promise，可以兼容IE8；
2. 使用其他工具库，许多工具库都内置了部分Promise功能，像jQuery，就用有Deffered对象，可以实现Promise的大部分功能；

具体可以参考：
https://github.com/tildeio/rsvp.js
http://api.jquery.com/category/deferred-object/
