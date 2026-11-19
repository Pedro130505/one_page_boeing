from PIL import Image
import numpy as np

strip = Image.open('../onepage_boeing/assets/logos/poster_bottom_strip.png')
# DAEE is around x from 350 to 550
daee_crop = strip.crop((345, 0, 520, 55))
daee_crop.save('../onepage_boeing/assets/logos/daee_crop_raw.png')

arr = np.array(daee_crop)
bright = np.mean(arr, axis=2)
alpha = np.clip((bright - 75) / 60.0 * 255, 0, 255).astype(np.uint8)

daee_white = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
daee_white[:, :, 0] = 255
daee_white[:, :, 1] = 255
daee_white[:, :, 2] = 255
daee_white[:, :, 3] = alpha

Image.fromarray(daee_white).save('../onepage_boeing/assets/logos/daee_oficial_branca.png')
print('DAEE clean white saved!')
