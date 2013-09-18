from django.db import models
from django.contrib.auth.models import User

from items.models import Item

class Shop(models.Model):
	name = models.CharField(max_length=50)
	address = models.CharField(max_length=100)
	latitute = models.FloatField()
	longtitute = models.FloatField()
	description = models.TextField(blank=True,null=True)
	owner = models.ForeignKey(User,related_name="shops")
	items = models.ManyToManyField(Item,blank=True)
	def __unicode__(self):
		return "%s (%s)"%(self.owner.username,self.name)