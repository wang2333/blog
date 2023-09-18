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
    ),
    '@theme-hope/modules/navbar/components/Navbar': path.resolve(
      __dirname,
      './components/NormalPage.vue'
    )
  },
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap',
        rel: 'stylesheet'
      }
    ]
  ]
  // Enable it with pwa
  // shouldPrefetch: false,
});
