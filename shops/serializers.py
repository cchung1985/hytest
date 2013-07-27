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