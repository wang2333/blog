---
title: 韩漫下载
icon: lock
article: false
---

# 韩漫下载

```JavaScript
const fs = require('fs');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const { URL } = require('url');

// 目标网页的URL和保存根目录
const baseUrl = 'https://nnhanman.xyz';
const url = `${baseUrl}/comic/ren-qi-lie-ren.html`;

// 设置并发下载的最大图片数
const MAX_CONCURRENT_DOWNLOADS = 20;

// 创建一个队列类用于管理下载任务
class Queue {
  constructor() {
    this.tasks = [];
    this.concurrency = 0;
  }

  add(task) {
    this.tasks.push(task);
    this.next();
  }

  next() {
    while (this.concurrency < MAX_CONCURRENT_DOWNLOADS && this.tasks.length > 0) {
      const task = this.tasks.shift();
      this.concurrency++;
      task().finally(() => {
        this.concurrency--;
        this.next();
      });
    }
  }

  get length() {
    return this.tasks.length;
  }
}

async function downloadImages() {
  try {
    // 发送HTTP GET请求获取网页内容
    const response = await axios.get(url);
    const html = response.data;

    // 使用jsdom解析网页
    const dom = new JSDOM(html);
    const { document } = dom.window;

    // 获取页面的title属性作为保存文件夹的名称
    const title = document.querySelector('title').textContent.trim();
    const folderName = `${title.replace('/', '-').split('-')[0].trim()}`; // 防止斜杠导致的非法文件夹名

    // 创建保存图片的文件夹
    fs.mkdirSync(folderName, { recursive: true });

    // 获取所有章节的URL
    const chapterList = document.querySelector('#mh-chapter-list-ol-0');
    const chapterLinks = chapterList.querySelectorAll('a');

    // 创建队列实例用于管理下载任务
    const queue = new Queue();

    // 遍历每个章节的URL并加入下载任务队列
    for (const [chapterIndex, chapterLink] of Array.from(chapterLinks).entries()) {
      const chapterUrlSuffix = chapterLink.getAttribute('href');
      const chapterUrl = new URL(chapterUrlSuffix, baseUrl).href;

      // 发送HTTP GET请求获取章节页面内容
      const chapterResponse = await axios.get(chapterUrl);
      const chapterHtml = chapterResponse.data;

      // 使用jsdom解析章节页面
      const chapterDom = new JSDOM(chapterHtml);
      const { document: chapterDocument } = chapterDom.window;

      // 获取章节的名称作为图片文件名的前缀
      const chapterName = chapterDocument.querySelector('title').textContent.split(' ')[0].trim();

      // 获取章节中所有图片的URL
      const imageBox = chapterDocument.querySelector('#m_r_imgbox_0');
      const imageTags = imageBox.querySelectorAll('img');

      // 遍历每个图片的URL并加入下载任务队列
      for (const [imageIndex, imageTag] of Array.from(imageTags).entries()) {
        const imageUrl = imageTag.getAttribute('data-original');
        const imageName = `${imageIndex + 1}`.padStart(3, '0') + '.jpg'; // 使用三位数的序号作为文件名

        // 构造图片文件路径
        const imageFolderPath = `${folderName}/${chapterName}`;
        fs.mkdirSync(imageFolderPath, { recursive: true });
        const imagePath = `${imageFolderPath}/${imageName}`;

        // 检查文件是否已存在
        if (fs.existsSync(imagePath)) {
          console.log(`[${new Date().toLocaleTimeString()}] Skipped existing image: ${imagePath}`);
          continue;
        }

        // 定义一个异步任务用于下载图片
        const downloadTask = async () => {
          // 发送HTTP GET请求下载图片
          const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const imageData = Buffer.from(imageResponse.data, 'binary');

          // 保存图片到文件夹
          fs.writeFileSync(imagePath, imageData);

          console.log(`[${new Date().toLocaleTimeString()}] Downloaded image: ${imagePath}`);
        };

        queue.add(downloadTask);
      }
    }

    // 等待队列中所有任务执行完毕
    while (queue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('[INFO] All images downloaded successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

downloadImages();
```
