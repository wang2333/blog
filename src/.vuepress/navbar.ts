import { navbar } from 'vuepress-theme-hope';

export default navbar([
  '/',
  '/demo/',
  {
    text: '博文',
    icon: 'pen-to-square',
    prefix: '/posts/',
    children: [
      {
        text: '苹果',
        icon: 'pen-to-square',
        prefix: 'apple/',
        children: ['1']
      },
      {
        text: '香蕉',
        icon: 'pen-to-square',
        prefix: 'banana/',
        children: ['1']
      },
      'cherry'
    ]
  }
]);
