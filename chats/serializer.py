# coding=utf-8
from chats.models import Chat, Reply
from rest_framework import serializers

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        field = ('seller', 'buyer', 'date', 'time', 'seller_seen', 'buyer_seen')
        
class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        field = ('speaker', 'reply', 'date', 'time')