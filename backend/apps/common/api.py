import uuid
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models import ProtectedError
from rest_framework import serializers
from rest_framework.exceptions import APIException
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import exception_handler

class Conflict(APIException):
    status_code = 409
    default_detail = "This operation conflicts with the current state."
    default_code = "conflict"

class ServiceUnavailable(APIException):
    status_code = 503
    default_detail = "This service is temporarily unavailable. Please try again."
    default_code = "unavailable"

class Pagination(PageNumberPagination):
    page_size = 24
    page_size_query_param = "page_size"
    max_page_size = 100

def handle_exception(exc, context):
    if isinstance(exc, DjangoValidationError):
        exc = serializers.ValidationError(getattr(exc, "message_dict", None) or exc.messages)
    if isinstance(exc, ProtectedError):
        exc = Conflict("This record has transaction history and cannot be deleted.")
    response = exception_handler(exc, context)
    if response is not None:
        response.data = {"error": response.data, "request_id": getattr(context["request"], "request_id", None)}
    return response

class RequestIDMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        request.request_id = uuid.uuid4().hex
        response = self.get_response(request)
        response["X-Request-ID"] = request.request_id
        return response

def idempotency_key(request):
    key = request.headers.get("Idempotency-Key", "")
    if not 8 <= len(key) <= 100 or not key.isascii() or any(c.isspace() for c in key):
        raise serializers.ValidationError({"idempotency_key": "Send an Idempotency-Key header containing 8-100 non-space ASCII characters."})
    return key

def validate_image(image):
    if image.size > 5 * 1024 * 1024:
        raise serializers.ValidationError("Images must be 5 MB or smaller.")
    from PIL import Image
    try:
        picture = Image.open(image)
        if picture.format not in {"JPEG", "PNG", "WEBP"} or picture.width * picture.height > 25000000:
            raise ValueError()
        picture.verify()
    except Exception:
        raise serializers.ValidationError("Upload a valid JPEG, PNG, or WebP image.")
    finally:
        image.seek(0)
    return image

