# coding=utf-8
from django.contrib import admin
from chats.models import Chat, Reply

admin.site.register(Chat)
admin.site.register(Reply)