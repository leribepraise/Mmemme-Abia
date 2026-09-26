from .test import *
DATABASES={"default":{"ENGINE":"django.db.backends.postgresql","NAME":os.getenv("POSTGRES_DB","mmemme_test"),"USER":os.getenv("POSTGRES_USER","mmemme"),"PASSWORD":os.getenv("POSTGRES_PASSWORD","local-test-only"),"HOST":os.getenv("POSTGRES_HOST","127.0.0.1"),"PORT":os.getenv("POSTGRES_PORT","5432")}}
