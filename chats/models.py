# coding=utf-8
from django.db import models
from django.contrib.auth.models import User
from items.models import Item

# Create your models here.
from datetime import datetime

# Create your models here.
class Chat(models.Model):
    seller = models.ForeignKey(User, related_name="seller")
    buyer = models.ForeignKey(User, related_name="buyer")
    item = models.ForeignKey(Item)
    time = models.TimeField()
    date = models.DateField()
    seller_seen = models.BooleanField(default=True)
    buyer_seen = models.BooleanField(default=True)
    
    def __unicode__(self):
        return '%s to %s' % (self.seller, self.buyer)
    
class Reply(models.Model):
    conv_id = models.ForeignKey(Chat)
    reply = models.TextField()
    speaker = models.ForeignKey(User)
    ip = models.CharField(max_length=15)
    time = models.TimeField()
    date = models.DateField()
    
    def __unicode__(self):
        return '%s says:%s' % (self.speaker, self.reply)
    