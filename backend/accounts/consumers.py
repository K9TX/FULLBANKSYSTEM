from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
import json

User = get_user_model()

class UserListConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if user.is_anonymous:
            await self.close()
        else:
            await self.accept()
            users = await self.get_other_users(user)
            await self.send(text_data=json.dumps({
                "users": users
            }))

    @database_sync_to_async
    def get_other_users(self, current_user):
        return [
            {
                "username": u.username,
                "email": u.email,
                "account_number": u.account_number,
            }
            for u in User.objects.exclude(id=current_user.id)
        ] 