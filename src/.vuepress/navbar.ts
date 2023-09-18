import { navbar } from 'vuepress-theme-hope';

export default navbar([
  '/',
  {
    text: 'Vue',
    icon: 'fab fa-vuejs',
    prefix: '/Vue/',
    children: ['Vue2', 'Vue3']
  },
  {
    text: 'React',
    icon: 'fab fa-react',
    link: '/React/'
  },
  'demo'
]);
