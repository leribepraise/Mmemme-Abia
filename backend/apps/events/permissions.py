from rest_framework import permissions

class IsOrganizerOrReadOnly(permissions.BasePermission):
    def has_permission(self,request,view):
        if view.action in {"list","retrieve"}: return True
        return bool(request.user.is_authenticated and (request.user.is_staff or (request.user.role=="ORGANIZER" and request.user.is_verified)))
    def has_object_permission(self,request,view,obj):
        return request.method in permissions.SAFE_METHODS or request.user.is_staff or obj.organizer_id==request.user.pk
