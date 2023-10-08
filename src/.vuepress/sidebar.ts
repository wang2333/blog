import { sidebar } from 'vuepress-theme-hope';

export default sidebar({
  '/': [
    '',
    'advanced',
    'algorithm',
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
    {
      text: '保险柜',
      icon: 'lock',
      prefix: 'encrypt/',
      children: ['HMDownload', 'HMMerge']
    },
    {
      text: '如何使用',
      icon: 'laptop-code',
      prefix: 'demo/',
      link: 'demo/',
      children: 'structure'
    },
    'project'
  ]
});
