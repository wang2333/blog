import { sidebar } from 'vuepress-theme-hope';

export default sidebar({
  '/': [
    '',
    {
      text: 'Vue',
      icon: 'fab fa-vuejs',
      prefix: 'Vue/',
      link: 'Vue/',
      children: ['Vue2', 'Vue3']
    },
    {
      text: '如何使用',
      icon: 'laptop-code',
      prefix: 'demo/',
      link: 'demo/',
      children: 'structure'
    },
    {
      text: 'React',
      icon: 'fab fa-react',
      link: 'React/'
      // prefix: 'posts/',
      // children: 'structure'
    }
  ]
});
