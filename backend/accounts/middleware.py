from urllib.parse import parse_qs
from channels.middleware.base import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db import close_old_connections

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        token_list = parse_qs(query_string).get("token")
        user = AnonymousUser()
        if token_list:
            token = token_list[0]
            try:
                validated_token = UntypedToken(token)
                user = JWTAuthentication().get_user(validated_token)
            except Exception:
                user = AnonymousUser()
        scope["user"] = user
        close_old_connections()
        return await super().__call__(scope, receive, send)
