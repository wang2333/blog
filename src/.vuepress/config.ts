import { defineUserConfig } from 'vuepress';
import theme from './theme.js';

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',
  title: '王小帅自习室',
  description: '王小帅自习室',
  theme
  // Enable it with pwa
  // shouldPrefetch: false,
});
