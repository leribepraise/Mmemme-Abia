"""Create versioned WebP delivery copies. Original artwork is kept unchanged.

Run with backend/venv/Scripts/python.exe optimize_frontend_images.py.
The generated files and manifest are committed, so Railway needs no image tools.
"""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent / 'my-project'
public = root / 'public'
output = public / 'optimized'
output.mkdir(exist_ok=True)
manifest = {}
before = after = 0
for path in sorted(public.rglob('*')):
    if not path.is_file() or output in path.parents or path.suffix.lower() not in {'.png', '.jpg', '.jpeg'} or path.stat().st_size < 65000:
        continue
    with Image.open(path) as original:
        if getattr(original, 'is_animated', False): continue
        picture = ImageOps.exif_transpose(original)
        picture.thumbnail((1600,1600), Image.Resampling.LANCZOS)
        if picture.mode not in {'RGB','RGBA'}: picture = picture.convert('RGBA' if 'transparency' in picture.info else 'RGB')
        from io import BytesIO
        stream=BytesIO(); picture.save(stream, format='WEBP', quality=82, method=6)
        encoded=stream.getvalue()
        if len(encoded) >= path.stat().st_size: continue
        name=hashlib.sha256(encoded).hexdigest()[:20]+'.webp'
        (output/name).write_bytes(encoded)
        manifest['/'+path.relative_to(public).as_posix()]={'src':'/optimized/'+name,'width':picture.width,'height':picture.height}
        before += path.stat().st_size; after += len(encoded)
(root/'src/lib/imageAssets.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'optimized_images':len(manifest),'original_bytes':before,'delivery_bytes':after,'reduction_percent':round((1-after/before)*100,1) if before else 0}))
