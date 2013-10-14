# coding=utf-8
from django.conf.urls import patterns, url

from accounts import views

urlpatterns = patterns('',
	url(r'^login$', views.login_view, name='login'),
	url(r'^logout$', views.logout_view, name='logout'),
	url(r'^check-email$', views.checkEmail),
	url(r'^check-name$', views.checkUsername),
	url(r'^captcha$', views.captcha),
	url(r'^verify-email$', views.verifyEmail),
	url(r'^send-verify-email$', views.sendVerifyEmail),
	url(r'^users/i$', views.user_i_view),
	url(r'^create-user$', views.createUser),
	url(r'^password$', views.changePassword),
	url(r'^verify$', views.verifyEmail),
	url(r'^events$', views.events),
	#url(r'^users/(?P<user_id>\d+)$', views.userDetail.as_view()),
	
	
	url(r'^.*$','django.views.defaults.page_not_found')
)