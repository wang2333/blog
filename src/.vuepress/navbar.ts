import { navbar } from 'vuepress-theme-hope';

export default navbar([
  '/',
  '/advanced',
  {
    text: 'Vue系列',
    icon: 'fab fa-vuejs',
    prefix: '/Vue/',
    link: '/Vue'
  },
  {
    text: 'React系列',
    icon: 'fab fa-react',
    prefix: '/React/',
    link: '/React'
  }
]);
