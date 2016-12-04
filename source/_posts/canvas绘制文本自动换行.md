---
title: canvas绘制文本自动换行
date: 2016-12-04
tags:
    - canvas
    - 文本
    - 自动换行
---
最近有这样一个需求，使用一个第三方的库绘制弹窗，但是第三方库不支持输入文字，只能使用图片。所以需要把文字画在canvas上，再导出成data-url。因为文本是有格式的，并且长度不定。在canvas上绘制文字需要手动去处理换行。

canvas上提供了API用来测量文本的长度：
``` javascript
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.font="14px 微软雅黑";
    
var width = context.measureText('test width of the text').width;
    
console.log(width);
```

于是想到使用二分查找来寻找换行点：<!-- more -->
``` javascript
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.font="20px 微软雅黑";
    
function findBreakPoint (text, width) {
  var min = 0;
  var max = text.length - 1;
    
  while (min <= max) {
    var middle = Math.floor((min + max) / 2);
    var middleWidth = context.measureText(text.substr(0, middle)).width;
    var oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
    
    if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
      return middle;
    }
    if (middleWidth < width) {
      min = middle + 1;
    } else {
      max = middle - 1;
    }
  }
    
  return -1;
}
```
使用很寻常的二分查找，如果某一个位置之前的文字宽度小于等于设定的宽度，并且它之后一个字之前的文字宽度大于设定的宽度，那么这个位置就是文本的换行点。

上面只是找到一个换行点，对于输入的一段文本，需要循环查找，直到不存在这样的换行点为止, 完整的代码如下：
``` javascript
function findBreakPoint (text, width, context) {
    var min = 0;
    var max = text.length - 1;
    
    while (min <= max) {
        var middle = Math.floor((min + max) / 2);
        var middleWidth = context.measureText(text.substr(0, middle)).width;
        var oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;

        if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
            return middle;
        }
        if (middleWidth < width) {
            min = middle + 1;
        } else {
            max = middle - 1;
        }
    }
    
    return -1;
}

function breakLinesForCanvas (text, width, font) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var result = [];
    var breakPoint = 0;
    
    if (font) {
        context.font = font;
    }
    
    while ((breakPoint = findBreakPoint(text, width)) !== -1) {
      result.push(text.substr(0, breakPoint));
      text = text.substr(breakPoint);
    }
    
    if (text) {
        result.push(text);
    }
    
    return result;
}
```