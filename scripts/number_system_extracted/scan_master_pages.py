import cv2
import easyocr
import os

reader = easyocr.Reader(['en'], gpu=False)

for p in range(316, 337):
    fpath = f'scripts/number_system_extracted/master_pages/master_p{p}.png'
    if not os.path.exists(fpath):
        continue
    img = cv2.imread(fpath)
    h, w, _ = img.shape
    top_img = img[:int(h*0.08), :]
    tl_img = img[int(h*0.06):int(h*0.14), :int(w*0.35)]
    top_txt = ' '.join(reader.readtext(top_img, detail=0))
    tl_txt = ' '.join(reader.readtext(tl_img, detail=0))
    print(f'Page {p}: Top="{top_txt}" | TL="{tl_txt}"')
