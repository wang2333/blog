import { defineUserConfig } from 'vuepress';
import { getDirname, path } from '@vuepress/utils';
import theme from './theme.js';

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',
  title: '王小帅自习室',
  description: '王小帅自习室',

  theme,

  alias: {
    '@theme-hope/modules/blog/components/BlogHero': path.resolve(
      __dirname,
      './components/BlogHero.vue'
    )
  }
  // Enable it with pwa
  // shouldPrefetch: false,
});
