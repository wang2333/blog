import { defineUserConfig } from 'vuepress';
import { getDirname, path } from '@vuepress/utils';
import { searchProPlugin } from 'vuepress-plugin-search-pro';
import theme from './theme.js';

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',
  title: '王小帅自习室',
  description: '王小帅的自习室',
  theme,
  alias: {
    '@theme-hope/modules/blog/components/BlogHero': path.resolve(
      __dirname,
      './components/BlogHero.vue'
    ),
    '@theme-hope/modules/navbar/components/Navbar': path.resolve(
      __dirname,
      './components/Navbar.vue'
    )
  },

  head: [
    // ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    // ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    // [
    //   'link',
    //   {
    //     href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap',
    //     rel: 'stylesheet'
    //   }
    // ]
  ],
  plugins: [
    searchProPlugin({
      // 索引全部内容
      indexContent: true,
      // 为分类和标签添加索引
      customFields: [
        {
          getter: page => page.frontmatter.category,
          formatter: '分类：$content'
        },
        {
          getter: page => page.frontmatter.tag,
          formatter: '标签：$content'
        }
      ]
    })
  ]
  // Enable it with pwa
  // shouldPrefetch: false,
});
