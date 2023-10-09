---
title: 韩漫下载
icon: lock
article: false
---

# 韩漫下载

```javascript
const fs = require('fs');
const https = require('https');
const { JSDOM } = require('jsdom');
const { URL } = require('url');
const readline = require('readline');

const listDomId = '.chapter__list-box';
const imgDomId = '.rd-article-wr';
const imgAttr = 'data-original';

// 设置并发下载的最大图片数
const MAX_CONCURRENT_DOWNLOADS = 40;

const proxyList = [
  '59.37.128.138:8082',
  '180.120.215.218:8089',
  '158.69.53.98:9300',
  '202.60.194.23:80',
  '183.88.234.3:80',
  '202.51.114.210:3128',
  '198.12.122.226:3128',
  '154.70.107.81:3128',
  '118.193.102.3:7890',
  '101.251.204.174:8080',
  '45.32.13.155:9080',
  '20.204.214.79:3129',
  '45.174.87.18:999',
  '200.30.138.54:3128',
  '200.106.184.15:999',
  '89.23.106.73:3128',
  '51.255.208.33:1991',
  '101.230.172.86:9443',
  '8.219.167.53:10028',
  '185.191.236.162:3128',
  '8.219.97.248:80',
  '189.203.201.146:8080',
  '103.74.121.88:3128',
  '37.19.220.129:8443',
  '34.87.153.112:3128',
  '103.76.12.42:80',
  '203.189.142.168:53281',
  '20.33.5.27:8888',
  '45.7.24.102:3128',
  '36.67.123.173:8080',
  '182.23.35.242:8080',
  '81.70.187.80:8080',
  '23.131.56.173:999',
  '179.1.192.52:999',
  '36.6.144.169:8089',
  '36.6.144.126:8089',
  '180.191.254.130:8080',
  '103.48.68.35:83',
  '45.86.229.233:39811',
  '129.154.228.193:3128',
  '103.171.31.127:8080',
  '179.49.113.230:999',
  '139.196.111.167:9000',
  '188.132.222.165:8080',
  '20.120.240.49:80',
  '23.152.40.14:3128',
  '144.48.38.39:8443',
  '37.10.74.150:8080',
  '35.236.207.242:33333',
  '103.230.81.4:8080',
  '163.172.35.53:3128',
  '82.137.244.151:8080',
  '203.210.85.223:8080',
  '213.178.39.170:8080',
  '203.174.15.138:8080',
  '165.16.60.193:8080',
  '45.174.79.129:999',
  '59.15.28.114:3939',
  '186.121.235.66:8080',
  '186.121.235.66:8080',
  '191.6.15.104:8080',
  '59.98.4.71:8080',
  '8.219.196.101:10028',
  '31.43.191.118:80',
  '43.251.117.233:38080',
  '177.200.239.46:999',
  '199.242.31.25:8080',
  '112.78.134.132:7777',
  '201.95.254.137:3128',
  '46.17.63.166:18888',
  '170.83.242.250:999',
  '36.95.27.225:8080',
  '45.233.170.156:999',
  '34.142.51.21:443',
  '183.164.242.99:8089',
  '117.69.232.115:8089',
  '223.112.53.2:1025',
  '158.101.28.215:80',
  '95.56.254.139:3128',
  '200.106.184.13:999',
  '142.93.223.219:8080',
  '183.164.243.37:8089',
  '45.232.79.0:9292',
  '193.42.112.165:443',
  '59.98.151.201:8080',
  '138.199.48.4:8443',
  '35.219.45.120:3128',
  '168.126.74.132:80',
  '58.64.204.150:3128',
  '20.198.96.26:80',
  '185.101.159.130:80',
  '190.61.46.228:999',
  '83.19.79.197:8060',
  '41.174.132.58:8080',
  '201.71.2.249:999',
  '59.110.236.121:3128',
  '45.139.199.91:3128',
  '213.136.101.36:3128',
  '27.147.238.186:8674',
  '202.57.25.112:8080'
];

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

async function httpGet(url) {
  return new Promise((resolve, reject) => {
    // 随机选择一个代理服务器
    const options = new URL(url);
    const proxy = Math.floor(Math.random() * proxyList.length);
    options.agent = new https.Agent({
      ...proxyOptions,
      rejectUnauthorized: false,
      keepAlive: true,
      maxSockets: 100,
      timeout: 1000 * 60,
      proxy: `http://${proxy}`
    });

    https
      .get(options, response => {
        if (response.statusCode !== 200) {
          reject(new Error(`Request failed with status code ${response.statusCode}`));
          response.resume();
          return;
        }

        const data = [];
        response.on('data', chunk => {
          data.push(chunk);
        });

        response.on('end', () => {
          resolve(Buffer.concat(data));
        });
      })
      .on('error', error => {
        reject(error);
      });
  });
}

async function downloadImages(url) {
  try {
    const origin = new URL(url).origin;
    // 发送HTTP GET请求获取网页内容
    const html = await httpGet(url);

    // 使用jsdom解析网页
    const dom = new JSDOM(html);
    const { document } = dom.window;

    // 获取页面的title属性作为保存文件夹的名称
    const title = document.querySelector('title').textContent.trim();
    const folderName = `${title.replace('/', '-').split('-')[0].trim()}`; // 防止斜杠导致的非法文件夹名

    // 创建保存图片的文件夹
    fs.mkdirSync(folderName, { recursive: true });

    // 获取所有章节的URL后去重
    const chapterList = document.querySelector(listDomId);
    const chapterLinks = [...new Set(chapterList.querySelectorAll('a'))];

    // 创建队列实例用于管理下载任务
    const queue = new Queue();

    // 遍历每个章节的URL并加入下载任务队列
    for (const [chapterIndex, chapterLink] of Array.from(chapterLinks).entries()) {
      const chapterUrlSuffix = chapterLink.getAttribute('href');
      const chapterUrl = new URL(chapterUrlSuffix, origin).href;

      // 发送HTTP GET请求获取章节页面内容
      const chapterHtml = await httpGet(chapterUrl);

      // 使用jsdom解析章节页面
      const chapterDom = new JSDOM(chapterHtml);
      const { document: chapterDocument } = chapterDom.window;

      // 获取章节的名称作为图片文件名的前缀
      const chapterName = chapterDocument.querySelector('title').textContent.split(' ')[0].trim();

      // 获取章节中所有图片的URL
      const imageBox = chapterDocument.querySelector(imgDomId);
      const imageTags = imageBox.querySelectorAll('img');

      // 遍历每个图片的URL并加入下载任务队列
      for (const [imageIndex, imageTag] of Array.from(imageTags).entries()) {
        const imageUrl = imageTag.getAttribute(imgAttr);
        const imageName = `${imageIndex + 1}`.padStart(3, '0') + '.jpg'; // 使用三位数的序号作为文件名

        // 构造图片文件路径
        const imageFolderPath = `${folderName}/${chapterName}`;
        fs.mkdirSync(imageFolderPath, { recursive: true });
        const imagePath = `${imageFolderPath}/${imageName}`;

        // 检查文件是否已存在
        if (fs.existsSync(imagePath)) {
          console.log(`[${new Date().toLocaleTimeString()}] 图片已存在，跳过: ${imagePath}`);
          continue;
        }

        // 定义一个异步任务用于下载图片
        const downloadTask = async () => {
          // 发送HTTP GET请求下载图片
          const imageResponse = await httpGet(imageUrl);
          const imageData = Buffer.from(imageResponse, 'binary');

          // 保存图片到文件夹
          fs.writeFileSync(imagePath, imageData);

          console.log(`[${new Date().toLocaleTimeString()}] 图片下载完成: ${imagePath}`);
        };

        queue.add(downloadTask);
      }
    }

    // 等待队列中所有任务执行完毕
    while (queue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('[INFO] 所有图片已下载');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

function promptForURL() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(
    '请输入韩漫地址（例如：https://www.aikanhanman.com/index.php/comic/shechanhuazi）: ',
    url => {
      downloadImages(url || 'https://www.aikanhanman.com/index.php/comic/shechanhuazi');
      rl.close();
    }
  );
}
promptForURL();
```
