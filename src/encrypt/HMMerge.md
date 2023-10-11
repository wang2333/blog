---
title: 韩漫合并
icon: lock
article: false
---

# 韩漫合并

```python
import os
from PIL import Image

THUMBNAIL_WIDTH = 300
MAX_PIXELS = 65500

def read_folders(dir):
    folders = [os.path.join(dir, folder) for folder in os.listdir(dir) if os.path.isdir(os.path.join(dir, folder)) and folder != 'output']
    return folders

def read_files(dir):
    image_files = [os.path.join(dir, file) for file in os.listdir(dir) if os.path.isfile(os.path.join(dir, file)) and file.lower().endswith('.jpg') and file[:3].isdigit()]
    image_files.sort()
    return image_files

def create_thumbnail(file):
    image = Image.open(file)
    width, height = image.size
    thumbnail_height = int(THUMBNAIL_WIDTH * height / width)
    image.thumbnail((THUMBNAIL_WIDTH, thumbnail_height))
    return image

def save_image(image, basename, output_path):
    if image.size[1] > MAX_PIXELS:
        # Split the image into two parts
        original_height = image.size[1]
        half_height = original_height // 2

        # Save the first part
        image_1 = image.crop((0, 0, THUMBNAIL_WIDTH, half_height))
        output_path_1 = f"{output_path}-1.jpg"
        image_1.save(output_path_1, optimize=True, quality=90)
        print(f"{basename}-1.jpg 保存成功")

        # Save the second part
        image_2 = image.crop((0, half_height, THUMBNAIL_WIDTH, original_height))
        output_path_2 = f"{output_path}-2.jpg"
        image_2.save(output_path_2, optimize=True, quality=90)
        print(f"{basename}-2.jpg 保存成功")
    else:
        # Save the image as a single file
        output_path = f"{output_path}.jpg"
        image.save(output_path, optimize=True, quality=90)
        print(f"{basename}.jpg 保存成功")

def merge_images(files):
    images = [create_thumbnail(file) for file in files]
    heights = [image.size[1] for image in images]
    total_height = sum(heights)
    width = THUMBNAIL_WIDTH
    merged = Image.new('RGB', (width, total_height), color='black')

    y_offset = 0
    for image in images:
        merged.paste(image, (0, y_offset))
        y_offset += image.size[1]

    return merged

def process_folder(folder):
    files = read_files(folder)
    if len(files) == 0:
        return

    basename = os.path.basename(folder).split(' ')[0]
    output_path = os.path.join(OUTPUT_DIR, basename)
    if os.path.exists(output_path):
        print(f"{basename}已存在，跳过")
        return

    merged = merge_images(files)
    save_image(merged, basename, output_path)
    print(f"{basename}合并完成")

def main():
    global INPUT_DIR, OUTPUT_DIR
    INPUT_DIR = input("请输入需要合并图片的文件夹：")
    OUTPUT_DIR = os.path.join(INPUT_DIR, "output")

    try:
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        folders = read_folders(INPUT_DIR)
        print(f"已找到{len(folders)}个文件夹，开始合并图片，请稍等...")

        for folder in folders:
            process_folder(folder)

        print(f"合并图片完成，输出目录: {OUTPUT_DIR}")
    except Exception as e:
        print(f"合并图片失败: {e}")

if __name__ == "__main__":
    main()

```
