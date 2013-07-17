from django.conf.urls import patterns, url

from shops import views

urlpatterns = patterns('',
	url(r'^items$', views.items),
	url(r'^.*$','django.views.defaults.page_not_found')
)