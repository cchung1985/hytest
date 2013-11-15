from django.conf.urls import patterns, url

from items import views

urlpatterns = patterns('',
	url(r'^upload/items/(?P<item_id>\d+)/image/(?P<index>\d+)$', views.uploadItemImage),
	url(r'^items/$', views.ItemsList.as_view()),
	url(r'^items/i/$', views.items_i),
	url(r'^items/(?P<id>[0-9]+)$', views.ItemsDetail.as_view()),
	url(r'^item-categorys$', views.getItemCategorys),
	url(r'^items/(?P<item_id>[0-9]+)/chat/$', views.getItemConversationList),
	
	url(r'^item/(?P<item_id>[0-9]+)/getItemTest/$', views.getItemTest),
	url(r'^items/(?P<item_id>[0-9]+)/like/$', views.ItemsFavorList.as_view()),
)