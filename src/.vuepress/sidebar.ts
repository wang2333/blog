import { sidebar } from 'vuepress-theme-hope';

export default sidebar({
  '/': [
    '',
    'algorithm',
    {
      text: 'JavaScript系列',
      icon: 'fab fa-bitbucket',
      prefix: 'javascript/',
      link: 'javascript/',
      children: 'structure'
    },
    {
      text: 'Vue系列',
      icon: 'fab fa-vuejs',
      prefix: 'vue/',
      link: 'vue/',
      children: 'structure'
    },
    {
      text: 'React系列',
      icon: 'fab fa-react',
      prefix: 'react/',
      link: 'react/',
      children: 'structure'
    },
    'project',
    {
      text: '爬虫脚本',
      icon: 'fas fa-spider',
      prefix: 'encrypt/',
      link: 'encrypt/'
      // children: ['HMDownload', 'HMMerge']
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
