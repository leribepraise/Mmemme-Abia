import uuid


def notification_destination(notification):
    """Resolve existing notification keys to known internal app routes."""
    prefix, _, identifier = notification.key.partition(':')
    if prefix in {'hotel-review','hotel-request'}: return '/stays/provider','booking'
    if prefix=='hotel-response': return '/stays/support','booking'
    if prefix in {'hotel-cancel','hotel-reminder','hotel-no-show'}: return '/stays/bookings','booking'
    if prefix in {'tourism-review', 'tourism-request'}: return '/tourism/operator', 'booking'
    if prefix == 'tourism-response': return '/tourism/support', 'booking'
    if prefix in {'tourism-cancel', 'tourism-reminder'}: return '/tourism/bookings', 'booking'
    if prefix in {'transport-review', 'transport-request'}:
        return '/transport/company', 'booking'
    if prefix == 'transport-response':
        return '/transport/support', 'booking'
    if prefix in {'transport-cancel', 'transport-reminder'}:
        return '/transport/bookings', 'booking'
    if prefix == 'membership':
        return '/plans', 'update'
    if prefix == 'message':
        try:
            return f'/message?conversation={uuid.UUID(identifier.split(":")[0])}', 'update'
        except ValueError:
            pass
    if prefix in {'booking', 'reminder'}:
        from apps.bookings.models import Booking
        try:
            if Booking.objects.filter(pk=uuid.UUID(identifier.split(':')[0]),kind='HOTEL',user_id=getattr(notification,'user_id',None)).exists():
                return '/stays/bookings','booking'
            if Booking.objects.filter(pk=uuid.UUID(identifier.split(':')[0]), kind='TOURISM', user_id=getattr(notification, 'user_id', None)).exists():
                return '/tourism/bookings', 'booking'
            if Booking.objects.filter(pk=uuid.UUID(identifier.split(':')[0]), kind='TRANSPORT', user_id=getattr(notification, 'user_id', None)).exists():
                return '/transport/bookings', 'booking'
        except ValueError:
            pass
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
    if prefix == 'event-new':
        try:
            return f'/events/{uuid.UUID(identifier.split(":")[0])}', 'event'
        except ValueError:
            pass
    if prefix in {'payout', 'payout-account', 'bank-review'}:
        from apps.hotels.models import HotelProvider
        if getattr(notification,'user_id',None) and HotelProvider.objects.filter(owner_id=notification.user_id).exists(): return '/stays/provider','update'
        from apps.tourism.models import TourismOperator
        if getattr(notification, 'user_id', None) and TourismOperator.objects.filter(owner_id=notification.user_id).exists():
            return '/tourism/operator', 'update'
        from apps.transport.models import TransportCompany
        if getattr(notification, 'user_id', None) and TransportCompany.objects.filter(owner_id=notification.user_id).exists():
            return '/transport/company', 'update'
        return '/organizer/payouts', 'update'
    if prefix == 'account':
        return '/profile?section=Settings', 'update'
    return '/profile?section=Notifications', 'update'
