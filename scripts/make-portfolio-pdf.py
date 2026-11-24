"""Print the built Astro portfolio and fail the build if any page flows incorrectly."""
import logging
import shutil
from html.parser import HTMLParser
from io import BytesIO
from pathlib import Path
from urllib.parse import unquote, urlsplit

from PIL import Image, ImageOps
from weasyprint import HTML
from weasyprint.urls import URLFetcher, URLFetcherResponse

DIST = Path('dist').resolve()
PRINT_DIR = DIST / 'portfolio-print'


class PrintTemplate(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sheets = []
        self.output = None

    def handle_starttag(self, tag, raw_attrs):
        attrs = dict(raw_attrs)
        if tag == 'section' and 'sheet' in attrs.get('class', '').split():
            self.sheets.append(attrs['id'])
        if tag == 'meta' and attrs.get('name') == 'portfolio-pdf':
            self.output = attrs['content']


class BuildAssetFetcher(URLFetcher):
    def fetch(self, url, headers=None):
        location = urlsplit(url)
        if location.scheme == 'data':
            return super().fetch(url, headers)
        if location.hostname != 'build.invalid' and location.scheme != 'file':
            raise ValueError(f'Aset cetak harus berasal dari hasil build: {url}')
        file = Path(unquote(location.path)) if location.scheme == 'file' else DIST / unquote(location.path).lstrip('/')
        file = file.resolve()
        if DIST not in file.parents:
            raise ValueError(f'Aset cetak tidak valid: {url}')
        # Keep UI captures and QR codes lossless. Resize and compress print artwork
        # separately so original website assets stay intact and downloads stay small.
        if file.is_relative_to(DIST / 'assets') and file.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp'}:
            if not file.is_relative_to(DIST / 'assets/composelab') and file.name != 'website-qr.png':
                with Image.open(file) as source_image:
                    image = ImageOps.exif_transpose(source_image).convert('RGBA')
                    image.thumbnail((1320, 1320), Image.Resampling.LANCZOS)
                    background = '#10213c' if file.name == 'logo 3.png' else 'white'
                    flat = Image.new('RGB', image.size, background)
                    flat.paste(image, mask=image.getchannel('A'))
                    output = BytesIO()
                    flat.save(output, format='JPEG', quality=88, optimize=True, subsampling=2)
                return URLFetcherResponse(url, output.getvalue(), {'Content-Type': 'image/jpeg'})
        return super().fetch(file.as_uri(), headers)


class RenderingErrors(logging.Handler):
    def __init__(self):
        super().__init__(logging.ERROR)
        self.messages = []

    def emit(self, record):
        self.messages.append(record.getMessage())


source = (PRINT_DIR / 'index.html').read_text(encoding='utf-8')
template = PrintTemplate()
template.feed(source)
output = DIST / template.output.lstrip('/')
if output.parent != DIST / 'assets/portfolio' or output.suffix != '.pdf' or not template.sheets:
    raise SystemExit('Template portofolio tidak memuat lokasi PDF atau halaman yang valid.')
errors = RenderingErrors()
logging.getLogger('weasyprint').addHandler(errors)
document = HTML(string=source, base_url='https://build.invalid/', url_fetcher=BuildAssetFetcher()).render()
if errors.messages:
    raise SystemExit('\n'.join(errors.messages))

for page_number, page in enumerate(document.pages, 1):
    expected = template.sheets[page_number - 1] if page_number <= len(template.sheets) else None
    if expected not in page.anchors:
        raise SystemExit(f'Susunan PDF berubah di halaman {page_number}, seharusnya {expected}.')
if len(document.pages) != len(template.sheets):
    raise SystemExit(f'Jumlah halaman PDF tidak sesuai: {len(document.pages)} dari {len(template.sheets)}.')

output.parent.mkdir(parents=True, exist_ok=True)
temporary = output.with_suffix('.tmp')
document.write_pdf(temporary, optimize_images=True, jpeg_quality=89, dpi=240)
temporary.replace(output)
shutil.rmtree(PRINT_DIR)
print(f'Portofolio PDF — {len(document.pages)} halaman — {template.output}')
