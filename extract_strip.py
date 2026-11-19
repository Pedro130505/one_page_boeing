from PIL import Image
import numpy as np

img = Image.open('C:/Users/brand/.gemini/antigravity/brain/458b300c-3c1c-43d4-a49e-022e4d559acd/.user_uploaded/media_1795115785107_a2c23b45.jpg').convert('RGB')
w, h = img.size
print('Original size:', w, h)

# Search bottom 15% (y from h - 130 to h)
bottom = np.array(img)[h - 130:h, :, :]
bright = np.mean(bottom, axis=2) > 180
y_idx, x_idx = np.where(bright)
print('Y range of bright pixels:', y_idx.min() + h - 130, 'to', y_idx.max() + h - 130)
print('X range of bright pixels:', x_idx.min(), 'to', x_idx.max())

# Let's crop the entire bottom logo strip exactly around the logos!
y1 = y_idx.min() + h - 130 - 10
y2 = y_idx.max() + h - 130 + 10
x1 = max(0, x_idx.min() - 10)
x2 = min(w, x_idx.max() + 10)

strip = img.crop((x1, y1, x2, y2))
strip.save('../onepage_boeing/assets/logos/bottom_strip_exact.png')
print('Exact strip saved! Size:', strip.size)

# Now convert the exact strip to pure white with transparency:
strip_arr = np.array(strip)
bg = np.median(strip_arr[:5, :5, :3], axis=(0,1))
print('BG color:', bg)
diff = np.linalg.norm(strip_arr.astype(float) - bg, axis=2)
alpha = np.clip((diff - 30) / 50.0 * 255, 0, 255).astype(np.uint8)

white_strip = np.zeros((strip_arr.shape[0], strip_arr.shape[1], 4), dtype=np.uint8)
white_strip[:, :, 0] = 255
white_strip[:, :, 1] = 255
white_strip[:, :, 2] = 255
white_strip[:, :, 3] = alpha

Image.fromarray(white_strip).save('../onepage_boeing/assets/logos/logos_parceiros_unificados_branca.png')
print('Unified transparent white logos strip saved!')
