"""Social-share images (Open Graph, 1200 x 630) per locale, the way §2.4 describes them:
navy, the cell field, the official lockup, one line. Output: public/og/ka.png and public/og/en.png.

Run: python design/tools/make_og.py     Needs Pillow; reads the kit lockup PNG and the cached FiraGO SemiBold.
"""
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
KIT = r"C:\Users\Lenovo\Desktop\Chaster Facebook\final\lockup\horizontal\chaster-lockup-horizontal-custom-r-dark.png"
FONT = os.path.join(os.environ.get("TEMP", "."), "chaster_fonts", "FiraGO-SemiBold.ttf")
OUT = os.path.join(ROOT, "public", "og")
INK, SURFACE, LINE, MUTED = (13, 10, 27), (24, 21, 41), (50, 46, 75), (189, 187, 208)
W, H, PITCH, SS = 1200, 630, 46, 3
LINES = {"ka": "Messenger და Instagram — ერთ მაგიდაზე", "en": "Messenger and Instagram on one desk"}


def field(img):
    """The cell field, cleared in the middle so nothing sits under the lockup or the line (§1.5)."""
    cells = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(cells)
    cx, cy = W / 2, H / 2
    for j in range(-1, H // PITCH + 2):
        for i in range(-1, W // PITCH + 2):
            x, y = i * PITCH + 4, j * PITCH + 4
            mx, my = x + 19 - cx, y + 19 - cy
            # elliptical clearing, full field only near the edges
            k = ((mx / 470) ** 2 + (my / 200) ** 2) ** 0.5
            a = 0 if k < 1 else min(1.0, (k - 1) * 2.2)
            if a <= 0.02:
                continue
            fill = (*SURFACE, int(255 * 0.45 * a))
            line = (*LINE, int(255 * 0.55 * a))
            d.rounded_rectangle([x * SS, y * SS, (x + 38) * SS, (y + 38) * SS], radius=9.5 * SS, fill=fill, outline=line, width=int(1.5 * SS))
    cells = cells.resize((W, H), Image.LANCZOS)
    img.paste(cells, (0, 0), cells)


for lang, text in LINES.items():
    img = Image.new("RGB", (W, H), INK)
    field(img)
    logo = Image.open(KIT).convert("RGB")
    target_h = 150
    logo = logo.resize((int(logo.width * target_h / logo.height), target_h), Image.LANCZOS)
    img.paste(logo, ((W - logo.width) // 2, 200))
    font = ImageFont.truetype(FONT, 38)
    d = ImageDraw.Draw(img)
    tw = d.textlength(text, font=font)
    d.text(((W - tw) / 2, 372), text, font=font, fill=MUTED)
    os.makedirs(OUT, exist_ok=True)
    p = os.path.join(OUT, f"{lang}.png")
    img.save(p, optimize=True)
    print(p, os.path.getsize(p) // 1024, "KB")
