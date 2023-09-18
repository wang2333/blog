import { navbar } from 'vuepress-theme-hope';

export default navbar([
  '/',
  {
    text: 'vue',
    icon: 'fab fa-vuejs',
    prefix: '/vue/',
    children: ['vue2', 'vue3']
  },
  'demo'
]);
