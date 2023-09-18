import { sidebar } from 'vuepress-theme-hope';

export default sidebar({
  '/': [
    '',
    {
      text: 'vue',
      icon: 'fab fa-vuejs',
      prefix: 'vue/',
      link: 'vue/',
      children: ['vue2', 'vue3']
    }, 
    {
      text: '如何使用',
      icon: 'laptop-code',
      prefix: 'demo/',
      link: 'demo/',
      children: 'structure'
    }
    // {
    //   text: '文章',
    //   icon: 'book',
    //   prefix: 'posts/',
    //   children: 'structure'
    // }
  ]
});
