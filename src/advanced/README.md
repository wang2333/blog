---
title: 前端进阶
icon: fab fa-js
sticky: 1
category:
  - 前端进阶
tag:
  - js 进阶
---

前端进阶是指深入学习和应用前端技术的过程。它包括对 JavaScript 的深入理解以及浏览器和网络基础知识。

<!-- more -->

## js 基础

### 垃圾回收（GC）

1. 引用计数法: js 引擎会跟踪每个对象有多少其他对象引用它,如果引用计数为 0 则该对象可以被回收。但这种方法无法解决循环引用的问题。
2. 标记清除算法: js 引擎会跟踪可以被访问的对象,它会标记所有可访问对象,然后清除未被标记的对象。具体是从根对象(比如全局对象、定时器等)开始跟踪,然后逐层向下跟踪它引用的对象,最后清除未被标记的对象。

::: tip 内存泄露场景

- 全局变量:如果一个变量长期保持在全局作用域中未被释放,就可能导致内存泄露。
- 闭包:函数内部使用了外层作用域的变量且函数本身存在的时间比较长,这样外层变量就无法被垃圾回收。
- DOM 引用:DOM 元素长期保持对 JS 对象的引用,两者将共同被缓存无法释放。
- 定时器和回调函数:如果这些函数内部引用了外层变量且未清理引用,外层变量也将被长期锁定。
- 事件监听器:大量添加在 DOM 上的事件处理函数如果相互引用也可能导致内存泄露。
- 错误处理缺陷:发生错误但未正确清除错误状态下声明的变量也会引起内存泄漏。
- 缓存对象:对象长期保存在缓存中但未正确移除将占用额外内存。
- iframe 元素:长期保存对 iframe 的引用也同样有泄露内存的风险。

:::

### 变量类型

1. 值类型：Number、String、Boolean、null、undefined、Symbol、BigInt
2. 引用类型：
   - Object:对象类型,自定义的引用类型数据。构造函数创建的引用类型对象都属于这一类。
   - Array:数组类型,用来存储多个值的特殊对象。
   - Function:函数类型,可以定义方法和回调函数。
   - Date:日期时间类型,操作与表示日期的对象。
   - RegExp:正则表达式类型,定义字符匹配模式的类型。
   - Error:错误类型,表示运行时错误和异常状况。
   - Promise: ES6 引入的异步处理对象。
   - Set/Map: ES6 引入的新数据结构,替代数组的容器。
   - WeakSet/WeakMap:内存管理中的弱引用集合类型。

::: tip 值类型和引用类型的区别

- 存储位置不同,简单类型值在栈,引用类型对象在堆
- 比较方式不同,简单类型通过值比较,引用类型通过内存地址比较
- 行为不同,引用类型可以继承和共享,简单类型不可以
- 能力不同,引用类型用于处理复杂数据结构

:::

### 类型判断

#### typeof

只能判断基本类型和函数,对象类型无法明确判断

```js
typeof undefined; // "undefined"
typeof 123; // "number"
typeof 'abc'; // "string"
typeof true; // "boolean"
typeof function () {}; // "function"
typeof { name: 'john' }; // "object"
typeof [1, 2, 3]; // "object"
typeof null; // "object"
```

#### instanceof

语法: `object instanceof constructor`
用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
仅适用于对象类型,基本类型不能使用。

```js
function Person() {}
var person = new Person();

person instanceof Person; // true
person instanceof Object; // true

[1, 2, 3] instanceof Array; // true

var date = new Date();
date instanceof Date; // true
```

#### Object.prototype.toString

语法: `Object.prototype.toString.call(object)`
这个方法会返回一个字符串,格式是"[object type]",其中 type 表示对象的类型。

1. 使用 Object.prototype.toString 来取得原始的 toString 函数，避免原型重写或无原型。
2. 使用 call 将要检测的对象 obj 作为上下文传入。

- 对象: `[object Object]`
- 数组: `[object Array]`
- 函数: `[object Function]`
- 日期: `[object Date]`
- 字符串: `[object String]`
- 布尔值: `[object Boolean]`
- 数值: `[object Number]"`
- undefined: `[object Undefined]`
- null: `[object Null]`

::: tip 为什么要使用 call 来调用函数？
这个函数是无参数的，只涉及上下文 this，当我们把他作为“检测对象类型”的工具使用时，他检测的实际上是上下文 this 的类型。
:::

### 隐式转换

- 加法运算符运算中其中一方为字符串，那么就会把另一方也转换为字符串；如果一方不是字符串或者数字，那么会将它转换为数字或者字符串
- 对于除了加法的运算符来说，只要其中一方是数字，那么另一方就会被转为数字

```js
1 + 1; // 2
1 + '1'; // '11'
true + '1'; // 'true1'
true + true; // 2
undefined + 1; // "NaN"  undefined转换为数值时为NaN
4 + [1, 2, 3]; // "41,2,3"

4 * '3'; // 12
4 * []; // 0
```

::: tip 条件判断类型转换
在条件判断时，除了 undefined，null，false，NaN，''，0，-0，其他所有值都转为 true，包括所有对象。
:::

### 浅拷贝、深拷贝

1. 浅拷贝: 只克隆第一层属性,如果属性中引用了其他对象,那么只复制对象的引用。

- 数组的拷贝: `arr1 = arr2.slice()`
- 对象的拷贝: `obj1 = {...obj2}`

2. 深拷贝: 对数组和对象所有属性(包含子属性对象)进行真实克隆:

```js
function deepClone(obj) {
  // 判断null使用 == ，相当于=== null、=== undefined
  if (typeof obj !== 'object' || obj == null) return obj;
  let result = obj instanceof Array ? [] : {};
  for (const key in obj) {
    // 保障key不是原型上的属性
    if (obj.hasOwnProperty(key)) {
      // 深层级的数据递归
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
}
```

### 原型和原型链

- 每个对象都有 `__proto__` 属性，但只有函数对象才有 prototype 属性
- 原型对象（即 People.prototype）的 constructor 指向构造函数本身
- 所有对象的 `__proto__` 都指向其构造函数的 prototype
- class 实际上是函数，是语法糖

```js
typeof People; // 'function'
typeof Student; // 'function'
typeof xiaowang; // 'object'

xiaowang.constructor = Student;
Student.prototype.constructor = Student;
People.prototype.constructor = People;

xiaowang.__proto__ = Student.prototype;
Student.__proto__ = People;
People.__proto__ = Function.prototype;

Student.prototype.__proto__ = People.prototype;
```

### new 操作符

```js
function mynew(Func, ...args) {
  // 1.创建一个新对象
  const obj = {};
  // 2.新对象原型指向构造函数原型对象
  obj.__proto__ = Func.prototype;
  // Object.setPrototypeOf(obj, Func.prototype)
  // 3.将构建函数的this指向新对象
  let result = Func.apply(obj, args);
  // 4.根据构建函数返回类型作判断，如果是原始值则被忽略，如果是返回对象，需要正常处理
  return result instanceof Object ? result : obj;
}
```

### 继承

1. 原型链继承: 使用原型链来实现继承。子类型的原型是父类型的实例。

```js
function Parent() {}
function Child() {}
Child.prototype = new Parent();
```

2. 构造函数继承: 在子类型构造函数中调用父类型构造函数。

```js
function Parent() {}
function Child() {
  Parent.call(this);
}
```

3. 组合继承: 结合原型链和构造函数继承的方法,使子类型都有实例属性,同时可继承原型属性和方法。

```js
function Parent() {}
function Child() {
  Parent.call(this);
}
Child.prototype = new Parent();
```

4. 原型式继承: 通过已有对象来设置另一个对象的原型。

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
```

5. ES6 继承类

```js
class Parent {}
class Child extends Parent {}
```

### 作用域

- 全局作用域
- 函数作用域
- 块级作用域
- with 作用域

### 自由变量

- 声明在函数外部的变量,在函数内部可以直接访问,这些变量称为自由变量。
- 自由变量属于外层作用域,在函数内部它们实际上是“固定”的,不会随着运行环境的改变而改变。

```js
// x 是外层作用域中的变量
let x = 1;
function test() {
  console.log(x); // x 是自由变量
}
test(); // 1
```

> 所有的自由变量的查找，是在函数定义的地方向上级作用域查找，不是在执行的地方

```js
const a = 100;
function print() {
  const a = 200;
  return function () {
    console.log(a);
  };
}
const fn = print();
fn(); // 200

const a = 100;
function fn() {
  console.log(a);
}
function print(fn) {
  const a = 200;
  fn();
}
print(fn); // 100
```

### 闭包

- 闭包是可以访问另一个函数作用域中的变量的函数。
- 当一个内部函数引用包含它的外部函数的参数或局部变量时,就产生了闭包。
- 闭包 = 函数 + 函数能够访问的自由变量

```js
function outer() {
  let a = 1;
  return function inner() {
    console.log(a);
  };
}

let innerFn = outer();
innerFn(); // 1
```

:::tip 闭包带来的影响

- 允许你从内部函数访问到外部函数作用域内的变量。
- 会修改引用类型变量值的状态。
- 可能会产生内存泄漏,如果闭包持有的引用无法及时释放。

:::

### this

- 函数里面的 this 总是指向直接调用者。如果没有直接调用者，隐含的调用者是 window。
- 使用 call() 和 apply()方法可以显式地指定函数的 this 值。
- 使用了 new 操作符之后，构造函数中的 this 指的是实例对象。
- 箭头函数中的 this 始终是该箭头函数所在作用域中的 this；普通函数中的 this 是动态绑定的，始终指向函数的执行环境

```js
function fn() {
  console.log(this);
}
fn(); // Window

fn.call({ a: 1 }); // {a: 1}

const obj = {
  name: 'obj',
  fn1: function () {
    console.log(this);
  },
  fn2: () => {
    console.log(this);
  }
};
obj.fn1(); // obj
obj.fn2(); // Window

class People {
  fn() {
    console.log(this);
  }
}
const a = new People();
a.fn(); // People
```

### call 的模拟实现

```js
Function.prototype.call1 = function (context) {
  // context为可选参数，如果不传的话默认上下文是window
  const ctx = context || window;
  // 接下来给 context 创建一个 fn 属性，并将值设置为需要调用的函数
  const fnKey = Symbol();
  ctx[fnKey] = this;
  // 因为 call 可以传入多个参数作为调用函数的参数，所以需要将参数剥离出来
  const args = [...arguments].slice(1);
  // 然后调用函数并将对象上的函数删除
  const result = ctx[fnKey](...args);
  delete ctx[fnKey];
  return result;
};

getName.call(null, { name: 'xiaowang' });
```

### bind 的模拟实现

```js
Function.prototype.bind1 = function () {
  // 将参数拆分为数组
  const args = [...arguments];
  // 获取this （数组第一项）
  const t = args.shift();
  //  bind函数的调用者
  const self = this;
  return function () {
    return self.apply(t, args);
  };
};
```

### 防抖

> 限制执行次数，多次密集的触发只执行一次（关注结果）

```js
function debounce(fn, delay) {
  // timer 闭包变量
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    // 使用箭头函数，已获取外出函数的arguments
    timer = setTimeout(() => {
      // fn() 直接调用时，事件执行是无法获取到事件对象e
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}
```

### 节流

> 限制执行频率，有节奏的执行（关注过程）

```js
function throttle1(fn, delay) {
  let timer;
  return function () {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}

function throttle2(fn, delay) {
  let date = new Date().getTime();
  return function () {
    let now = new Date().getTime();
    if (now - date < delay) return;
    fn.apply(this, arguments);
    date = new Date().getTime();
  };
}
```

### 异步

JS 中的异步主要通过回调函数和 Promise 来实现。

回调函数:

- 将任务的第二段单独写在一个函数(回调函数)中,等到重新执行的通知发生后,再调用该函数执行任务。
- 典型的异步任务:定时器、Ajax、事件监听等。

Promise:

- 可以将异步操作队列化,按照期望的顺序执行,返回承诺过的值。
- Promise 有三种状态:Pending(进行中)、Resolved(已完成,又称 Fulfilled)和 Rejected(已失败)。
- 使用 then、catch、finally 等方法获取 Promise 的结果。

async/await:

- async/await 是异步编程的语法糖,可以更简单地写异步代码,像写同步代码一样。
- async 声明一个异步函数,await 等待一个异步函数返回 Promise 结果。

### 事件队列

任务队列分为宏任务队列(macrotask queue)和微任务队列(microtask queue)。
主线程执行的时候,会从任务队列中取出任务执行。遵循以下顺序:

1. 执行一个宏任务(栈空)
2. 执行过程中如果遇到微任务,就将它添加到微任务队列
3. 执行所有的微任务(栈空)
4. 开始下一个宏任务

常见的宏任务包括: script, setTimeout, setInterval, I/O, UI rendering。
常见的微任务包括: Promise, Object.observe, MutationObserver。

## 浏览器

### DOM 本质

DOM 本质是一课树。浏览器把拿到的 HTML 代码，解析成为一个浏览器可识别并且 js 可操作的一个树模型。

### DOM 节点操作

1. 获取 DOM 节点

```js
// 根据id获取
const div1 = document.getElementById('div1'); //元素
// 根据标签获取
const divList = document.getElementsByTagName('div'); //集合
// 根据类名获取
const conList = document.getElementsByClassName('.con'); //集合
// 通过css选择器获取
const pList = document.querySelectorAll('p'); //集合
```

2. DOM 节点的 property

DOM 节点的 property 是指可以获取 DOM 元素，通过 JS 的属性操作的形式

```js
const pList = document.querySelectorAll('p');
const p = pList[0];
console.log(p.style.width); //获取样式
p.style.width = '100px'; //修改样式
console.log(p.className); //获取class
p.className = 'p1'; //修改 class
console.log(p.nodeName); // p 节点名称
console.log(p.nodeType); //1 节点类型 1 元素节点 2属性节点
```

3. DOM 节点的 attribute

DOM 节点的 attribute 通过 setAttribute()、getAttribute()直接修改 html 标签的结构和属性

```js
const pList = document.querySelectorAll('p');
const p = pList[0];
p.setAttribute('data-name', 'imooc');
p.getAttribute('data-name');
p.setAttribute('style', 'font-size:30px');
p.getAttribute('style');
```

::: tip property 和 attribute 区别

- property：是对 DOM 元素的 JS 变量做修改。修改对象属性，不会体现到 html 结构中.
- attribute：对 DOM 元素的节点属性做修改。修改 html 属性，会改变 html 结构.
- 两者都会引起 DOM 结构重新渲染

:::

### DOM 重排和重绘

- 重排(Reflow)：当渲染树的一部分必须更新并且节点的尺寸发生了变化，浏览器会使渲染树中受到影响的部分失效，并重新构造渲染树。
- 重绘(Repaint)：是在一个元素的外观被改变所触发的浏览器行为，浏览器会根据元素的新属性重新绘制，使元素呈现新的外观。比如改变某个元素的背景色、文字颜色、边框颜色等等

> 重绘不一定需要重排（比如颜色的改变），重排必然导致重绘（比如改变网页位置）

### DOM 性能优化

1. 对元素进行移动时，使用 transform 替代对元素 top、left、right 的操作，因为 css3 的整个操作是对图层的组合来实现的，所以不会引发重绘重排。
2. 将多次对样式的操作合并成一次。不要一次一次的修改样式，而是预先定义好 class，直接修改 DOM 的 className，这样只会引发一次重排重绘。
3. 将 dom 离线后修改。如果要对 dom 元素进行多次操作，首先将 dom 设置为不可见，然后再对 dom 操作，操作完成后再将 dom 元素设置为可见，这样只会有两次重排重绘。
4. 利用文档碎片 documentFragment。

### window 对象

window 对象表示浏览器的一个实例，这就意味着全局作用域中声明的变量、函数都会变成 window 对象的属性和方法。

子对象

- history（包含浏览器访问过的 url）
- location（包含当前 url 的相关信息）
- navigator（包含浏览器信息）
- frames（包含当前页面所有的框架信息）
- screen（包含当前显示屏信息）

### URLSearchParams

> 提供对 URL 查询的读写访问。它可以对查询字符串进行解析，从而你可以轻松的获取到其中的数据。

```js
const params = new URLSearchParams(location.search);
console.log(params.get('name'));
```

### 事件绑定

```js
<button id="btn">按钮</button>
<script>
  var button = document.getElementById("btn");
  button.addEventListener('click',event=>{console.log(event)},false )
  // 参数三可选，true - 事件在捕获阶段执行，false - 事件在冒泡阶段执行，默认是false
</script>
```

- event 对象
  event 对象由事件自动创建，记录了当前事件的状态，如事件发生的源节点、键盘按键的响应状态、鼠标指针的移动位置、鼠标按键的响应状态等信息。event 对象的属性提供了有关事件的细节，其方法可以控制事件的传播。

- event 对象属性
  | 属性 | 说明 |
  | :-: | :- |
  | type | 返回当前 event 对象表示的事件的名称。如“submit”、“load”或“click” |
  | target | 返回事件的目标节点（触发该事件的节点），如生成事件的元素、文档或窗口 |
  | currentTarget | 返回触发事件的当前节点，即当前处理该事件的元素、文档或接口。在捕获和冒泡阶段，该属性时非常有用的，因为在这两个阶段，它不同于 target 属性 |
  | timeStamp | 返回事件生成的日期和时间 |
  | eventPhase | 返回事件传播的当前阶段，包括捕获阶段（1）、目标事件阶段（2）和冒泡阶段（3） |
  | bubbles | 返回布尔值，指示事件是否是冒泡事件类型。如果事件时冒泡类型，则返回 true；否则返回 false |
  | cancelable | 返回布尔值，指示事件是否可以取消的默认动作。如果使用 preventDefault() 方法可以取消与事件关联的默认动作，则返回值为 true；否则为 false |
- event 对象方法
  | 方法 | 说明 |
  | :-: | :- |
  | initEvent() | 初始化新创建的 event 对象的属性 |
  | preventDefault() | 通知浏览器不要执行与事件关联的默认动作 |
  | stopPropagation() | 终止事件在传播过程的捕获、目标处理或冒泡阶段进一步传播。调用该方法后，该节点上处理该事件的处理函数将被调用，但事件不再被分派到其他节点 |

### 事件冒泡

当一个事件发生在一个元素上，它会首先运行在该元素上的处理程序，然后运行其父元素上的处理程序，然后一直向上到其他祖先上的处理程序。

```js
<form id="form">
  <div id="div">
    <p id="p"></p>
  </div>
</form>

<script>
form.onclick = function(event) {
 console.log(event.currentTarget)
};
div.onclick = function(event) {
 console.log(event.currentTarget)
};
p.onclick = function(event) {
 console.log(event.currentTarget)
};
// p点击时，target为<p/>，打印顺序为<p/>,<div/>,<form/>
</script>
```

### 事件代理

```js
// 通用的事件绑定函数
function bindEvent(ele, type, selector, fn) {
  if (fn == null) {
    fn = selector;
    selector = null;
  }
  ele.addEventListener(type, e => {
    let target = e.target;
    if (selector) {
      // 需要添加事件代理
      if (target.matches(selector)) {
        fn.call(target, event);
      }
    } else {
      //  不需要添加事件代理
      fn.call(target, event);
    }
  });
}

bindEvent(body, 'click', 'a', function (e) {
  console.log(e, this);
});
```

## 网络

### Ajax

```js
function newAjax(url, handle) {
  // 1,创建对象
  let xhr = new XMLHttpRequest();
  // 2，创建http请求,true表示异步
  xhr.open('GET', url, true);
  // 3，设置状态监听函数
  xhr.onreadystatechange = function () {
    if (this.readyState !== 4) return;
    if (this.status === 200) {
      handle(this.response);
    } else {
      console.error(this.statusText);
    }
  };
  // 设置请求失败时的监听函数
  xhr.onerror = function () {
    console.error(this.statusText);
  };
  // 设置请求头信息
  xhr.responseType = 'json';
  xhr.setRequestHeader('Accept', 'application/json');
  // 发送请求
  xhr.send();
}
```

- readyState 状态码
  | 值 | 说明 |
  | :-: | :- |
  | 0 | 代理被创建，但尚未调用 open() 方法。|
  | 1 | open() 方法已经被调用。 |
  | 2 | send() 方法已经被调用，并且头部和状态已经可获得。|
  | 3 | 下载中，responseText 属性已经包含部分数据。|
  | 4 | 下载操作已完成。 |

### Fetch

浏览器原生提供的对象。方法返回一个 Promise 对象，是 XMLHttpRequest 的升级版。

```js
let promise = fetch(url, [options]);
```

::: tip Ajax Axios Fecth 区别

- Ajax，一种技术统称
- Axios，第三方库
- Fetch，浏览器的原生 API

:::

### 跨域

出于浏览器的同源策略限制。 当一个请求 url 的协议、域名、端口三者之间的任意一个与当前页面 url 不同即为跨域。

- 加载图片、css、js 无视同源策略
- `<img/>` 可用于统计打点，可使用第三方统计服务
- `<link/>` `<script/>` 可使用 CDN ，CDN 一般都是外域
- `<script/>` 可实现 JSONP
  - 前端定义一个解析函数，例如 jsonpCallback=function（res）{}
  - 通过 params 的形式包装 script 的请求参数，并且声明执行函数（如 cb=jsonpCallback）
  - 后端获取到前端声明的执行函数（jsonpCallback），并以携带参数并且调用执行函数的方式传递给前端
  - 前端在 script 标签返回资源的时候就回执行 jsonpCallback，并以回调函数的方式拿到返回的数据了

### HTTP

- HTTP 是应用层，TCP、UDP 是传输层
- TCP 有连接有断开，传输稳定
- UDP 无连接无断开，不稳定传输但效率高

### HTTP 状态码

- 状态码分类
  | 值 | 说明 |
  | :-: | :- |
  | 1XX | 服务器已收到请求 |
  | 2XX | 请求成功，如 200 |
  | 3XX | 重定向，如 301 |
  | 4XX | 客户端错误，如 404 |
  | 5XX | 服务器错误，如 500 |

- 常见状态码
  | 值 | 说明 |
  | :-: | :- |
  | 301 | 永久重定向（配合请求返回的 location，浏览器自动处理） |
  | 302 | 临时重定向（配合请求返回的 location，浏览器自动处理） |
  | 304 | 资源未被修改（缓存） |
  | 403 | 没权限 |
  | 404 | 资源未找到 |
  | 504 | 网关超时 |

### cookie

- http 无状态，每次请求都要带 cookie，以识别身份
- 服务端也可以向客户端 set-cookie cookie 大小限制 4kb
- 默认有跨域限制，不跨域共享、传递 cookie

::: tip cookie VS token

- cookie 是 HTTP 规范，token 是自定义传递
- cookie 会默认被浏览器存储，token 需手动存储
- token 默认没有跨域限制

:::

### methods

1. get 获取数据
2. post 新建数据
3. patch/put 更新数据
4. delete 删除数据

::: tip get 和 post 的区别

- GET 在浏览器回退时是无害的，而 POST 会再次提交请求。
- GET 产生的 URL 地址可以被 Bookmark，而 POST 不可以。
- GET 请求会被浏览器主动 cache，而 POST 不会，除非手动设置。
- GET 请求只能进行 url 编码，而 POST 支持多种编码方式。
- GET 请求参数会被完整保留在浏览器历史记录里，而 POST 中的参数不会被保留。
- GET 请求在 URL 中传送的参数是有长度限制的，而 POST 么有。
- 对参数的数据类型，GET 只接受 ASCII 字符，而 POST 没有限制。
- GET 比 POST 更不安全，因为参数直接暴露在 URL 上，所以不能用来传递敏感信息。
- GET 参数通过 URL 传递，POST 放在 Request body 中。

:::

### headers

- 常见的 Request Headers
  - cookie
  - Host
  - User-Agent (简称 UA)，浏览器信息
  - Connection:keep-alive 一次 TCP 链接重复使用
  - Content-type 发送数据的格式，如 application/json
  - Accept 浏览器可接受的数据格式
  - Accept-Encoding 浏览器可接受的压缩算法，如 gzip
  - Accept-Language 浏览器可接受的语言，如 zh-CN
- 常见的 Response Headers
  - Connection:keep-alive 一次 TCP 链接重复使用
  - Content-type 返回数据的格式，如 application/json
  - Content-length 返回数据的大小
  - Content-Encoding 返回数据的压缩算法，如 gzip
  - Set-Cookie

### 缓存

HTTP 缓存可以说是 HTTP 性能优化中简单高效的一种优化方式了，缓存是一种保存资源副本并在下次请求时直接使用该副本的技术，当 web 缓存发现请求的资源已经被存储，它会拦截请求，返回该资源的拷贝，而不会去源服务器重新下载。

> 哪些资源可以被缓存? - 静态资源（js、css、img）

#### 强制缓存(200)

- 强制缓存常见技术有 Expires 和 Cache-Control。
- Expires 的值是一个时间，表示这个时间前缓存都有效，都不需要发起请求。
- Cache-Control 有很多属性值，常用属性 max-age 设置了缓存有效的时间长度，单位为秒，这个时间没到，都不用发起请求。
- Cache-Control 的 max-age 优先级比 Expires 高。

#### 协商缓存(304)

- 协商缓存常见技术有 ETag 和 Last-Modified。
- ETag 其实就是给资源算一个 hash 值或者版本号，对应的常用 request header 为 If-None-Match。
- Last-Modified 其实就是加上资源修改的时间，对应的常用 request header 为 If-Modified-Since，精度为秒。
- ETag 每次修改都会改变，而 Last-Modified 的精度只到秒，所以 ETag 更准确，优先级更高，但是需要计算，所以服务端开销更大。
- 强制缓存和协商缓存都存在的情况下，先判断强制缓存是否生效，如果生效，不用发起请求，直接用缓存。如果强制缓存不生效再发起请求判断协商缓存。

::: tip 不同刷新操作，不同的缓存策略

- 改变 url： 强制缓存有效，协商缓存有效
- F5 手动刷新： 强制缓存失效，协商缓存有效
- 强制刷新： 强制缓存失效，协商缓存失效

:::

### 网页加载过程

- 从输入 url 到渲染出页面的整个过程

  - DNS 解析：域名 -> IP 地址
  - 浏览器根据 IP 地址向服务器发起 http 请求
  - 服务器处理 http 请求，并返回给浏览器
  - 根据 HTML 代码生成 DOM Tree
  - 根据 CSS 代码生成 CSSOM
  - 将 DOM Tree 和 CSSOM 整合形成渲染树
  - 根据渲染树来布局，计算每个节点的几何信息，然后将各个节点绘制到屏幕上
  - 遇到`<script/>`则暂停渲染，优先加载并执行 JS 代码
  - 如果 `<script/>` 脚本加了 defer，浏览器会发送请求加载 js，但是不会阻塞 DOM 解析，等 DOM 解析完，再执行 js
  - 如果 `<script/>` 加了 async，浏览器会发送请求加载 js，不阻塞 DOM 解析，等 js 加载过来了，就先停止 DOM 解析，去执行 js（谁先回来先执行谁），等 js 执行完，继续 DOM 解析

- window.onload

  > 页面的全部资源加载完才会执行，包括图片、视频等

- DOMContentLoaded ( jQuery ready() )
  > DOM 渲染完即可执行，此时图片、视频还可能没有加载完

## 安全

### XSS 跨站请求攻击

将 JS 代码插入到网站页面中，渲染是执行 JS 代码

预防：

- 替换特殊字符 `<script>` 变为 `&lt;script&gt;` 字符串显示，而不作为脚本执行
- 前后端都得替换，使用 xss 库

### XSRF 跨站请求伪造

诱导用户去访问另一个网站的接口，伪造请求

预防：

- 严格的跨域请求限制，如判断 refer(请求来源)
- 为 cookie 设置 SameSite ,禁止跨域传递 cookie
- 关键接口使用短信验证

### 点击劫持

诱导界面上蒙一个透明的 ifarm，诱导用户点击

预防：

- 让 ifarm 不能跨域加载（'X-Frame-Options SAMEORIGIN'）
