from PIL import Image
import numpy as np

img = Image.open('C:/Users/brand/.gemini/antigravity/brain/458b300c-3c1c-43d4-a49e-022e4d559acd/.user_uploaded/media_1795115785107_a2c23b45.jpg').convert('RGB')
w, h = img.size

# The logo strip is the bottom-most bar, from y = 840 to 895
strip = img.crop((25, 840, 715, 895))
strip.save('../onepage_boeing/assets/logos/poster_bottom_strip.png')
print('Poster bottom strip saved:', strip.size)

# Convert to pure white with transparency:
arr = np.array(strip)
# The text and icons in this strip are white
# The background is deep blue ~ [0, 64, 102]
bg = np.array([0, 64, 102])
diff = np.linalg.norm(arr.astype(float) - bg, axis=2)

# Mask where brightness is significantly higher than bg
bright = np.mean(arr, axis=2)
alpha = np.clip((bright - 80) / 70.0 * 255, 0, 255).astype(np.uint8)

white_strip = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
white_strip[:, :, 0] = 255
white_strip[:, :, 1] = 255
white_strip[:, :, 2] = 255
white_strip[:, :, 3] = alpha

Image.fromarray(white_strip).save('../onepage_boeing/assets/logos/faixa_logos_poster_branca.png')
print('Faixa logos branca saved!')
