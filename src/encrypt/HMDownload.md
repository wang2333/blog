---
title: 韩漫下载
icon: lock
article: false
---

# 韩漫下载

```python
import os
import re
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
import urllib3
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
from collections import OrderedDict
from fake_useragent import UserAgent
import concurrent.futures
import logging

MAX_WORKERS = 1
OUTPUT_DIR = '韩漫下载'
COVER_SELECTOR = '.de-info__cover img'
LIST_SELECTOR = '.chapter__list-box a'
IMG_SELECTOR = '.rd-article-wr img'
IMG_ATTR = 'data-original'
HANMAN_FILE = 'hanman.txt'
ERROR_FILE = 'error.log'

urllib3.disable_warnings()
ua = UserAgent()
logging.basicConfig(filename=ERROR_FILE, level=logging.ERROR, encoding='utf-8', format='%(message)s')


def download_image(url, image_path):
    try:
        if os.path.exists(image_path):
            print(f"图片已存在，跳过: {image_path}")
            return
        response = requests.get(url, headers={'User-Agent': ua.random})
        response.raise_for_status()
        with open(image_path, 'wb') as f:
            f.write(response.content)
        print(f"图片下载完成: {image_path}")
        # 如果存在于error.log中，则删除该条记录
        if os.path.exists(ERROR_FILE):
            with open(ERROR_FILE, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            with open(ERROR_FILE, 'w', encoding='utf-8') as f:
                for line in lines:
                    if image_path not in line:
                        f.write(line)
    except Exception as e:
        print(f"图片下载失败: {url}", e)
        logging.error(f"{url} {image_path}")

def get_folder_name(name):
    folder_title = name.split(',')[0].split(' - ')[0]
    return os.path.join(OUTPUT_DIR, folder_title)

def download_images(url):
    try:
        origin = urlparse(url).scheme + '://' + urlparse(url).netloc
        response = requests.get(url, headers={'User-Agent': ua.random})
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        folder_name = get_folder_name(soup.title.string)
        os.makedirs(folder_name, exist_ok=True)
        download_cover(origin, soup, folder_name)
        download_chapters(origin, soup, folder_name)
        print('[INFO]所有图片已下载')
    except Exception as e:
        print('[Error]', e)

def download_cover(origin, soup, folder_name):
    cover_url = urljoin(origin, soup.select_one(COVER_SELECTOR)['src'])
    cover_path = os.path.join(folder_name, 'cover.jpg')
    if os.path.exists(cover_path):
        print(f"封面已存在，跳过: {cover_path}")
    else:
        download_image(cover_url, cover_path)

def download_chapters(origin, soup, folder_name):
    links = soup.select(LIST_SELECTOR)
    unique_links = list(OrderedDict.fromkeys(links))
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        tasks = []
        for link in unique_links:
            tasks.append(executor.submit(download_chapter, origin, link, folder_name))
        for task in concurrent.futures.as_completed(tasks):
            task.result()

def download_chapter(origin, link, folder_name):
    chapter_link = urljoin(origin, link['href'])
    chapter_html = requests.get(chapter_link).text
    chapter_soup = BeautifulSoup(chapter_html, 'html.parser')
    chapter_name = re.sub(r'[\\/:*?"<>|]', '', link.string).replace('...', '…').replace(' ', '').strip()
    chapter_folder_path = os.path.join(folder_name, chapter_name)
    os.makedirs(chapter_folder_path, exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        tasks = []
        for i, image in enumerate(chapter_soup.select(IMG_SELECTOR)):
            image_url = urljoin(origin, image[IMG_ATTR])
            image_name = f"{str(i + 1).zfill(3)}.jpg"
            image_path = os.path.join(chapter_folder_path, image_name)
            tasks.append(executor.submit(download_image, image_url, image_path))
        for task in concurrent.futures.as_completed(tasks):
            task.result()

def prompt_for_url():
    with open(HANMAN_FILE, 'r', encoding='utf-8') as f:
        for line in f:
            name, url = line.strip().split(' ')
            if name.startswith('#'):
                continue
            download_images(url)

def download_error_images():
    if not os.path.exists(ERROR_FILE):
        return
    with open(ERROR_FILE, 'r', encoding='utf-8') as f:
        for line in f:
            url, image_path = line.strip().split(' ')
            download_image(url, image_path)

if __name__ == '__main__':
    download_error_images()
    prompt_for_url()
```
