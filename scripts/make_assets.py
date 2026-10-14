"""Create original course identity assets. Requires Pillow only; not needed to run the site."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
INK = '#263E34'
PAPER = '#F8F8F3'


def font(size, serif=False):
    path = Path('C:/Windows/Fonts/georgia.ttf' if serif else 'C:/Windows/Fonts/arial.ttf')
    if not path.exists():
        path = Path('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf' if serif else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
    return ImageFont.truetype(str(path), size)


def outfit(draw, x, y, scale, colors):
    def points(coords):
        return [(round(x + a * scale), round(y + b * scale)) for a, b in coords]
    def polygon(coords, fill):
        draw.polygon(points(coords), fill=fill)
        draw.line(points(coords + [coords[0]]), fill='#6F786C', width=max(1, round(scale)))
    polygon([(65, 8), (42, 17), (6, 44), (24, 78), (45, 65), (43, 139), (157, 139), (155, 65), (176, 78), (194, 44), (158, 17), (135, 8), (121, 20), (79, 20)], colors[0])
    draw.line(points([(65, 8), (78, 32), (100, 37), (122, 32), (135, 8)]), fill='#8F9C8A', width=max(1, round(scale)))
    draw.line(points([(44, 132), (100, 136), (156, 132)]), fill='#8F9C8A', width=max(1, round(scale)))
    polygon([(48, 157), (152, 157), (161, 322), (110, 322), (100, 211), (90, 322), (39, 322)], colors[1])
    draw.line(points([(48, 167), (152, 167)]), fill='#7B8478', width=max(1, round(scale)))
    draw.line(points([(69, 180), (63, 314)]), fill='#6F786C', width=max(1, round(scale)))
    draw.line(points([(131, 180), (137, 314)]), fill='#6F786C', width=max(1, round(scale)))
    polygon([(44, 341), (81, 341), (91, 363), (22, 363), (22, 354), (40, 350)], colors[2])
    polygon([(119, 341), (156, 341), (160, 350), (178, 354), (178, 363), (109, 363)], colors[2])
    draw.line(points([(23, 359), (90, 359)]), fill='#ACB2A3', width=max(1, round(scale)))
    draw.line(points([(110, 359), (177, 359)]), fill='#ACB2A3', width=max(1, round(scale)))


def create():
    (ROOT / 'images').mkdir(exist_ok=True)
    icon = Image.new('RGB', (512, 512), '#E9EDE2')
    d = ImageDraw.Draw(icon)
    d.polygon([(183, 122), (134, 143), (57, 201), (95, 273), (145, 241), (141, 389), (371, 389), (367, 241), (417, 273), (455, 201), (378, 143), (329, 122), (300, 147), (212, 147)], fill=INK)
    d.arc((182, 94, 330, 206), 5, 175, fill='#C7AD8A', width=14)
    for name, size in [('icon-512.png', 512), ('favicon-192.png', 192), ('apple-touch-icon.png', 180), ('favicon-32.png', 32)]:
        icon.resize((size, size), Image.Resampling.LANCZOS).save(ROOT / name, optimize=True)
    cover = Image.new('RGB', (1200, 630), PAPER)
    d = ImageDraw.Draw(cover)
    for i, color in enumerate(['#78866B', '#C7AD8A', '#7AA5C6', '#B9654D']):
        a, b = 66 + (i % 2) * 16, 58 + (i // 2) * 16
        d.rounded_rectangle((a, b, a + 12, b + 12), 2, fill=color)
    d.text((110, 58), 'A LITTLE THEORY. A LOT OF YOU.', font=font(15), fill='#6A736A')
    d.text((63, 173), 'Outfit', font=font(79, True), fill=INK)
    d.text((63, 263), 'Color Lab', font=font(79, True), fill=INK)
    d.text((67, 384), 'Explore colors before', font=font(24), fill='#4E5951')
    d.text((67, 418), 'you get dressed.', font=font(24), fill='#4E5951')
    d.line((67, 511, 460, 511), fill='#D8DED1', width=1)
    d.text((67, 536), 'YOUR WARDROBE, REMIXED.', font=font(14), fill='#6A736A')
    combinations = [('#7AA5C6', '#30343B', '#F7F4EC'), ('#78866B', '#C7AD8A', '#F7F4EC'), ('#B9654D', '#30343B', '#F7F4EC')]
    for i, colors in enumerate(combinations):
        x = 526 + i * 213
        d.rounded_rectangle((x, 108, x + 195, 522), 7, fill=['#E3EAF0', '#E7EBE1', '#F0E5DE'][i])
        d.text((x + 17, 128), f'LOOK / 0{i + 1}', font=font(10), fill='#6A736A')
        outfit(d, x + 12, 164, .86, colors)
        for j, color in enumerate(colors):
            d.ellipse((x + 69 + j * 20, 495, x + 80 + j * 20, 506), fill=color, outline='#BBC2B4')
    destination = ROOT / 'images' / 'og-image.jpg'
    cover.save(destination, quality=88, optimize=True, progressive=True)
    assert destination.stat().st_size < 100_000, 'Course cover must be below 100 KB'
    print(f'Created original icons and 1200 x 630 cover ({destination.stat().st_size:,} bytes).')


if __name__ == '__main__':
    create()
