# coding=utf-8
#from django.db import models
from chats.models import Chat, Reply
from rest_framework import serializers
from rest_framework.serializers import RelatedField
from django.contrib.auth.models import User

#class UsernameSerializer(serializers.ModelSerializer):
#	class Meta:
#		model = User
#		field = ('username')

class ItemNameField(serializers.RelatedField):
	def to_native(self, value):
		return value.name

class ChatSerializer(serializers.ModelSerializer):
	seller = RelatedField()
	buyer = RelatedField()
	item = ItemNameField()

	class Meta:
		model = Chat
		field = ('item', 'seller', 'buyer', 'datetime', 'seller_seen', 'buyer_seen')
		#field = ('chat')
		#depth = 1

class ReplySerializer(serializers.ModelSerializer):
	speaker = RelatedField()
	class Meta:
		model = Reply
		field = ('speaker', 'reply', 'datetime')
