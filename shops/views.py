# coding=utf-8
from django.http import HttpResponse

from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods, require_GET, require_POST

from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from shops.serializers import ShopSerializer
from shops.models import Shop

from items.serializers import ItemSerializer

class JSONResponse(HttpResponse):
	def __init__(self, data, **kwargs):
		content = JSONRenderer().render(data)
		kwargs['content_type'] = 'application/json'
		super(JSONResponse, self).__init__(content, **kwargs)
		
@api_view(['GET'])
def shopItems(request,shop_id):
	user = request.user
	shop = Shop.objects.get(id=shop_id)
	if shop.owner.id != user.id:
		return Response(status=status.HTTP_401_UNAUTHORIZED)
	print shop_id
	print shop.items.all()
	serializer = ItemSerializer(shop.items.all(),many=True)
	return Response(serializer.data)

class ShopsList(APIView):
	#商店清單(未完成)
	def get(self, request, format=None):
		return Response(status=status.HTTP_400_BAD_REQUEST)
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
		serializer = ShopSerializer(shop)
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