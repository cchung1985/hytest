# coding=utf-8
#from django.db import models
from chats.models import Chat, Reply
from rest_framework import serializers
from django.contrib.auth.models import User

class UsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        field = ('username')

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        field = ('item', 'seller', 'buyer', 'date', 'time', 'seller_seen', 'buyer_seen')
        #field = ('chat')
        #depth = 1
        
class ReplySerializer(serializers.ModelSerializer):
   #speakername = models.ForeignKey(User, related_name='speaker')
    class Meta:
        model = Reply
        field = ('speaker', 'reply', 'date', 'time')
