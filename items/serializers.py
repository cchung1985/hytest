from items.models import *

from rest_framework import serializers
from rest_framework.serializers import PrimaryKeyRelatedField
from rest_framework.serializers import RelatedField
from rest_framework.serializers import SlugRelatedField

class CategorySerializer(serializers.ModelSerializer):
	child = PrimaryKeyRelatedField(many=True, read_only=True)
	class Meta:
		model = Category
		fields = ('id','name','child','parent')

class AttributeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Attribute
		fields = ('id','name')

class ItemSerializer(serializers.ModelSerializer):
	#category = CategorySerializer()
	#attrs = AttributeSerializer(many=True)
	#images = SlugRelatedField(many=True, read_only=True, slug_field='index')
	images = RelatedField(many=True, read_only=True)	
	#thumbnail = RelatedField()
	thumbnail = RelatedField(many=True, read_only=True)
	favorite = serializers.SerializerMethodField('is_favorite')
	latitude = serializers.SerializerMethodField('shop_latitude')
	longitude = serializers.SerializerMethodField('shop_longitude')
	
	def shop_latitude(self,obj):
		#print obj.shops.all()[0].latitude
		return obj.shops.all()[0].latitude
	
	def shop_longitude(self,obj):
		return obj.shops.all()[0].longitude
	
	def is_favorite(self, obj):
		return obj.follower.all().filter(id=self.user.id).exists()
	
	def __init__(self, *args, **kwargs):
		user = kwargs.pop('user', None)
		if user:
			self.user = user
			
		super(ItemSerializer, self).__init__(*args, **kwargs)
		
		if not user:
			self.fields.pop('favorite')
	
	class Meta:
		model = Item
		fields = ('id','rid','owner','name','price','thumbnail','pub_date','category','attrs','description','images','shops','state','favorite','latitude','longitude')
