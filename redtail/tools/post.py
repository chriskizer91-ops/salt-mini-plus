"""The bakes put together: the colour with the shading of its own crevices in it, roughness and metalness in one
picture (glTF's: green rough, blue metal)."""
import numpy as np
from PIL import Image
O = 'redtail/work/bake/out/'
A = np.asarray(Image.open(O + 'albedo.png').convert('RGB')).astype(np.float32) / 255
AO = np.asarray(Image.open(O + 'ao.png').convert('L').resize(A.shape[1::-1], Image.BILINEAR)).astype(np.float32) / 255
lin = A ** 2.2 * (.35 + .65 * AO[..., None]); A2 = np.clip(lin, 0, 1) ** (1 / 2.2)
Image.fromarray((A2 * 255 + .5).astype(np.uint8)).save(O + 'albedo_ao.png')
RMi = np.asarray(Image.open(O + 'rm.png').convert('RGB')).astype(np.float32)
Image.fromarray(RMi.astype(np.uint8)).save(O + 'orm.png')
print('ok', A.shape)
