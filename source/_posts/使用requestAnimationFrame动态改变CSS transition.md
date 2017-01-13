---
title: 使用requestAnimationFrame动态改变CSS transition
date: 2017-01-13
tags:
    - requestAnimationFrame
    - transition
---
我们知道通过添加`transition`属性，可以使得元素上指定的属性变化时，应用过渡动画。
例如对`transform`添加的动画：
``` html
<div id="el"></div>
<style>
#el {
    width: 100px;
    height: 100px;
    transform: translate3d(100%, 0, 0);
    transition: transform 1s;
}
#el.show {
    transform: translate3d(0, 0, 0);
}
</style>
```
<!-- more -->
遇到的问题是，希望在某个时刻改变`#el`元素的transform值，而不希望应用过渡动画，在改变完成之后又需要立即为它加上`transition`。
例如这样的使用场景：
``` html
<div id="el"></div>
<style>
// 默认横屏状态下元素从屏幕右侧滑出
#el {
    width: 100px;
    height: 100px;
    transform: translate3d(100%, 0, 0);
    transition: transform 1s;
}
#el.show {
    transform: translate3d(0, 0, 0);
}
// 在竖屏时元素从下侧滑出
@media all and (orientation: portrait) {
    #el {
        transform: translate3d(0, 100%, 0);
    }
}
</style>
```
当用户转动移动设备时，由于媒体查询，使得元素的`transform`从`translate3d(100%, 0, 0)`变到了`translate3d(0, 100%, 0)`。它会从屏幕中间斜向滑过，不是理想的体验。
所以需要做的是，在设备方向改变时移出动画，在媒体查询的属性应用之后再加上动画。
一开始使用的方法是`setTimeout`。
``` javascript
$(window).on(this._getEventWithNs('orientationchange'), () => {
    const transitionValue = this.$ele.css('transition');
    this.$ele.css({
        transition: 'none',
        '-webkit-transition': 'none'
    });
 
    // 因为元素应用新的属性值需要时间，如果定时过短，还是会有上面的情况出现，测试发现500ms稳定不会出现
    setTimeout(() => {
        this.$ele.css({
            transition: transitionValue,
            '-webkit-transition': transitionValue
        });
    }, 500);
});
```
但一方面这个写法太hack，定时比较随意，另一方面可能'transition'加上的太晚，会导致意想不到的问题。
于是找到另一个办法：`requestAnimationFrame`
`requestAnimationFrame`会在页面渲染下一帧时调用，而这一时刻可以保证元素已经应用了新的属性值，并且是最快的情况。
``` javascript
const requestAnimationFrame = window.requestAnimationFrame window.webkitRequestAnimationFrame;
 
$(window).on(this._getEventWithNs('orientationchange'), () => {
    const transitionValue = this.$ele.css('transition');
    this.$ele.css({
        transition: 'none',
        '-webkit-transition': 'none'
    });
    requestAnimationFrame(() => {
        this.$ele.css({
            transition: transitionValue,
            '-webkit-transition': transitionValue
        });
    });
});
```
也考虑过别的办法，例如使用`animation`，但是需要加上额外的状态:
初始状态：没有`animation`
开启状态：`animation`为打开动画
关闭状态: `animation`为关闭动画