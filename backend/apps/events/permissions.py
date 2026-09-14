from rest_framework import permissions


class IsOrganizerOrReadOnly(permissions.BasePermission):
    """
    Anyone can view events.
    Only authenticated organizers can create events.
    Organizers can only modify or delete their own events.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "ORGANIZER"
        )

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.organizer == request.user