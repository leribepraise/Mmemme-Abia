from .base import *
from urllib.parse import urlparse, unquote
from django.core.exceptions import ImproperlyConfigured

DEBUG = False
def required(name):
    value=os.getenv(name,"").strip()
    if not value: raise ImproperlyConfigured(f"{name} must be configured for production.")
    return value

if not SECRET_KEY or len(SECRET_KEY)<50 or SECRET_KEY.startswith(("django-insecure-","replace-")):
    raise ImproperlyConfigured("Configure a strong production SECRET_KEY of at least 50 characters.")
ALLOWED_HOSTS=[x.strip() for x in required("ALLOWED_HOSTS").split(",") if x.strip()]
if "*" in ALLOWED_HOSTS: raise ImproperlyConfigured("Use explicit production ALLOWED_HOSTS.")
database=urlparse(required("DATABASE_URL"))
if database.scheme not in {"postgres","postgresql"}: raise ImproperlyConfigured("Production requires PostgreSQL.")
DATABASES={"default":{"ENGINE":"django.db.backends.postgresql","NAME":unquote(database.path.lstrip("/")),"USER":unquote(database.username or ""),"PASSWORD":unquote(database.password or ""),"HOST":database.hostname,"PORT":database.port or 5432,"CONN_MAX_AGE":60,"CONN_HEALTH_CHECKS":True,"OPTIONS":{"sslmode":os.getenv("DB_SSLMODE","require"),"connect_timeout":10}}}
CACHES={"default":{"BACKEND":"django.core.cache.backends.redis.RedisCache","LOCATION":required("REDIS_URL")}}
EMAIL_PROVIDER=os.getenv("EMAIL_PROVIDER","smtp").strip().lower()
if EMAIL_PROVIDER == "resend":
    EMAIL_BACKEND="apps.notifications.backends.ResendEmailBackend"
    RESEND_API_KEY=required("RESEND_API_KEY")
elif EMAIL_PROVIDER == "smtp":
    EMAIL_BACKEND="django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST=required("EMAIL_HOST")
    EMAIL_PORT=int(os.getenv("EMAIL_PORT","587"))
    EMAIL_HOST_USER=required("EMAIL_HOST_USER")
    EMAIL_HOST_PASSWORD=required("EMAIL_HOST_PASSWORD")
    EMAIL_USE_TLS=True
else:
    raise ImproperlyConfigured("EMAIL_PROVIDER must be smtp or resend.")
DEFAULT_FROM_EMAIL=required("DEFAULT_FROM_EMAIL")

# Serve collected admin/API assets from the web container, independently of uploads.
MIDDLEWARE=[*MIDDLEWARE[:2],"whitenoise.middleware.WhiteNoiseMiddleware",*MIDDLEWARE[2:]]
STATIC_URL="/static/"
STORAGES={
    "default":{"BACKEND":"django.core.files.storage.FileSystemStorage"},
    "staticfiles":{"BACKEND":"whitenoise.storage.CompressedManifestStaticFilesStorage"},
}
MEDIA_STORAGE=os.getenv("MEDIA_STORAGE","local").strip().lower()
if MEDIA_STORAGE == "s3":
    endpoint=required("S3_ENDPOINT_URL")
    parsed_endpoint=urlparse(endpoint)
    if parsed_endpoint.scheme != "https" or not parsed_endpoint.hostname or parsed_endpoint.username or parsed_endpoint.password:
        raise ImproperlyConfigured("S3_ENDPOINT_URL must be an HTTPS storage endpoint.")
    addressing_style=os.getenv("S3_ADDRESSING_STYLE","virtual")
    if addressing_style not in {"virtual","path"}:
        raise ImproperlyConfigured("S3_ADDRESSING_STYLE must be virtual or path.")
    STORAGES["default"]={"BACKEND":"storages.backends.s3.S3Storage","OPTIONS":{
        "access_key":required("S3_ACCESS_KEY_ID"),
        "secret_key":required("S3_SECRET_ACCESS_KEY"),
        "bucket_name":required("S3_BUCKET_NAME"),
        "endpoint_url":endpoint,
        "region_name":required("S3_REGION"),
        "addressing_style":addressing_style,
        "signature_version":"s3v4",
        "default_acl":None,
        "querystring_auth":True,
        "querystring_expire":3600,
        "file_overwrite":False,
        "location":"media",
    }}
elif MEDIA_STORAGE != "local":
    raise ImproperlyConfigured("MEDIA_STORAGE must be local or s3.")
if os.getenv("RAILWAY_ENVIRONMENT_ID"):
    ALLOWED_HOSTS=list(dict.fromkeys([*ALLOWED_HOSTS,"healthcheck.railway.app"]))
    if MEDIA_STORAGE != "s3":
        raise ImproperlyConfigured("Configure persistent S3 upload storage for Railway.")
FRONTEND_URL=required("FRONTEND_URL").rstrip("/")
if not FRONTEND_URL.startswith("https://"): raise ImproperlyConfigured("FRONTEND_URL must use HTTPS.")
PAYSTACK_CALLBACK_URL=FRONTEND_URL+"/payment/return"
PAYSTACK_SECRET_KEY=required("PAYSTACK_SECRET_KEY")
if not PAYSTACK_SECRET_KEY.startswith(("sk_test_","sk_live_")):
    raise ImproperlyConfigured("Configure a Paystack secret key.")
CORS_ALLOWED_ORIGINS=[x.strip() for x in os.getenv("CORS_ALLOWED_ORIGINS",FRONTEND_URL).split(",") if x.strip()]
CSRF_TRUSTED_ORIGINS=CORS_ALLOWED_ORIGINS
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
REFRESH_COOKIE_SECURE=True
SECURE_SSL_REDIRECT=True
# Railway probes this non-sensitive endpoint over the container's HTTP port.
SECURE_REDIRECT_EXEMPT=[r"^health/live/$"]
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
# This emits eligibility in the header; browser preload enrollment is a separate operator action.
SECURE_HSTS_PRELOAD=True
SECURE_CONTENT_TYPE_NOSNIFF=True
# Same-origin form submissions need their origin/referrer for Django's CSRF checks.
SECURE_REFERRER_POLICY="same-origin"
X_FRAME_OPTIONS="DENY"
REQUIRE_WORKER_HEARTBEAT=True
# Enable only behind a trusted proxy that overwrites this header.
if os.getenv("TRUST_PROXY_SSL_HEADER","False").lower()=="true":
    SECURE_PROXY_SSL_HEADER=("HTTP_X_FORWARDED_PROTO","https")
if not 0<=PLATFORM_COMMISSION_BPS<=10000:
    raise ImproperlyConfigured("PLATFORM_COMMISSION_BPS must be between 0 and 10000.")
