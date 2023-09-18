<script setup>
import { onMounted, onUnmounted } from 'vue';
import Navbar from 'vuepress-theme-hope/navbar/components/Navbar.js';

const handleScroll = () => {
  const navbarEl = document.getElementById('navbar');
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop > document.documentElement.clientHeight / 2) {
    navbarEl.classList.remove('nav-top');
  } else {
    navbarEl.classList.add('nav-top');
  }
};
onMounted(() => {
  if (location.pathname === '/') {
    const navbarEl = document.getElementById('navbar');
    navbarEl.classList.add('nav-top');
    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);
  }
  // body中插入元素 figure-bg
  const figureBg = document.createElement('div');
  figureBg.id = 'figure-bg';
  document.body.appendChild(figureBg);

  const pageBgDiv = document.createElement('div');
  pageBgDiv.id = 'page-bg';
  document.querySelector('.theme-container').appendChild(pageBgDiv);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  const figureBg = document.getElementById('figure-bg');
  document.body.removeChild(figureBg);
});
</script>

<template>
  <Navbar />
</template>
