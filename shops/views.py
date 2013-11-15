# coding=utf-8
from django.http import HttpResponse

from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods, require_GET, require_POST

from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from shops.models import Shop
from shops.serializers import ShopSerializer
from items.models import Item
from items.serializers import ItemSerializer

import shlex

class JSONResponse(HttpResponse):
	def __init__(self, data, **kwargs):
		content = JSONRenderer().render(data)
		kwargs['content_type'] = 'application/json'
		super(JSONResponse, self).__init__(content, **kwargs)
		
@api_view(['GET'])
def shopItems(request,shop_id):
	user = request.user
	shop = Shop.objects.get(id=shop_id)
	#if shop.owner.id != user.id:
	#	return Response(status=status.HTTP_401_UNAUTHORIZED)
	serializer = ItemSerializer(shop.items.filter(state=Item.ON),user=request.user,many=True)
	return Response(serializer.data)

class ShopsList(APIView):
	#商店清單(未完成)
	def get(self, request, format=None):
		shops = Shop.objects.all()
		GET = request.GET
		if GET.has_key('n_lat') and GET.has_key('s_lat') and GET.has_key('e_lng') and GET.has_key('w_lng'):
			northLatitude = float(GET['n_lat'])
			southLatitude = float(GET['s_lat'])
			eastLongitude = float(GET['e_lng'])
			westLongitude = float(GET['w_lng'])
			shops = shops.filter(latitude__range=(southLatitude,northLatitude),longitude__range=(westLongitude,eastLongitude))
		if GET.has_key('string'):
			patterns = shlex.split(GET['string']);
			for pattern in patterns:
				shops = shops.filter(name__contains=pattern)
		serializer = ShopSerializer(shops,many=True)
		return Response(serializer.data,status=status.HTTP_200_OK)
		#return Response(status=status.HTTP_400_BAD_REQUEST)
	#建立新商店(權限尚未完成)
	def post(self, request, format=None):
		user = request.user
		data = request.DATA
		data['owner'] = user.id
		serializer = ShopSerializer(data=data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	
class ShopsDetail(APIView):
	#商店資訊
	def get(self, request, id, format=None):
		try:
			shop = Shop.objects.get(id=id)
		except Shop.DoesNotExist:
			return Response(status=status.HTTP_404_NOT_FOUND)
		serializer = ShopSerializer(shop, user=request.user)
		print serializer.data
		return Response(serializer.data, status=status.HTTP_200_OK)
	#修改商店資訊
	def put(self, request, id, format=None):
		try:
			shop = Shop.objects.get(id=id)
		except Shop.DoesNotExist:
			return Response(status=status.HTTP_404_NOT_FOUND)
		
		user = request.user
		if shop.owner.id != user.id:
			return Response(status=status.HTTP_401_UNAUTHORIZED)
		
		serializer = ShopSerializer(shop, data=request.DATA)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ShopsFavorList(APIView):
	def post(self, request, shop_id):
		shop = Shop.objects.get(id=shop_id)
		if shop.follower.all().filter(username = request.user.username).exists():
			shop.follower.remove(request.user)
			return Response('remove')
		else:
			shop.follower.add(request.user)
			serializer = ShopSerializer(shop, user=request.user)
			return Response(serializer.data)
	
		return Response()

	def get(self, request, shop_id):
		shop = Shop.objects.filter(follower = request.user)
		serializer = ShopSerializer(shop, user=request.user, many=True)
		print(serializer.data)
		return Response(serializer.data)
	
	
