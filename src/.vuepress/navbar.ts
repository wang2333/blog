import { navbar } from 'vuepress-theme-hope';

export default navbar([
  '/',
  'algorithm',
  {
    text: 'JavaScript系列系列',
    icon: 'fab fa-js',
    prefix: 'javascript/',
    link: 'javascript'
  },
  {
    text: 'Vue系列',
    icon: 'fab fa-vuejs',
    prefix: 'vue/',
    link: 'vue'
  },
  {
    text: 'React系列',
    icon: 'fab fa-react',
    prefix: 'react/',
    link: 'react'
  },
  'project'
]);
