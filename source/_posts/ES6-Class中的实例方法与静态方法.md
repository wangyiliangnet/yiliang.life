---
title: ES6-Class中的实例方法与静态方法
date: 2016-12-28
tags:
    - ES6
    - Class
    - Babel
---
ES6中定义了Class语法糖，其中定义实例方法和静态方法写法如下：
``` javascript
class SampleClass {
  constructor() {
     this.instancePropertyInConstructor = 'instancePropertyInConstructor';
	
     this.instanceMethodInConstructor = function() {
      console.log(`instanceMethodInConstructor:${this.instancePropertyInConstructor}`);
     };
     
     this.instanceMethodBindingThisInConstructor = () => {
      console.log(`instanceMethodBindingThisInConstructor:${this.instancePropertyInConstructor}`);
     };
  }
 
  prototypeMethod() {
    console.log(this);
  }
  
  static staticProperty = 'staticProperty';
  
  static staticMethod() {
    console.log(this);
    console.log(this.staticProperty);
  }
  
  // 下面三种写法不是ES6规范中的语法，需要开启stage0才可以使用
  // 它们和在constructor中定义作用是相同的，如果两边定义了同名的属性或方法，constructor内的会后定义，从而覆盖constructor外的
  instancePropertyOutOfConstructor = 'instancePropertyOutOfConstructor'
  
  instanceMethodOutOfConstructor = function() {
    console.log(`instanceMethodOutOfConstructor:${this.instancePropertyOutOfConstructor}`);
  }
  
  instanceMethodBindingThisOutOfConstructor = () => {
    console.log(`instanceMethodBindingThisOutOfConstructor:${this.instancePropertyOutOfConstructor}`);
  }
}
```
 <!-- more -->
引入最后三种写法的主要目的是为了方便地定义instanceMethodBindingThis，这样在将这个方法传递给其它变量（例如子组件的props时）不需要通过闭包保存this，避免了每次render创建新的函数。
上面的代码通过Babel编译后是：
``` javascript
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SampleClass = function () {
  function SampleClass() {
    var _this = this;

    _classCallCheck(this, SampleClass);

    this.instancePropertyOutOfConstructor = 'instancePropertyOutOfConstructor';

    this.instanceMethodOutOfConstructor = function () {
      console.log('instanceMethodOutOfConstructor:' + this.instancePropertyOutOfConstructor);
    };

    this.instanceMethodBindingThisOutOfConstructor = function () {
      console.log('instanceMethodBindingThisOutOfConstructor:' + _this.instancePropertyOutOfConstructor);
    };

    this.instancePropertyInConstructor = 'instancePropertyInConstructor';

    this.instanceMethodInConstructor = function () {
      console.log('instanceMethodInConstructor:' + this.instancePropertyInConstructor);
    };

    this.instanceMethodBindingThisInConstructor = function () {
      console.log('instanceMethodBindingThisInConstructor:' + _this.instancePropertyInConstructor);
    };
  }

  SampleClass.prototype.prototypeMethod = function prototypeMethod() {
    console.log(this);
  };

  SampleClass.staticMethod = function staticMethod() {
    console.log(this);
    console.log(this.staticProperty);
  };

  return SampleClass;
}();

SampleClass.staticProperty = 'staticProperty';
```

[take a try](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Ces2015-loose%2Cstage-0)