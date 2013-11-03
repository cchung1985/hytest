from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
	name = models.CharField(max_length=100,unique=True)
	parent = models.ForeignKey('self',blank=True,null=True,on_delete=models.SET_NULL,related_name="child")
	def __unicode__(self):
		nameList = []
		nameList.append(self.name)
		parent = self.parent
		while parent:
			nameList.append(parent.name)
			parent = parent.parent
			
		return ">".join(reversed(nameList))

class Attribute(models.Model):
	name = models.CharField(max_length=100,unique=True)
	def __unicode__(self):
		return self.name

def item_thumbnail_path(instance, filename):
	try:
		extName = filename.rsplit('.',1)[1]
	except:
		extName = ""
	name = instance.rid
	return 'image/items/%s-s.%s'%(name,extName)
	
class Item(models.Model):
	ON = 'on'
	OFF = 'off'
	DEL = 'del'
	STATE_CHOICES = (
		(ON, 'Online'),
		(OFF, 'Offline'),
		(DEL, 'Deleted'),
	)
	state = models.CharField(max_length=3,choices=STATE_CHOICES,default=ON)
	rid = models.CharField(max_length=40,unique=True) 
	owner = models.ForeignKey(User)
	name = models.CharField(max_length=60)
	price = models.IntegerField()
	pic = models.ImageField(upload_to=item_thumbnail_path,blank=True,)
	pub_date = models.DateTimeField(auto_now_add=True)
	category = models.ForeignKey(Category)
	attrs = models.ManyToManyField(Attribute)
	description = models.TextField(blank=True,null=True,verbose_name="Description")
	def __unicode__(self):
		return "%s %s %s"%(self.owner,self.name,self.pub_date)

def item_image_path(instance, filename):
	try:
		extName = filename.rsplit('.',1)[1]
	except:
		extName = ""
	name = instance.item.rid
	index = instance.index
	return 'image/items/%s-%s.%s'%(name,index,extName)

class ItemImage(models.Model):
	index = models.IntegerField()
	item = models.ForeignKey(Item,blank=True,null=True,related_name="images")
	image = models.ImageField(upload_to=item_image_path,blank=True)
	def __unicode__(self):
		return "%s %s %s"%(self.item.owner, self.item.name, self.index)