---
title: Vue3知识点
icon: fab fa-vuejs
sticky: 3
category:
  - 前端框架
tag:
  - Vue
---

Vue 3 的核心是使用 Proxy 代理对象来实现响应式数据绑定，它比 Vue 2 使用的 Object.defineProperty 方法更快，更可靠。
Vue 3 提供了一个新的 Composition API，这是一种基于函数的 API 风格，让开发者可以更好地封装逻辑、复用代码，并且更好地管理组件的状态和方法。

<!-- more -->

## defineProperty 缺点

1. 深度监听，需要递归到底，一次性计算量大
2. 无法监听新增属性和删除属性

## Composition API 与 Options API 区别

- 更好的代码组织
- 更好的逻辑复用
- 更好的类型推导

## Proxy 与 Object.defineProperty 区别

- Proxy 可以直接监听对象而非属性
- Object.defineProperty 需初始化时递归监听，Proxy 在访问时才会监听

## watch 和 watchEffect 区别

- watch 需要指定监听的属性，watchEffect 会自动收集依赖
- watchEffect 会在组件初始化时执行一次，watch 不会

## Vue3 优化点

- 响应式系统升级， Proxy 替换 Object.defineProperty
- 编译优化，重写了模板编译，标记静态节点，diff 时跳过静态节点 （PatchFlag）
- 将静态节点的定义提升到父作用域缓存，多个相邻的静态节点合并缓存 （HoistStatic）
- 源码体积优化 （Tree-shaking）

## Vite

- 开发环境基于 ES Module，不需要打包，直接浏览器原生支持
- 生产环境基于 Rollup 打包，打包速度快
