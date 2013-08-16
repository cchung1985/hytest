<<<<<<< HEAD
from shops.models import Item, Category, Attribute

from rest_framework import serializers
from rest_framework.serializers import PrimaryKeyRelatedField
from rest_framework.serializers import RelatedField
from accounts.serializers import UserSerializer

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
	images = PrimaryKeyRelatedField(many=True, read_only=True)
	class Meta:
		model = Item
		fields = ('id','rid','owner','name','price','pic','pub_date','category','attrs','description','images')
=======
from shops.models import Item, Category, Attribute

from rest_framework import serializers
from accounts.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
	class Meta:
		model = Category
		fields = ('id','name')

class AttributeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Attribute
		fields = ('id','name')

class ItemSerializer(serializers.ModelSerializer):
	category = CategorySerializer()
	attrs = AttributeSerializer(many=True)
	class Meta:
		model = Item
		fields = ('id','owner','name','price','pic','pub_date','category','attrs')
>>>>>>> refs/heads/sq0032_develop
