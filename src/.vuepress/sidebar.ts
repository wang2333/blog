import { sidebar } from 'vuepress-theme-hope';

export default sidebar({
  '/': [
    '',
    {
      text: 'Vue系列',
      icon: 'fab fa-vuejs',
      prefix: 'Vue/',
      children: ['Vue2', 'Vue3']
    },
    {
      text: 'React系列',
      icon: 'fab fa-react',
      prefix: 'React/',
      children: ['React知识点']
    },
    {
      text: '如何使用',
      icon: 'laptop-code',
      prefix: 'demo/',
      link: 'demo/',
      children: 'structure'
    }
  ]
});
