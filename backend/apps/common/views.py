from django.core.cache import cache
from django.conf import settings
from django.db import connection
from django.http import JsonResponse

def live(request):
    return JsonResponse({"status": "ok"})

def ready(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        cache.set("readiness", True, 10)
        if cache.get("readiness") is not True:
            raise RuntimeError()
        if getattr(settings,"REQUIRE_WORKER_HEARTBEAT",False) and not cache.get("worker:heartbeat"):
            raise RuntimeError()
    except Exception:
        return JsonResponse({"status": "unavailable"}, status=503)
    return JsonResponse({"status": "ready"})
