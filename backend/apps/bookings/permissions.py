from rest_framework import permissions


class IsBookingOwner(permissions.BasePermission):
    """
    Only authenticated users can access bookings,
    and users can only modify their own bookings.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user