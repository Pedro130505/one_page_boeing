from PIL import Image
import os

base_dir = r'C:/Users/brand/.gemini/antigravity/brain/458b300c-3c1c-43d4-a49e-022e4d559acd'
mob_path = os.path.join(base_dir, 'screenshot_mobile_boeing.png')
im = Image.open(mob_path)
w, h = im.size
print('Mobile size:', w, h)

# Mobile Hero (0 to 1200)
im.crop((0, 0, w, 1200)).save(os.path.join(base_dir, 'crop_mob_hero.png'))

print('Mobile crop saved!')
