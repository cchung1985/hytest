from shops.models import Shop

from rest_framework import serializers
from rest_framework.serializers import PrimaryKeyRelatedField
from rest_framework.serializers import RelatedField

from items.serializers import ItemSerializer

class ShopSerializer(serializers.ModelSerializer):
	#items = ItemSerializer(required=False,many=True)
	class Meta:
		model = Shop
		fields = ('id','name','address','latitute','longtitute','description','open','owner')
