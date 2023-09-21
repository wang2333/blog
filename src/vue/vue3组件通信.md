---
title: vue3组件通信
icon: fab fa-vuejs
sticky: 7
category:
  - 前端框架
tag:
  - Vue
---

组件通信是指组件之间的数据交流和事件传递。在 Vue 3 中提供了多种方式来实现组件通信，包括：

- props
- $emit
- ref 和 defineExpose
- provide 和 inject
- v-model
- pinia
- mitt

<!-- more -->

## props

父组件将数据传递给子组件，子组件通过 props 属性接收父组件传递的数据

子组件 Child.vue：

```vue
<script setup>
// 使用 defineProps 函数来定义 Props 的类型和默认值
// defineProps 不需要引入即可直接使用
const props = defineProps({
  // 变量 count 是通过父组件传递过来的
  count: {
    type: Number,
    default: 0
  }
});
</script>

<template>
  <div id="child">
    <h1>count: {{ count }}</h1>
  </div>
</template>
```

父组件 Parent.vue：

```vue
<script setup>
// 引入 ref 函数，用于定义响应式数据
import { ref } from 'vue';
// 引入子组件 Child.vue
import Child from './Child.vue';

// 使用 ref 函数创建了一个响应式的变量 count，初始值为 0，该变量将用于传递给子组件
let count = ref(0);
</script>

<template>
  <div id="parent">
    <!-- 将 count 变量传递给子组件 Child -->
    <Child :count="count" />
  </div>
</template>
```

## $emit

子组件通过 $emit 方法触发一个自定义事件，并传递需要的参数。父组件通过在子组件上监听对应的事件，并指定触发事件时的回调函数。

子组件 Child.vue：

```vue
<script setup>
// 使用 defineProps 函数来定义 Props 的类型和默认值
// defineProps 不需要引入即可直接使用
const props = defineProps({
  // 变量 count 是通过父组件传递过来的
  count: {
    type: Number,
    default: 0
  }
});

// 使用 defineEmits 函数定义了一个名为 changeParentCount 的自定义事件。
const emit = defineEmits(['changeParentCount']);
const changeParentCount = () => {
  // 通过 emit 方法触发名为 changeParentCount 的自定义事件，并将参数 5 传递给父组件。
  emit('changeParentCount', 5);
};
</script>

<template>
  <div id="child">
    <h1>count: {{ count }}</h1>
    <button @click="changeParentCount">更新父组件的count</button>
  </div>
</template>
```

父组件 Parent.vue：

```vue
<script setup>
// 引入 ref 函数，用于定义响应式数据
import { ref } from 'vue';
// 引入子组件 Child.vue
import Child from './Child.vue';

// 使用 ref 函数创建了一个响应式的变量 count，初始值为 0，该变量将用于传递给子组件
let count = ref(0);

// 这个方法用于处理子组件中触发的自定义事件 changeParentCount，并更新父组件中的 count 变量的值。
const changeParentCount = params => {
  count.value += params;
};
</script>

<template>
  <div id="parent">
    <!-- 将 count 变量传递给子组件 Child -->
    <!-- 监听子组件自定义事件 changeParentCount -->
    <Child :count="count" @changeParentCount="changeParentCount" />
  </div>
</template>
```

## ref 和 defineExpose

在 Vue3 中，ref 函数除了可以用于定义一个响应式的变量或引用之外，还可以获取 DOM 组件实例。
而 defineExpose 是用于将组件内部的属性和方法暴露给父组件或其他组件使用。通过这种方式，我们可以定义哪些部分可以从组件的外部访问和调用。

子组件 Child.vue：

```vue
<script setup>
// 引入 ref 函数，用于定义响应式数据
import { ref } from 'vue';

// 定义变量和方法
const msg = ref('我是子组件中的数据');
const childMethod = () => {
  console.log('我是子组件中的方法');
};

// defineExpose 对外暴露组件内部的属性和方法，不需要引入，直接使用
// 将属性 msg 和方法 childMethod 暴露给父组件
defineExpose({
  msg,
  childMethod
});
</script>
```

父组件 Parent.vue：

```vue
<script setup>
// 引入响应式ref
import { ref } from 'vue';
// 引入子组件 Child.vue
import Child from './Child.vue';

// 获取子组件DOM实例
const childRef = ref();

// 该方法用于获取子组件对外暴露的属性和方法
const getChildPropertyAndMethod = () => {
  // 获取子组件对外暴露的属性
  console.log(childRef.value.msg);
  // 调用子组件对外暴露的方法
  childRef.value.childMethod();
};
</script>

<template>
  <div id="parent">
    <Child ref="childRef" />
    <button @click="getChildPropertyAndMethod">获取子组件对外暴露的属性和方法</button>
  </div>
</template>
```

## provide 和 inject

在 Vue 3 中，我们可以使用 provide 和 inject 实现跨组件的通信。

- provide 是在父组件中定义的方法，用于提供数据给所有子组件。 它接收两个参数，第一个参数是一个字符串或者一个 Symbol 类型的键，用于识别提供的数据。第二个参数是要提供的数据本身。这个数据可以是响应式的对象、响应式的 ref、reactive 对象、函数等。父组件中使用 provide 提供数据后，所有的子组件都可以通过 inject 来访问这些数据。
- inject 是在子组件中使用的方法，用于接收父组件提供的数据。 它接收一个参数，即要注入的数据的键。在子组件中使用 inject 时，可以直接使用接收到的数据，而不需要在组件的配置选项中声明这些数据。

组件 Parent.vue：

```vue
<script setup>
// 引入 ref 函数，用于定义响应式数据
// 引入 provide，用于提供数据给所有子组件
import { ref, provide } from 'vue';
// 引入子组件1和子组件2
import Child1 from './Child1.vue';
import Child2 from './Child2.vue';

// 定义一个 message 响应式数据
const message = ref('我是父组件的数据');

// 使用 provide 将数据 message 提供给所有子组件
provide('message', message);
</script>

<template>
  <div id="parent">
    <Child1 />
    <Child2 />
  </div>
</template>
```

组件 Child1.vue：

```vue
<script setup>
import { inject } from 'vue';
// 使用 inject 获取来自父组件的数据 message
const parentMessage = inject('message');
</script>

<template>
  <div id="child">
    <p>子组件1: {{ parentMessage }}</p>
  </div>
</template>
```

组件 Child2.vue：

```vue
<script setup>
import { inject } from 'vue';
// 使用 inject 获取来自父组件的数据 message
const parentMessage = inject('message');
</script>

<template>
  <div id="child">
    <p>子组件2: {{ parentMessage }}</p>
  </div>
</template>
```

除了获取数据，我们同样也可以更改数据。

```vue
<script setup>
import { inject } from 'vue';

// 使用 inject 获取来自父组件的数据 message
const parentMessage = inject('message');

// 该方法用于更改父组件的message
const changeParentMessage = () => {
  parentMessage.value = '我更改了message值';
};
</script>

<template>
  <div id="child">
    <p>子组件1: {{ parentMessage }}</p>
    <button @click="changeParentMessage">更改父组件message</button>
  </div>
</template>
```

## v-model

v-model 可以同时支持多个数据双向绑定。

子组件 Child.vue：

```vue
<script setup>
const emit = defineEmits(['name', 'age']);

const changeParentMsg = () => {
  emit('update:name', 'Steven');
  emit('update:age', 36);
};
</script>

<template>
  <div id="child">
    <button @click="changeParentMsg">更新父组件中的name和age</button>
  </div>
</template>
```

父组件 Parent.vue：

```vue
<script setup>
// 引入 ref 函数，用于定义响应式数据
import { ref } from 'vue';
// 引入子组件
import Child from './Child.vue';

// 定义两个响应式的变量
let name = ref('Echo');
let age = ref(26);
</script>

<template>
  <div id="parent">
    <p>父组件name: {{ name }}</p>
    <p>父组件age: {{ age }}</p>
    <!-- 使用 v-model 将父组件的 name 和 age 双向绑定到子组件的 name 和 age 上。 -->
    <Child v-model:name="name" v-model:age="age" />
  </div>
</template>
```

## pinia

pinia 是一个为 vue3 设计的状态管理库，类似 Vuex 的设计模式，通过定义 store、状态、getter 和 action，来统一管理应用程序的状态和逻辑。

## mitt

在 Vue 3 中，可以使用第三方库 mitt 实现组件之间的通信。mitt 是一个简单且强大的事件总线库（类似于 Vue 2 中的 EventBus），它提供了一种方便的方式来在不同组件之间传递事件和数据。

创建一个 event bus：

```js
import mitt from 'mitt';
const bus = mitt();
export default bus;
```

在需要通信的组件中，导入 event bus 对象并进行事件的监听和触发：

组件 First.vue：

```vue
<script setup>
import mitt from '../mitt';

const emitEvent = () => {
  mitt.emit('updateName', 36);
};
</script>

<template>
  <div id="first">
    <button @click="emitEvent">更新name和age</button>
  </div>
</template>
```

组件 Second.vue：

```vue
<script setup>
import mitt from '../mitt';
import { ref } from 'vue';

let name = ref('Echo');
let age = ref(26);

mitt.on('updateName', data => {
  name.value = 'Steven';
  age.value = data;
});
</script>

<template>
  <div id="second">
    <p>name: {{ name }}</p>
    <p>age: {{ age }}</p>
  </div>
</template>
```
