"""Reports the gzipped JS, CSS and HTML the Georgian home page loads (DESIGN-GUIDELINES §2.4 budget: JS under 90 KB gz).

Run after `next build`:  python scripts/bundle-size.py [ka|en]
"""
import gzip
import os
import re
import sys

page = sys.argv[1] if len(sys.argv) > 1 else "ka"
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".next")
html = open(os.path.join(root, "server", "app", f"{page}.html"), encoding="utf-8").read()


def gz(b: bytes) -> int:
    return len(gzip.compress(b, 9))


def path_of(url: str) -> str:
    return os.path.join(root, re.sub(r"\?.*$", "", url).replace("/_next/", ""))


srcs = list(dict.fromkeys(re.findall(r'<script[^>]+src="([^"]+)"', html)))
total = raw = 0
for s in srcs:
    b = open(path_of(s), "rb").read()
    g = gz(b)
    total += g
    raw += len(b)
    print(f"{g / 1024:7.1f} KB gz {len(b) / 1024:7.1f} KB raw  {os.path.basename(path_of(s))}")
print(f"TOTAL JS  {total / 1024:.1f} KB gz ({raw / 1024:.1f} KB raw) in {len(srcs)} files   budget: 90 KB gz")
for c in re.findall(r'href="([^"]+\.css[^"]*)"', html):
    b = open(path_of(c), "rb").read()
    print(f"CSS       {gz(b) / 1024:.1f} KB gz ({len(b) / 1024:.1f} KB raw)")
b = html.encode()
print(f"HTML      {gz(b) / 1024:.1f} KB gz ({len(b) / 1024:.1f} KB raw)")
