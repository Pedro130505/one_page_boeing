from PIL import Image
import numpy as np

# 1. Escola de Engenharia - Pure White
ee = Image.open('../onepage_boeing/assets/logos/escola_engenharia_oficial.png').convert('RGBA')
ee_arr = np.array(ee)
ee_white = np.copy(ee_arr)
mask = ee_white[:, :, 3] > 15
ee_white[mask, 0] = 255
ee_white[mask, 1] = 255
ee_white[mask, 2] = 255
Image.fromarray(ee_white).save('../onepage_boeing/assets/logos/escola_engenharia_oficial_branca.png')
print('Escola de Engenharia white saved!')

# 2. DAEE - Pure White
# In poster, daee is cropped in poster_daee.png
daee = Image.open('../onepage_boeing/assets/logos/poster_daee.png').convert('RGBA')
daee_arr = np.array(daee)
# Background is dark blue [0, 62, 99], symbol and text are light
bg = np.array([0, 62, 99])
diff = np.linalg.norm(daee_arr[:, :, :3].astype(float) - bg, axis=2)
alpha = np.clip((diff - 20) / 45.0 * 255, 0, 255).astype(np.uint8)

daee_white = np.zeros_like(daee_arr)
daee_white[:, :, 0] = 255
daee_white[:, :, 1] = 255
daee_white[:, :, 2] = 255
daee_white[:, :, 3] = alpha
Image.fromarray(daee_white).save('../onepage_boeing/assets/logos/daee_oficial_branca.png')
print('DAEE white saved!')

# 3. UFMG Hub - Pure White
hub = Image.open('../onepage_boeing/assets/logos/ufmg_hub_horizontal_completa.png').convert('RGBA')
hub_arr = np.array(hub)
hub_white = np.copy(hub_arr)
mask = hub_white[:, :, 3] > 15
hub_white[mask, 0] = 255
hub_white[mask, 1] = 255
hub_white[mask, 2] = 255
Image.fromarray(hub_white).save('../onepage_boeing/assets/logos/ufmg_hub_horizontal_completa_branca.png')
print('UFMG Hub white saved!')

# 4. UFMG Institucional - Pure White
ufmg = Image.open('../onepage_boeing/assets/logos/ufmg_oficial.png').convert('RGBA')
ufmg_arr = np.array(ufmg)
ufmg_white = np.copy(ufmg_arr)
mask = ufmg_white[:, :, 3] > 15
ufmg_white[mask, 0] = 255
ufmg_white[mask, 1] = 255
ufmg_white[mask, 2] = 255
Image.fromarray(ufmg_white).save('../onepage_boeing/assets/logos/ufmg_oficial_branca.png')
print('UFMG white saved!')

# 5. CEA - Pure White
cea = Image.open('../onepage_boeing/assets/logos/cea_oficial.png').convert('RGBA')
cea_arr = np.array(cea)
cea_white = np.copy(cea_arr)
mask = cea_white[:, :, 3] > 15
cea_white[mask, 0] = 255
cea_white[mask, 1] = 255
cea_white[mask, 2] = 255
Image.fromarray(cea_white).save('../onepage_boeing/assets/logos/cea_oficial_branca.png')
print('CEA white saved!')

# Verify all
for name in ['cea_oficial_branca.png', 'ufmg_hub_horizontal_completa_branca.png', 'escola_engenharia_oficial_branca.png', 'daee_oficial_branca.png', 'ufmg_oficial_branca.png']:
    im = Image.open('../onepage_boeing/assets/logos/' + name).convert('RGBA')
    arr = np.array(im)
    mask = arr[:, :, 3] > 30
    print(name, 'pixels > 30:', np.sum(mask), 'RGB values unique:', np.unique(arr[mask, :3]))
