"""Accessible, branded HTML companion for transactional plain-text emails."""
from html import escape


def notification_html(subject, body, action_url=None, action_label=None, image_url=None, image_alt=None):
    title = escape(subject)
    paragraphs = ''.join(
        f'<p style="margin:0 0 16px;line-height:1.65;color:#334155">{escape(part).replace(chr(10), "<br>")}</p>'
        for part in body.strip().split('\n\n') if part.strip()
    )
    action = (f'<p style="margin:24px 0"><a href="{escape(action_url, quote=True)}" '
              'style="display:inline-block;padding:13px 22px;border-radius:9px;background:#2f713a;'
              f'color:#fff;text-decoration:none;font-weight:700">{escape(action_label or "Open Mmemme Abia")}</a></p>'
              if action_url else '')
    image = (f'<p style="margin:0 0 22px"><img src="{escape(image_url, quote=True)}" '
             f'alt="{escape(image_alt or "Event poster", quote=True)}" width="540" '
             'style="display:block;width:100%;max-width:540px;height:auto;border-radius:12px;border:0"></p>'
             if image_url else '')
    return (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1"></head>'
        '<body style="margin:0;padding:24px 12px;background:#f4f7f3;font-family:Arial,Helvetica,sans-serif">'
        '<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;margin:auto;border-collapse:collapse">'
        '<tr><td style="padding:22px 28px;background:#205b2e;color:#fff;border-radius:14px 14px 0 0">'
        '<div style="font-size:25px;font-weight:800;letter-spacing:.2px">Mmemme <span style="color:#ff9d42">ABIA</span></div></td></tr>'
        '<tr><td style="padding:30px 28px;background:#fff;border:1px solid #e5ebe4">'
        f'<h1 style="margin:0 0 20px;color:#173a20;font-size:24px;line-height:1.3">{title}</h1>{image}{paragraphs}{action}'
        '<p style="margin:24px 0 0;color:#64748b;font-size:13px">Need help? Visit the Mmemme Abia Help Center at www.mmemme.com.ng/help.</p>'
        '</td></tr><tr><td style="padding:18px 28px;background:#e9f1e7;color:#526253;font-size:12px;border-radius:0 0 14px 14px">'
        'Mmemme Abia · Discover, book and experience Abia.</td></tr></table></body></html>'
    )
