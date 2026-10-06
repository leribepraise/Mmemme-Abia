import nh3


def clean_content(html):
    return nh3.clean(
        html,
        tags={'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'pre', 'code'},
        attributes={'a': {'href', 'title'}, 'img': {'src', 'alt', 'title'}, 'td': {'colspan', 'rowspan'}, 'th': {'colspan', 'rowspan'}, 'ol': {'start'}},
        url_schemes={'https', 'http', 'mailto'},
        clean_content_tags={'script', 'style', 'iframe', 'object', 'svg', 'math'},
    )
