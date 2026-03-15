"""
Process Logo PB 01.jpg:
- Remove background → transparent PNG
- Generate favicon.ico (multi-size)
- Output OKLCH color palette based on logo colors
"""

import math
from PIL import Image

# ── OKLCH conversion helpers ─────────────────────────────────────────────────

def srgb_to_linear(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def linear_to_srgb(c):
    c = max(0.0, min(1.0, c))
    return c * 12.92 if c <= 0.0031308 else 1.055 * (c ** (1 / 2.4)) - 0.055

def rgb_to_oklch(r, g, b):
    rl = srgb_to_linear(r)
    gl = srgb_to_linear(g)
    bl = srgb_to_linear(b)

    # Linear RGB → LMS (OKLab's first matrix)
    l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl
    m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl
    s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl

    l_ = l ** (1/3)
    m_ = m ** (1/3)
    s_ = s ** (1/3)

    # LMS → OKLab
    L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
    a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
    b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_

    C = math.sqrt(a**2 + b2**2)
    H = math.degrees(math.atan2(b2, a)) % 360

    return round(L * 100, 1), round(C, 4), round(H, 1)


# ── Analyze colors ───────────────────────────────────────────────────────────

img = Image.open("public/uploads/media/Logo PB 01.jpg").convert("RGB")
print(f"Image size: {img.size}")

bg_color = (244, 240, 237)  # #f4f0ed
logo_teal = (55, 112, 119)  # #377077
logo_light = (145, 170, 174) # #91aaae

print("\n─── OKLCH values ───")
for name, rgb in [("bg (cream)", bg_color), ("primary (teal)", logo_teal), ("mid teal", logo_light)]:
    L, C, H = rgb_to_oklch(*rgb)
    print(f"  {name}: rgb{rgb} → oklch({L}% {C} {H})")

# ── Remove background → transparent PNG ────────────────────────────────────

def color_distance(c1, c2):
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(c1, c2)))

img_rgba = img.convert("RGBA")
pixels = img_rgba.load()
w, h = img_rgba.size

BG_THRESHOLD = 28  # tolerance for background removal

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if color_distance((r, g, b), bg_color) < BG_THRESHOLD:
            pixels[x, y] = (r, g, b, 0)

# Save transparent PNG
out_path = "public/uploads/media/logo-pebbles.png"
img_rgba.save(out_path, "PNG")
print(f"\n✓ Transparent PNG saved → {out_path}")

# ── Favicon ──────────────────────────────────────────────────────────────────

favicon_img = img_rgba.copy()

# Crop to content bounding box
bbox = favicon_img.getbbox()
if bbox:
    favicon_img = favicon_img.crop(bbox)

# Add small padding (5%)
pad = int(max(favicon_img.size) * 0.05)
new_size = (favicon_img.width + pad * 2, favicon_img.height + pad * 2)
padded = Image.new("RGBA", new_size, (0, 0, 0, 0))
padded.paste(favicon_img, (pad, pad))

# Save multi-size ICO
sizes = [(16, 16), (32, 32), (48, 48)]
icons = [padded.resize(s, Image.LANCZOS) for s in sizes]
icons[0].save(
    "public/favicon.ico",
    format="ICO",
    sizes=sizes,
    append_images=icons[1:],
)
print("✓ favicon.ico saved → public/favicon.ico")

# Also save 32x32 PNG for use in head link tag
padded.resize((32, 32), Image.LANCZOS).save("public/favicon-32.png", "PNG")
padded.resize((180, 180), Image.LANCZOS).save("public/apple-touch-icon.png", "PNG")
print("✓ favicon-32.png saved → public/favicon-32.png")
print("✓ apple-touch-icon.png saved → public/apple-touch-icon.png")
