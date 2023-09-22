---
icon: lock
article: false
---

# 韩漫下载

```py
import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# 目标网页的URL
base_url = 'https://nnhanman.xyz'
url = 'https://nnhanman.xyz/comic/qin-zi-can-ting-de-ma-ma-men.html'

# 发送HTTP GET请求获取网页内容
response = requests.get(url)
html = response.text

# 使用BeautifulSoup解析网页
soup = BeautifulSoup(html, 'html.parser')

# 获取页面的title属性作为保存文件夹的名称
title = soup.find('title').text.strip()
folder_name = title.replace('/', '-')  # 防止斜杠导致的非法文件夹名

# 创建保存图片的文件夹
os.makedirs(folder_name, exist_ok=True)

# 获取所有章节的URL
chapter_list = soup.find('ul', id='mh-chapter-list-ol-0')
chapter_links = chapter_list.find_all('a')

# 遍历每个章节的URL
for chapter_link in chapter_links:
    chapter_url_suffix = chapter_link['href']
    chapter_url = urljoin(base_url, chapter_url_suffix)

    # 发送HTTP GET请求获取章节页面内容
    chapter_response = requests.get(chapter_url)
    chapter_html = chapter_response.text

    # 使用BeautifulSoup解析章节页面
    chapter_soup = BeautifulSoup(chapter_html, 'html.parser')

    # 获取章节的名称作为图片文件名的前缀
    chapter_name = chapter_soup.find('title').text.strip()

    # 获取章节中所有图片的URL
    image_box = chapter_soup.find('div', id='m_r_imgbox_0')
    image_tags = image_box.find_all('img')

    # 遍历每个图片的URL
    for index, image_tag in enumerate(image_tags):
        image_url = image_tag['data-original']

        # 发送HTTP GET请求下载图片
        image_response = requests.get(image_url)
        image_data = image_response.content

        # 构造图片文件名
        image_name = f'{index + 1:03d}.jpg'  # 使用三位数的序号作为文件名（例如001.jpg、002.jpg）

        # 保存图片到文件夹
        image_path = os.path.join(folder_name, chapter_name, image_name)
        os.makedirs(os.path.dirname(image_path), exist_ok=True)
        with open(image_path, 'wb') as image_file:
            image_file.write(image_data)

        print(f'Saved image: {image_path}')

print('All images downloaded successfully.')
```
