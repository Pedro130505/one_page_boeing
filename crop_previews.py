from PIL import Image
import os

base_dir = r'C:/Users/brand/.gemini/antigravity/brain/458b300c-3c1c-43d4-a49e-022e4d559acd'
desktop_path = os.path.join(base_dir, 'screenshot_desktop_boeing.png')
im = Image.open(desktop_path)
w, h = im.size
print('Desktop size:', w, h)

# Crop 1: Hero + Co-brands (0 to 1150)
im.crop((0, 0, w, 1150)).save(os.path.join(base_dir, 'crop_1_hero.png'))

# Crop 2: Palestras dos Engenheiros da Boeing (1150 to 2050)
im.crop((0, 1150, w, 2050)).save(os.path.join(base_dir, 'crop_2_palestras.png'))

# Crop 3: História CEA + Bloco de Ligação (2050 to 2950)
im.crop((0, 2050, w, 2950)).save(os.path.join(base_dir, 'crop_3_sobre_local.png'))

# Crop 4: Formulário de Inscrição (2950 to 3950)
im.crop((0, 2950, w, 3950)).save(os.path.join(base_dir, 'crop_4_formulario.png'))

print('All section crops saved successfully!')
