"""Prepare runtime static assets, then replace this process with Gunicorn."""

import os
import subprocess
import sys
from pathlib import Path


def main():
    os.chdir(Path(__file__).resolve().parent)
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")
    port = int(os.environ.get("PORT", "8000"))
    workers = int(os.environ.get("WEB_CONCURRENCY", "2"))
    if not 1 <= port <= 65535 or not 1 <= workers <= 16:
        raise SystemExit("Invalid PORT or WEB_CONCURRENCY.")
    subprocess.run([sys.executable, "manage.py", "collectstatic", "--noinput"], check=True)
    # IPv6 wildcard accepts Railway's private-network IPv6 and IPv4 connections.
    # %(U)s omits query strings containing email verification/reset tokens.
    os.execvp("gunicorn", ["gunicorn", "config.wsgi:application", "--bind", f"[::]:{port}", "--workers", str(workers), "--timeout", "60", "--access-logfile", "-", "--error-logfile", "-", "--access-logformat", '%(h)s %(m)s %(U)s %(s)s %(L)s'])


if __name__ == "__main__":
    main()
