---
title: 韩漫下载
icon: lock
article: false
---

# 韩漫下载

```javascript
// npm i axios puppeteer -S
const puppeteer = require('puppeteer');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function downloadImages(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const title = await page.title();
    const folderName = `${title.replace('/', '-').split('-')[0].trim()}`;
    fs.mkdirSync(folderName, { recursive: true });

    const chapterLinks = await page.$$eval('.chapter__list-box a', links =>
      links.map(link => link.href)
    );
    const uniqueChapterLinks = [...new Set(chapterLinks)].reverse();

    for (const [, chapterUrl] of uniqueChapterLinks.entries()) {
      await page.goto(chapterUrl);
      const chapterName = await page.$eval('title', element =>
        element.textContent.split(' ')[0].trim()
      );

      const chapterFolderPath = path.join(folderName, chapterName);

      const imageUrls = await page.$$eval('.rd-article-wr img[data-original]', images =>
        images.map(image => image.getAttribute('data-original'))
      );

      // 判断当前章文件夹中的图片是否已经全部下载完成
      if (fs.existsSync(chapterFolderPath)) {
        const imageCount = fs
          .readdirSync(chapterFolderPath)
          .filter(name => name.endsWith('.jpg')).length;

        if (imageCount === imageUrls.length) {
          console.log(
            `[${new Date().toLocaleTimeString()}] 章节图片已全部下载，跳过: ${chapterFolderPath}`
          );
          continue;
        }
      }

      fs.mkdirSync(chapterFolderPath, { recursive: true });

      const promises = imageUrls.map(async (imageUrl, imageIndex) => {
        const imageName = `${imageIndex + 1}`.padStart(3, '0') + '.jpg';
        const imagePath = path.join(chapterFolderPath, imageName);

        if (fs.existsSync(imagePath)) {
          console.log(`[${new Date().toLocaleTimeString()}] 图片已存在，跳过: ${imagePath}`);
          return;
        }

        try {
          const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          fs.writeFileSync(imagePath, response.data);
          console.log(`[${new Date().toLocaleTimeString()}] 下载图片: ${imagePath}`);
        } catch (error) {
          console.error(
            `[${new Date().toLocaleTimeString()}] 下载图片失败: ${imagePath}`,
            error.message
          );
        }
      });

      await Promise.all(promises);
    }

    await browser.close();
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
