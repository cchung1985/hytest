# coding=utf-8
from django.http import HttpResponse

from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods, require_GET, require_POST

from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from chats.serializer import ChatSerializer, ReplySerializer
from chats.models import Chat, Reply

from items.models import Item


def getList(request):
    chat = Chat.objects.filter(seller__username=request.user)
    serializer = ChatSerializer(chat, many=True)
    json = JSONRenderer().render(serializer.data)
    return HttpResponse(json)

def reply(request, chat_id):
    if request.method == 'POST':
        return HttpResponse('chat_id='+chat_id)
    elif request.method == 'GET':
        reply = Reply.objects.filter(chat__id=chat_id)
        serializer = ReplySerializer(reply, many=True)
        json = JSONRenderer().render(serializer.data)
        return HttpResponse(json)
        
        