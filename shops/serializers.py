from shops.models import Shop

from rest_framework import serializers
from rest_framework.serializers import PrimaryKeyRelatedField
from rest_framework.serializers import RelatedField

from items.serializers import ItemSerializer

class ShopSerializer(serializers.ModelSerializer):
	#items = ItemSerializer(required=False,many=True)
	favorite = serializers.SerializerMethodField('is_favorite')
	
	def is_favorite(self, obj):
		return obj.follower.all().filter(id=self.user.id).exists()
	
	def __init__(self, *args, **kwargs):
		user = kwargs.pop('user', None)
		if user:
			self.user = user
			
		super(ShopSerializer, self).__init__(*args, **kwargs)
		
		if not user:
			self.fields.pop('favorite')
		
	class Meta:
		model = Shop
		fields = ('id','name','address','latitude','longitude','description','open','owner','favorite')
