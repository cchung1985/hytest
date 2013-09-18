from django.conf.urls import patterns, url

from shops import views

urlpatterns = patterns('',
	url(r'^create-item$', views.createItem),
	#url(r'^items/$', views.createItem),
	url(r'^upload/items/(?P<item_id>\d+)/image/(?P<index>\d+)$', views.uploadItemImage),
	url(r'^items/$', views.ItemsList.as_view()),
	url(r'^items/i/$', views.items_i),
	url(r'^items/(?P<id>[0-9]+)$', views.ItemsDetail.as_view()),
	url(r'^item-categorys$', views.getItemCategorys),
	url(r'^.*$','django.views.defaults.page_not_found')
)