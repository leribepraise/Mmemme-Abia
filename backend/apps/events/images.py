"""Generate bounded delivery copies of organizer-uploaded event artwork."""
import hashlib
from io import BytesIO

from django.core.files.base import ContentFile
from django.db import transaction
from PIL import Image, ImageOps

from .models import Event


SIZES = (("image_card", 640), ("image_detail", 1280))


def process_event_image(event_id):
    event = Event.objects.get(pk=event_id)
    if not event.image or (event.image_card and event.image_detail):
        return False
    source_name = event.image.name
    with event.image.open("rb") as source:
        with Image.open(source) as original:
            original.load()
            image = ImageOps.exif_transpose(original)
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
            if image.mode == "RGBA":
                backdrop = Image.new("RGB", image.size, "white")
                backdrop.paste(image, mask=image.getchannel("A"))
                image = backdrop
            digest = hashlib.sha256(source_name.encode()).hexdigest()[:12]
            copies = {}
            for field, width in SIZES:
                if getattr(event, field):
                    continue
                copy = image.copy()
                copy.thumbnail((width, width), Image.Resampling.LANCZOS)
                output = BytesIO()
                copy.save(output, format="WEBP", quality=78, method=4)
                copies[field] = (f"{event.pk}-{digest}-{field}.webp", ContentFile(output.getvalue()))
    for field, (name, content) in copies.items():
        getattr(event, field).save(name, content, save=False)
    with transaction.atomic():
        current = Event.objects.select_for_update().get(pk=event_id)
        if current.image.name != source_name:
            # An edit replaced the original while this copy was being generated.
            for field in copies:
                getattr(event, field).delete(save=False)
            return False
        for field in copies:
            setattr(current, field, getattr(event, field).name)
        current.save(update_fields=list(copies))
    return bool(copies)
