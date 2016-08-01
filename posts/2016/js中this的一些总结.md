>this 是 Javascript 语言的一个关键字。它代表函数运行时，自动生成的一个内部对象，只能在函数内部使用。

>在绝大多数情况下，函数的调用方式决定了 this 的值，this不能在执行期间被赋值。

>随着函数使用场合的不同，this 的值会发生变化。但是有一个总的原则，那就是 this 指向总是调用函数的那个对象。

下文绝大部分都是来自[this - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this),只做了点微小的工作，谢谢大家。

## 一、全局上下文

在全局运行上下文中（在任何函数体外部），this 指代全局对象，无论是否在严格模式下。
```javascript
console.log(this.document === document); // true

// 在浏览器中，全局对象为 window 对象：
console.log(this === window); // true

this.a = 37;
console.log(window.a); // 37
```

## 二、函数上下文

在函数内部，this的值取决于函数是如何调用的。

### 1、直接调用
```javascript
function f1() {
  return this;
}

f1() === window; // true
```
在严格模式下，this 是在进入运行环境时设置的。若没有定义，this的值将维持undefined状态。同时它也能设置成任意值，比如 null 或 Number、String 等其他类型的值。
注意：部分老旧浏览器对于这个严格模式的实现不一。

### 2、对象方法中的 this
（1）当以对象里的方法的方式调用函数时，此时 this 指向调用该函数的对象。举个栗子：
```javascript
var shiba = {
    likes: 'bones',
    eat: function () {
        return this.likes;
    }
};

shiba.eat(); // "bones"
```

（2）同时，在何处定义调用函数完全不会影响到this的行为。再举个栗子。
```javascript
var shiba = {
    likes: 'bones',
    eat: eatSomething
};

function eatSomething() {
    return this.likes;
}

shiba.eat(); // "bones",此时调用 eatSomething 的是 shiba 这个狗对象
eatSomething(); // undefined,此时调用 eatSomething 的是 window ,见本文章 “一、全局上下文” 内容
```

（3）this 的绑定只受最靠近的成员引用的影响，总结就是就近原则。举个更加奇特的栗子
```javascript
var dog = {
    likes: 'something...',
    eat: eatSomething,
    shiba: {
        likes: 'bones',
        eat: eatSomething
    }
};

function eatSomething() {
    return this.likes;
}

dog.eat(); // "something..."
dog.shiba.eat(); // "bones"
```

（4）原型链中的 this 表现一致，依然是指向调用的对象和就近原则。
```javascript
var dog = {
    eat: function () {
        return this.likes;
    }
};

var shiba = Object.create(dog);
shiba.likes = 'bones';

shiba.eat(); // "bones"
```
这个例子中 shiba 狗的 eat 方法来自于 dog 的继承。`shiba.eat` 的执行是从 shiba 对象开始的，this 指向也就不言而喻了。

（5）getter 与 setter 中的 this 也同样适用，作为getter或setter函数都会绑定 this 到从设置属性或得到属性的那个对象。
```javascript
function modulus(){
  return Math.sqrt(this.re * this.re + this.im * this.im);
}

var o = {
  re: 1,
  im: -1,
  get phase(){
    return Math.atan2(this.im, this.re);
  }
};

Object.defineProperty(o, 'modulus', {
  get: modulus, enumerable:true, configurable:true});

console.log(o.phase, o.modulus); // logs -0.78 1.4142
```

### 3、构造函数中的 this
当一个函数被作为一个构造函数来使用（使用 new 关键字），它的 this 与即将被创建的新对象绑定。
同时，构造器的默认返回值是当前 this 引用的对象。同时可以手动设置返回其他对象，如果返回值不是一个对象，则默认返回 this 引用的对象。
```javascript
function dog(likes) {
    this.likes = likes;
}

var shiba = new dog('bones');
shiba.likes; // "bones"

function dog2(likes) {
    this.likes = likes;
    return {
        likes: '我就不喜欢吃骨头'
    };
}

shiba = new dog2('bones');
shiba.likes; // "我就不喜欢吃骨头"。手动的设置了返回对象，与this绑定的默认对象被取消
```

### 4、call 和 apply
当一个函数的函数体中使用了 this 关键字时，通过所有函数都从 Function 对象的原型中继承的 call() 方法和 apply() 方法调用时，它的值可以绑定到一个指定的对象上。
同时，如果传递的 this 值不是一个对象，JavaScript 将会尝试使用内部 ToObject 操作将其转换为对象。
```javascript
function eatSomething(arg) {
    return this.likes + arg + '';
}

var shiba = {likes: 'bones'};

eatSomething.call(shiba, '233'); // "bones233"
eatSomething.apply(shiba, ['666']); // "bones666"
```

### 5、bind 方法
ECMAScript 5 引入了 [Function.prototype.bind](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Function/bind)。调用 fn.bind(someObject) 方法会创建并返回一个与 fn 具有相同函数体和作用域的函数，但是在这个新函数中，this 将永久地被绑定到了 bind 的第一个参数，无论这个函数是如何被调用的。
```javascript
function eatSomething() {
    return this.likes;
}

var dogEat = eatSomething.bind({likes: 'bones'});
dogEat(); // "bones"

var shiba = {
    likes: '我就不喜欢吃骨头',
    eat: dogEat
};

shiba.eat(); // "bones"
```
其中 shiba 对象，如图：
![shiba狗](/posts/assets/imgs/this-in-js-2.png)

### 6、ES6 中的箭头函数（Arrow Functions）中的 this
>箭头函数就是个简写形式的函数表达式，并且它拥有词法作用域的this值（即不会新产生自己作用域下的this, arguments, super 和 new.target 等对象）。此外，箭头函数总是匿名的。
>箭头函数不仅仅是让代码变得简洁，函数中 this 总是绑定总是指向对象自身。

```javascript
// 一个空箭头函数,返回 undefined
let empty = () => {};

(() => "foobar")() // 返回 "foobar" 

var simple = a => a > 15 ? 15 : a; 
simple(16); // 15
simple(10); // 10

let max = (a, b) => a > b ? a : b;

// Easy array filtering, mapping, ...

var arr = [5, 6, 13, 0, 1, 18, 23];
var sum = arr.reduce((a, b) => a + b);  // 66
var even = arr.filter(v => v % 2 == 0); // [6, 0, 18]
var double = arr.map(v => v * 2);       // [10, 12, 26, 0, 2, 36, 46]
```

### 7、DOM事件处理函数中的 this
当函数被用作事件处理函数时，它的 this 指向触发事件的元素（一些浏览器在动态添加监听器时不遵守这个约定，除非使用 addEventListener ）。
```javascript
// 被调用时，将关联的元素变成蓝色
function bluify(e){
  console.log(this === e.currentTarget); // 总是 true

  // 当 currentTarget 和 target 是同一个对象是为 true
  console.log(this === e.target);        
  this.style.backgroundColor = '#A5D9F3';
}

// 获取文档中的所有元素的列表
var elements = document.getElementsByTagName('*');

// 将bluify作为元素的点击监听函数，当元素被点击时，就会变成蓝色
for(var i=0 ; i<elements.length ; i++){
  elements[i].addEventListener('click', bluify, false);
}
```

### 8、内联事件处理函数中的 this
当代码被内联处理函数调用时，它的this指向监听器所在的DOM元素
```html
<button onclick="console.log(this)">
  Show this
</button>
```



