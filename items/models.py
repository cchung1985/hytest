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
	pub_date = models.DateTimeField(auto_now_add=True)
	category = models.ForeignKey(Category)
	attrs = models.ManyToManyField(Attribute)
	description = models.TextField(blank=True,null=True,verbose_name="Description")
	follower = models.ManyToManyField(User, blank=True, related_name="favoritems")
	def __unicode__(self):
		return "%s %s %s"%(self.owner,self.name,self.pub_date)

def item_thumbnail_path(instance, filename):
	try:
		extName = filename.rsplit('.',1)[1]
	except:
		extName = ""
	name = instance.item.rid
	return 'image/items/%s-s.%s'%(name,extName)



class Thumbnail(models.Model):
	name = models.CharField(max_length = 255)
	thumbnail = models.ImageField(upload_to=item_thumbnail_path,max_length=500,blank=True,null=True)
	item = models.ForeignKey(Item,blank=True,null=True,related_name="thumbnail")
	def __unicode__(self):
		return "%s"%(self.thumbnail)

	def create_thumbnail(self):
		# original code for this method came from
		# http://snipt.net/danfreak/generate-thumbnails-in-django-with-pil/
		
		# If there is no image associated with this.
		# do not create thumbnail
		if not self.thumbnail:
			return

		self.thumbnail.seek(0)
		print('create thumbnail')
		from PIL import Image
		from cStringIO import StringIO
		from django.core.files.uploadedfile import SimpleUploadedFile
		import os

		# Set our max thumbnail size in a tuple (max width, max height)
		THUMBNAIL_SIZE = (100,100)
		
		DJANGO_TYPE = self.thumbnail.file.content_type
		
		if DJANGO_TYPE == 'image/jpeg':
			PIL_TYPE = 'jpeg'
			FILE_EXTENSION = 'jpg'
		elif DJANGO_TYPE == 'image/png':
			PIL_TYPE = 'png'
			FILE_EXTENSION = 'png'

		# Open original photo which we want to thumbnail using PIL's Image
		image = Image.open(StringIO(self.thumbnail.read()))
		
		# Convert to RGB if necessary
		# Thanks to Limodou on DjangoSnippets.org
		# http://www.djangosnippets.org/snippets/20/
		#
		# I commented this part since it messes up my png files
		#
		#if image.mode not in ('L', 'RGB'):
		#    image = image.convert('RGB')
		
		# We use our PIL Image object to create the thumbnail, which already
		# has a thumbnail() convenience method that contrains proportions.
		# Additionally, we use Image.ANTIALIAS to make the image look better.
		# Without antialiasing the image pattern artifacts may result.
		image = cropit(image)
		image.thumbnail(THUMBNAIL_SIZE, Image.ANTIALIAS)
		
		# Save the thumbnail
		temp_handle = StringIO()
		image.save(temp_handle, PIL_TYPE)
		temp_handle.seek(0)
		
		# Save image to a SimpleUploadedFile which can be saved into
		# ImageField
		suf = SimpleUploadedFile(os.path.split(self.thumbnail.name)[-1],
		        temp_handle.read(), content_type=DJANGO_TYPE)
		# Save SimpleUploadedFile into image field
		self.thumbnail.save('%s.%s'%(os.path.splitext(suf.name)[0],FILE_EXTENSION), suf, save=False)
 
	def save(self, *args, **kwargs):
		# create a thumbnail
		self.create_thumbnail()		
		super(Thumbnail, self).save(*args, **kwargs)


def item_image_path(instance, filename):
	try:
		extName = filename.rsplit('.',1)[1]
	except:
		extName = ""
	name = instance.item.rid
	index = instance.index
	return 'image/items/%s-%s.%s'%(name,index,extName)

def isLandscape(width, height):
	"""
	Takes the image width and height and returns if the image is in landscape
	or portrait mode.
	"""
	if width >= height:
		return True
	else:
		return False

def boxParamsCenter(width, height):
	"""
	Calculate the box parameters for cropping the center of an image based
	on the image width and image height
	"""
	if isLandscape(width, height):
		upper_x = int((width/2) - (height/2))
		upper_y = 0
		lower_x = int((width/2) + (height/2))
		lower_y = height
		return upper_x, upper_y, lower_x, lower_y
	else:
		upper_x = 0
		upper_y = int((height/2) - (width/2))
		lower_x = width
		lower_y = int((height/2) + (width/2))
		return upper_x, upper_y, lower_x, lower_y

def cropit(img):
	"""
	Performs the cropping of the input image to generate a square thumbnail.
	It calculates the box parameters required by the PIL cropping method, crops
	the input image and returns the cropped square.
	"""
	print('cropit')
	upper_x, upper_y, lower_x, lower_y = boxParamsCenter(img.size[0], img.size[1])
	box = (upper_x, upper_y, lower_x, lower_y)
	region = img.crop(box)
	return region

class ItemImage(models.Model):
	index = models.IntegerField()
	item = models.ForeignKey(Item,blank=True,null=True,related_name="images")
	image = models.ImageField(upload_to=item_image_path,blank=True)
	def __unicode__(self):
		#return "%s %s %s"%(self.item.owner, self.item.name, self.index)
		return "%s"%(self.image)
	
	def image_processing(self):

		# original code for this method came from
		# http://snipt.net/danfreak/generate-thumbnails-in-django-with-pil/
		
		# If there is no image associated with this.
		# do not create thumbnail
		if not self.image:
			return
 
		self.image.seek(0)
		from PIL import Image
		from cStringIO import StringIO
		from django.core.files.uploadedfile import SimpleUploadedFile
		import os
		print('image_processing')
		# Set our max thumbnail size in a tuple (max width, max height)
		THUMBNAIL_SIZE = (600,600)
		print('image_processing')
		DJANGO_TYPE = self.image.file.content_type
		print('image_processing')
		if DJANGO_TYPE == 'image/jpeg':
			PIL_TYPE = 'jpeg'
			FILE_EXTENSION = 'jpg'
		elif DJANGO_TYPE == 'image/png':
			PIL_TYPE = 'png'
			FILE_EXTENSION = 'png'
		print('image_processing')
		# Open original photo which we want to thumbnail using PIL's Image
		image = Image.open(StringIO(self.image.read()))
		print('Image.open')
		# Convert to RGB if necessary
		# Thanks to Limodou on DjangoSnippets.org
		# http://www.djangosnippets.org/snippets/20/
		#
		# I commented this part since it messes up my png files
		#
		#if image.mode not in ('L', 'RGB'):
		#    image = image.convert('RGB')
		
		# We use our PIL Image object to create the thumbnail, which already
		# has a thumbnail() convenience method that contrains proportions.
		# Additionally, we use Image.ANTIALIAS to make the image look better.
		# Without antialiasing the image pattern artifacts may result.
		
		#image.thumbnail(THUMBNAIL_SIZE, Image.ANTIALIAS)
		image = cropit(image)
		image.thumbnail(THUMBNAIL_SIZE, Image.ANTIALIAS)
		
		
		# Save the thumbnail
		temp_handle = StringIO()
		image.save(temp_handle, PIL_TYPE)
		temp_handle.seek(0)
		
		# Save image to a SimpleUploadedFile which can be saved into
		# ImageField
		suf = SimpleUploadedFile(os.path.split(self.image.name)[-1],
		        temp_handle.read(), content_type=DJANGO_TYPE)
		# Save SimpleUploadedFile into image field
		self.image.save('%s.%s'%(os.path.splitext(suf.name)[0],FILE_EXTENSION), suf, save=False)
 
	def save(self, *args, **kwargs):
		# create a thumbnail
		self.image_processing()		
		super(ItemImage, self).save(*args, **kwargs)