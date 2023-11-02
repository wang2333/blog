---
title: 韩漫合并
icon: fas fa-spider
article: false
---

# 韩漫合并

```python
import os
import glob
from PIL import Image
from concurrent.futures import ThreadPoolExecutor

THUMBNAIL_WIDTH = 300
MAX_PIXELS = 65500

    # 获取文件夹中的所有子文件夹路径
def read_folders(dir):
    return [entry.path for entry in os.scandir(dir) if entry.is_dir() and entry.name != 'output']

    # 获取文件夹中的所有.jpg文件
def read_files(dir):
    pattern = os.path.join(dir, '[0-9][0-9][0-9]*.jpg')
    return sorted(glob.glob(pattern))

    # 为给定的图片文件创建缩略图
def create_thumbnail(file):
    image = Image.open(file)
    width, height = image.size
    thumbnail_height = int(THUMBNAIL_WIDTH * height / width)
    image.thumbnail((THUMBNAIL_WIDTH, thumbnail_height))
    return image

    # 保存图片到给定的目录
def save_image(image, output_path):
    if image.size[1] > MAX_PIXELS:
        original_height = image.size[1]
        half_height = original_height // 2

        image_1 = image.crop((0, 0, THUMBNAIL_WIDTH, half_height))
        output_path_1 = f"{output_path}-1.jpg"
        image_1.save(output_path_1, optimize=True, quality=90)

        image_2 = image.crop((0, half_height, THUMBNAIL_WIDTH, original_height))
        output_path_2 = f"{output_path}-2.jpg"
        image_2.save(output_path_2, optimize=True, quality=90)
    else:
        output_path = f"{output_path}.jpg"
        image.save(output_path, optimize=True, quality=90)

    # 合并一系列的图片
def merge_images(files):
    with ThreadPoolExecutor() as executor:
        images = list(executor.map(create_thumbnail, files))
    heights = [image.size[1] for image in images]
    total_height = sum(heights)
    width = THUMBNAIL_WIDTH
    merged = Image.new('RGB', (width, total_height), color='black')

    y_offset = 0
    for image in images:
        merged.paste(image, (0, y_offset))
        y_offset += image.size[1]

    return merged

    #  处理文件夹，读取文件，创建并保存缩略图
def process_folder(folder):
    files = read_files(folder)
    if len(files) == 0:
        return

    basename = os.path.basename(folder).split(' ')[1]
    output_path = os.path.join(OUTPUT_DIR, basename)
    if os.path.exists(output_path + '.jpg'):
        print(f"已存在{basename}，跳过")
        return

    merged = merge_images(files)
    save_image(merged, output_path)
    print(f"合并完成{basename}")


def main():
    global INPUT_DIR, OUTPUT_DIR
    INPUT_DIR = input("请输入需要合并图片的文件夹：")
    OUTPUT_DIR = os.path.join(INPUT_DIR, "output")

    try:
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        folders = read_folders(INPUT_DIR)

        with ThreadPoolExecutor() as executor:
            executor.map(process_folder, folders)

        print(f"合并图片完成，输出目录: {OUTPUT_DIR}")
    except Exception as e:
        print(f"合并图片失败: {e}")

if __name__ == "__main__":
    main()

```
