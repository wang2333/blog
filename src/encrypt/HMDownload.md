---
title: 韩漫下载
icon: lock
article: false
---

# 韩漫下载

```python
import os
import requests
import  urllib3
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor
from collections import OrderedDict
urllib3.disable_warnings()

MAX_WORKERS = 10
TITLE_SEPARATOR = '--'

list_selector = '.only_content_main_area'
img_selector = '#page_content_id'
img_attr = 'data-original'

def download_image(session, url, image_path):
  try:
    response = session.get(url, verify=False)
    response.raise_for_status()
    with open(image_path, 'wb') as f:
      f.write(response.content)
    print(f"图片下载完成: {image_path}")
  except Exception as e:
    print(f"图片下载失败: {url}")
    print(e)

def download_images(url):
  try:
    origin = urlparse(url).scheme + '://' + urlparse(url).netloc
    with requests.Session() as session:
      response = session.get(url, verify=False)
      response.raise_for_status()
      soup = BeautifulSoup(response.text, 'html.parser')
      folder_name = soup.title.string.replace('/', '-').split('-')[0].strip()
      os.makedirs(folder_name, exist_ok=True)
      with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        links = soup.select(list_selector + ' a')
        unique_links = list(OrderedDict.fromkeys(links))
        for link in unique_links:
          chapter_link = urljoin(origin, link['href'])
          chapter_html = session.get(chapter_link, verify=False).text
          chapter_soup = BeautifulSoup(chapter_html, 'html.parser')
          chapter_name = chapter_soup.title.string.split(TITLE_SEPARATOR)[0].strip()
          chapter_folder_path = os.path.join(folder_name, chapter_name)
          os.makedirs(chapter_folder_path, exist_ok=True)
          image_tasks = []
          for i, image in enumerate(chapter_soup.select(img_selector + ' img')):
            image_url = urljoin(origin, image[img_attr])
            image_name = f"{str(i + 1).zfill(3)}.jpg"
            image_path = os.path.join(chapter_folder_path, image_name)
            if os.path.exists(image_path):
              print(f"图片已存在，跳过: {image_path}")
              continue
            task = executor.submit(download_image, session, image_url, image_path)
            image_tasks.append(task)
          for task in image_tasks:
            task.result()
      print('[INFO] 所有图片已下载')
  except Exception as e:
    print('Error:', e)

def prompt_for_url():
  url = input('请输入韩漫地址（例如：https://www.hanmanbz3.top/s/m_hm/m_7/m_5001110004/）: ')
  download_images(url or 'https://www.hanmanbz3.top/s/m_hm/m_7/m_5001110004/')

if __name__ == '__main__':
  prompt_for_url()
```
