from django.contrib.auth.models import User
from accounts.models import *

from rest_framework import serializers
from rest_framework.serializers import PrimaryKeyRelatedField, RelatedField
from shops.serializers import ShopSerializer

class UserSerializer(serializers.ModelSerializer):
	name = serializers.CharField(source='username')
	shops = PrimaryKeyRelatedField(many=True)
	'''
	def validate_name(self, attrs, source):
		print attrs
		print source
		value = attrs[source]
		if "a" not in value.lower():
			raise serializers.ValidationError("Blog post is not about Django")
		return attrs
	'''
	class Meta:
		model = User
		fields = ('id', 'name', 'email', 'shops')

class EventSerializer(serializers.ModelSerializer):
	event = RelatedField()
	
	class Meta:
		model = Event
		fields = ('event', 'datetime')
	