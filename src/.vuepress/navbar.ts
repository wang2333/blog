import { navbar } from 'vuepress-theme-hope';

export default navbar([
  '/',
  {
    text: 'Vue系列',
    icon: 'fab fa-vuejs',
    prefix: '/Vue/',
    children: ['Vue2', 'Vue3']
  },
  {
    text: 'React系列',
    icon: 'fab fa-react',
    prefix: '/React/',
    children: ['React知识点']
  },
  'demo'
]);
