# coding=utf-8
from django.conf.urls import patterns, url

from chats import views

urlpatterns = patterns('',
    url(r'^list/$', views.getList),
    url(r'^(?P<chat_id>[0-9]+)$', views.reply),
)