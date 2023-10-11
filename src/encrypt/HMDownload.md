---
title: 韩漫下载
icon: lock
article: false
---

# 韩漫下载

```python
import os
import requests
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor

list_selector = '.chapter__list-box'
img_selector = '.rd-article-wr'
img_attr = 'data-original'

def download_image(url, image_path):
    try:
        response = requests.get(url)
        with open(image_path, 'wb') as f:
            f.write(response.content)
        print(f"图片下载完成: {image_path}")
    except Exception as e:
        print(f"图片下载失败: {url}")
        print(e)

def download_images(url):
    try:
        origin = urlparse(url).scheme + '://' + urlparse(url).netloc
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        folder_name = soup.title.string.replace('/', '-').split('-')[0].strip()
        os.makedirs(folder_name, exist_ok=True)

        with ThreadPoolExecutor() as executor:
            for link in soup.select(list_selector + ' a'):
                chapter_link = urljoin(origin, link['href'])
                chapter_html = requests.get(chapter_link).text
                chapter_soup = BeautifulSoup(chapter_html, 'html.parser')
                chapter_name = chapter_soup.title.string.split(' ')[0].strip()
                chapter_folder_path = os.path.join(folder_name, chapter_name)
                os.makedirs(chapter_folder_path, exist_ok=True)

                image_tasks = []
                for i, image in enumerate(chapter_soup.select(img_selector + ' img')):
                    image_url = image[img_attr]
                    image_name = f"{str(i + 1).zfill(3)}.jpg"
                    image_path = os.path.join(chapter_folder_path, image_name)

                    if os.path.exists(image_path):
                        print(f"图片已存在，跳过: {image_path}")
                        continue

                    task = executor.submit(download_image, image_url, image_path)
                    image_tasks.append(task)

                for task in image_tasks:
                    task.result()

        print('[INFO] 所有图片已下载')
    except Exception as e:
        print('Error:', e)

def prompt_for_url():
    url = input('请输入韩漫地址（例如：https://www.aikanhanman.com/index.php/comic/jixiuriji）: ')
    download_images(url or 'https://www.aikanhanman.com/index.php/comic/jixiuriji')

if __name__ == '__main__':
    prompt_for_url()

```
