import fitz
import easyocr
import numpy as np
from PIL import Image
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')

reader = easyocr.Reader(['en'], gpu=False)
doc2 = fitz.open(r"C:\Users\hp\Downloads\Neetu singh English Vol. 2.pdf")

for p in [2, 3, 4, 5]:
    page = doc2[p]
    pix = page.get_pixmap(dpi=120)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    img_np = np.array(img)
    results = reader.readtext(img_np, detail=0)
    text = " ".join(results)
    print(f"=== Page {p+1} ===")
    print(text[:300])

doc2.close()
