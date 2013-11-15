# coding=utf-8
from django.db import models
from django.contrib.auth.models import User
from items.models import Item
from accounts.models import Event

# Create your models here.
from datetime import datetime

# Create your models here.
class Chat(models.Model):
	seller = models.ForeignKey(User, related_name="seller_chat")
	buyer = models.ForeignKey(User, related_name="buyer_chat")
	item = models.ForeignKey(Item, related_name="item_chat")
	datetime = models.DateTimeField(auto_now_add=True)
	seller_seen = models.BooleanField(default=True)
	buyer_seen = models.BooleanField(default=True)

	def __unicode__(self):
		return '%s: %s to %s' % (self.item.name, self.seller, self.buyer)

class Reply(models.Model):
	chat = models.ForeignKey(Chat)
	reply = models.TextField()
	speaker = models.ForeignKey(User, related_name='speaker')
	ip = models.CharField(max_length=15)
	datetime = models.DateTimeField(auto_now_add=True)

	def __unicode__(self):
		return '%s says:%s' % (self.speaker, self.reply)