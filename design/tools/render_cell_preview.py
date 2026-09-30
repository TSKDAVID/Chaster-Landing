"""Preview of the Chaster cell system: module marks, cell pictograms, cell numerals.

Run: python design/tools/render_cell_preview.py
Output: design/cell-system-preview.png
Geometry follows final/src/geom.py (cell 28, gap 6, r 7, outer R 19). Corners here are
circular (PIL); production SVG uses the continuous-corner paths from the brand kit.
"""
import os
from PIL import Image, ImageChops, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "cell-system-preview.png")
FONT = os.path.join(os.environ.get("TEMP", "."), "chaster_fonts", "FiraGO-Medium.ttf")

INK, SURFACE, LINE, MUTED, WHITE = "#0D0A1B", "#181529", "#322E4B", "#9D99C2", "#FFFFFF"
SIGNAL = {
    "inbox": "#AB97FF",
    "knowledge": "#58B0FE",
    "hours": "#5AC376",
    "catalog": "#D0A30F",
    "media": "#EA81BF",
    "bookings": "#0BC1C8",
    "resources": "#EE8F3D",
}
MISSED = "#F75D59"
SS = 4  # supersampling

MARK_CELLS = [(0, 0), (1, 0), (2, 0), (0, 1), (0, 2), (1, 2), (2, 2)]
SIGNAL_CELL = (2, 0)

PICTOGRAMS = {
    "inbox": [".#####.", "#.....#", "#.*##.#", "#.....#", ".#####.", "..#....", ".#....."],
    "knowledge": ["..###..", ".#...#.", ".....#.", "...##..", "...#...", ".......", "...*..."],
    "hours": ["..###..", ".#...#.", "#..#..#", "#..*#.#", "#.....#", ".#...#.", "..###.."],
    "catalog": [".......", "..#####", ".#....#", "#..*..#", ".#....#", "..#####", "......."],
    "media": [".......", "#######", "#...*.#", "#..#..#", "#.###.#", "#######", "......."],
    "bookings": ["#######", ".......", "#.#.#.#", ".......", "#.#.*.#", ".......", "#.#.#.#"],
    "resources": [".......", ".#...*.", ".......", "###.###", "###.###", "###.###", "......."],
}

GLYPHS = {
    "0": [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
    "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
    "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
    "3": ["####.", "....#", "....#", ".###.", "....#", "....#", "####."],
    "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
    "5": ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
    "6": ["..##.", ".#...", "#....", "####.", "#...#", "#...#", ".###."],
    "7": ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
    "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
    "9": [".###.", "#...#", "#...#", ".####", "....#", "...#.", ".##.."],
    "₾": ["..#.#..", ".#####.", "#.#.#.#", "#.....#", "#......", "#......", ".######"],
    "×": [".....", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "....."],
    "?": [".###.", "#...#", "....#", "..##.", "..#..", ".....", "..#.."],
    ":": [".", ".", "#", ".", ".", "#", "."],
    " ": ["..", "..", "..", "..", "..", "..", ".."],
}


def cell_mask(size, r, big=None, big_corner=None):
    """Rounded square mask; optionally one outer corner (0 = top-left, 3 = bottom-left) swept with radius `big`."""
    m = Image.new("L", (size, size), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, size - 1, size - 1), radius=r, fill=255)
    if big and big_corner is not None:
        b = Image.new("L", (size, size), 255)
        db = ImageDraw.Draw(b)
        if big_corner == 0:
            db.rectangle((0, 0, big, big), fill=0)
            db.ellipse((0, 0, 2 * big, 2 * big), fill=255)
        else:
            db.rectangle((0, size - big, big, size), fill=0)
            db.ellipse((0, size - 2 * big, 2 * big, size), fill=255)
        m = ImageChops.multiply(m, b)
    return m


def paste_cell(img, x, y, size, color, big_corner=None, ring=0):
    s = size * SS
    m = cell_mask(s, int(s * 7 / 28), int(s * 19 / 28) if big_corner is not None else None, big_corner)
    if ring:
        inner = cell_mask(s - 2 * ring * SS, int((s - 2 * ring * SS) * 7 / 28))
        hole = Image.new("L", (s, s), 0)
        hole.paste(inner, (ring * SS, ring * SS))
        m = ImageChops.subtract(m, hole)
    m = m.resize((size, size), Image.LANCZOS)
    img.paste(Image.new("RGB", (size, size), color), (int(x), int(y)), m)


def draw_mark(img, x, y, cell, signal):
    gap = cell * 6 / 28
    for (i, j) in MARK_CELLS:
        corner = 0 if (i, j) == (0, 0) else 3 if (i, j) == (0, 2) else None
        color = signal if (i, j) == SIGNAL_CELL else WHITE
        paste_cell(img, x + i * (cell + gap), y + j * (cell + gap), cell, color, corner)
    return 3 * cell + 2 * gap


def draw_bitmap(img, x, y, rows, cell, signal=None, on=WHITE):
    gap = max(1, round(cell * 6 / 28))
    for j, row in enumerate(rows):
        for i, ch in enumerate(row):
            if ch == ".":
                continue
            paste_cell(img, x + i * (cell + gap), y + j * (cell + gap), cell, signal if ch == "*" else on)
    return len(rows[0]) * (cell + gap) - gap


def draw_text_cells(img, x, y, text, cell, color=WHITE):
    gap = max(1, round(cell * 6 / 28))
    for ch in text:
        w = draw_bitmap(img, x, y, GLYPHS[ch], cell, on=color)
        x += w + 2 * (cell + gap) - gap
    return x


def main():
    W, H = 1600, 1080
    img = Image.new("RGB", (W, H), INK)
    d = ImageDraw.Draw(img)
    label = ImageFont.truetype(FONT, 20) if os.path.exists(FONT) else ImageFont.load_default()
    small = ImageFont.truetype(FONT, 17) if os.path.exists(FONT) else ImageFont.load_default()

    d.text((64, 48), "Module marks: six structure cells stay white, the signal cell names the module", font=label, fill=MUTED)
    x = 64
    for name, color in SIGNAL.items():
        draw_mark(img, x, 96, 40, color)
        d.text((x, 256), name, font=small, fill=WHITE)
        d.text((x, 280), color, font=small, fill=MUTED)
        x += 212

    d.line((64, 340, W - 64, 340), fill=LINE, width=1)
    d.text((64, 368), "Cell pictograms (7 x 7): exactly one signal cell each", font=label, fill=MUTED)
    x = 64
    for name, rows in PICTOGRAMS.items():
        draw_bitmap(img, x, 416, rows, 18, SIGNAL[name])
        d.text((x, 600), name, font=small, fill=WHITE)
        x += 212

    d.line((64, 660, W - 64, 660), fill=LINE, width=1)
    d.text((64, 688), "Cell numerals (5 x 7) for prices and counters", font=label, fill=MUTED)
    draw_text_cells(img, 64, 740, "20 ₾", 16)
    draw_text_cells(img, 560, 740, "3:00", 16, MISSED)
    draw_text_cells(img, 1060, 740, "100×", 16)
    draw_text_cells(img, 64, 960, "0123456789", 8)

    d.text((900, 960), "States:", font=small, fill=MUTED)
    paste_cell(img, 980, 950, 40, WHITE)
    d.text((1030, 960), "arrived", font=small, fill=WHITE)
    paste_cell(img, 1130, 950, 40, WHITE, ring=4)
    d.text((1180, 960), "yours", font=small, fill=WHITE)
    paste_cell(img, 1270, 950, 40, MISSED)
    d.text((1320, 960), "missed", font=small, fill=WHITE)
    paste_cell(img, 1420, 950, 40, SIGNAL["inbox"])
    d.text((1470, 960), "answered", font=small, fill=WHITE)

    img.save(OUT)
    print(os.path.abspath(OUT))


if __name__ == "__main__":
    main()
