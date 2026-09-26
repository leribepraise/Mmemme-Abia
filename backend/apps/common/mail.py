"""Readable email previews for local development only."""

from django.core.mail.backends.console import EmailBackend


class DevelopmentConsoleEmailBackend(EmailBackend):
    def write_message(self, message):
        # Raw MIME can wrap links and encode '=' as '=3D'. Display the original
        # text so copying a verification or password-reset URL preserves it.
        self.stream.write("Development email preview (not sent)\n")
        self.stream.write(f"Subject: {message.subject}\n")
        self.stream.write(f"To: {', '.join(message.to)}\n\n")
        self.stream.write(message.body)
        self.stream.write("\n" + "-" * 79 + "\n")
