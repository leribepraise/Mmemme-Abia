import uuid


def notification_destination(notification):
    """Resolve existing notification keys to known internal app routes."""
    prefix, _, identifier = notification.key.partition(':')
    if prefix == 'membership':
        return '/plans', 'update'
    if prefix == 'message':
        try:
            return f'/message?conversation={uuid.UUID(identifier.split(":")[0])}', 'update'
        except ValueError:
            pass
    if prefix in {'booking', 'reminder'}:
        return '/profile?section=My%20Bookings', 'booking'
    if prefix == 'refund':
        return '/profile?section=Payment%20History', 'booking'
    if prefix == 'organizer':
        return '/organizer/apply', 'event'
    if prefix == 'event-review':
        try:
            return f'/organizer/events/{uuid.UUID(identifier.split(":")[0])}/preview', 'event'
        except ValueError:
            pass
    if prefix in {'payout', 'payout-account', 'bank-review'}:
        return '/organizer/payouts', 'update'
    if prefix == 'account':
        return '/profile?section=Settings', 'update'
    return '/profile?section=Notifications', 'update'
