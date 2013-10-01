# coding=utf-8

"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
from django.contrib.auth.models import User
from django.test.client import Client
from django.utils import unittest

import json
#from accounts import 

class SimpleTest(TestCase):
	def test_basic_addition(self):
		"""
		Tests that 1 + 1 always equals 2.
		"""
		self.assertEqual(1 + 1, 2)


class accountsTest(TestCase):
	def setUp(self):
		super(accountsTest, self).setUp()
		User.objects.create_user('test', 'test@gmail.com', '00000000')
	
	def test_login_view(self):
		c = Client()
		
		#Test valid user 測試合法用戶
		response = c.get('/accounts/login', {'email':'test@gmail.com','password':'00000000'})
		self.assertEqual(response.status_code, 200)
	
		#Test wrong password 測試密碼錯誤
		response = c.get('/accounts/login', {'email':'test@gmail.com','password':'12345678'})
		self.assertEqual(response.status_code, 401)
	
		#Test non-existed user 測試未註冊帳戶
		response = c.get('/accounts/login',{'email':'none@mail.com','password':'000000'})
		self.assertEqual(response.status_code, 401)
		
	def test_logout_view(self):
		c = Client()

		response = c.get('/accounts/logout')
		self.assertEqual(response.status_code, 200)
		
	
	def test_checkEmail(self):
		c = Client()
		
		#Test usable e-mail 測試可用e-mail
		Jresponse = c.get('/accounts/check-email', {'email':'usable@gmail.com'})
		self.assertEqual(Jresponse.status_code,200)
		data = json.loads(Jresponse.content)
		self.assertEqual(data['status'], 'OK')

		#Test existed e-mail 測試已存在e-mail
		Jresponse = c.get('/accounts/check-email', {'email':'test@gmail.com'})
		self.assertEqual(Jresponse.status_code,200)
		data = json.loads(Jresponse.content)
#		self.assertEqual(data['msg'], '帳號已存在')
		self.assertEqual(data['msg'], u'\u5e33\u865f\u5df2\u5b58\u5728')

		#Test illegal e-mail 測試非法e-mail格式
		Jresponse = c.get('/accounts/check-email', {'email':'this_is_not_an_email'})
		self.assertEqual(Jresponse.status_code,200)
		data = json.loads(Jresponse.content)
#		self.assertEqual(data['msg'], '非合法帳號')
		self.assertEqual(data['msg'], u'\u975e\u5408\u6cd5\u5e33\u865f')
		
	def test_checkUsername(self):
		c = Client()
		
		#Test usable username 測試可用username
		Jresponse = c.get('/accounts/check-name', {'name':'usablename'})
		self.assertEqual(Jresponse.status_code,200)
		data = json.loads(Jresponse.content)
		self.assertEqual(data['status'], 'OK')

		#Test existed username 測試已存在username
		Jresponse = c.get('/accounts/check-name', {'name':'test'})
		self.assertEqual(Jresponse.status_code,200)
		data = json.loads(Jresponse.content)
		#self.assertEqual(data['msg'], '名稱已存在')
		self.assertEqual(data['msg'], u'\u540d\u7a31\u5df2\u5b58\u5728')

	def test_user_i_view(self):
		c = Client()
	
		#Test guest 測試未登入使用者
		response = c.get('/accounts/users/i')
		self.assertEqual(response.status_code,200)
		data = json.loads(response.content)
		self.assertEqual(data['name'], 'guest')
		
		#Test user 測試登入使用者
		c.get('/accounts/login', {'email':'test@gmail.com','password':'00000000'})
		c.get('/accounts/users/i')
		response = c.get('/accounts/users/i')
		self.assertEqual(response.status_code,200)
		data = json.loads(response.content)
		self.assertEqual(data['name'], 'test')
	
	def test_createUser(self):
		c = Client()
	
		#Success 測試使用合法資料成功註冊
		c.get('/accounts/captcha')
		captcha 	= c.session['captcha']
		name 		= 'test1'
		password 	= '12345678'
		email 		= 'test1@gmail.com'
		response = c.post('/accounts/create-user', {'captcha':captcha, 'name':name, 'password':password, 'email':email})
		data = json.loads(response.content)
		self.assertEqual(data['status'], 'OK')
		#用新帳號登入測試
		response = c.get('/accounts/login', {'email':email,'password':password})
		self.assertEqual(response.status_code, 200)

		
		#Fail Case1 測試驗證碼錯誤+重複名稱+重複email
		response = c.post('/accounts/create-user', {'captcha':'FJU000', 'name':name, 'password':password, 'email':email})
		self.assertEqual(response.status_code,200)
		data = json.loads(response.content)
		self.assertEqual(data['status'], 'ERROR')
		self.assertEqual(data['captcha'], 	u'\u9a57\u8b49\u78bc\u932f\u8aa4') #驗證碼錯誤
		self.assertEqual(data['email'], 	u'\u5e33\u865f\u5df2\u5b58\u5728') #帳號已存在
		self.assertEqual(data['name'], 		u'\u540d\u7a31\u5df2\u5b58\u5728') #名稱已存在
		
		#Fail Case2 測試密碼太短+名稱太長+非合法email
		c.get('/accounts/captcha')
		captcha 	= c.session['captcha']
		name 		= 'test_username_too_long'
		password 	= 'short'
		email 		= 'test2gmail.com'
		response = c.post('/accounts/create-user', {'captcha':captcha, 'name':name, 'password':password, 'email':email})
		self.assertEqual(response.status_code,200)
		data = json.loads(response.content)
		self.assertEqual(data['password'], 	u'\u5bc6\u78bc\u592a\u77ed') #密碼太短
		self.assertEqual(data['name'], 		u'\u540d\u7a31\u592a\u9577') #名構太長
		self.assertEqual(data['email'], 	u'\u975e\u5408\u6cd5\u5e33\u865f') #非合法帳號
		
		#Fail Case3 測試密碼太長+名稱不合法
		"""
		名稱不合法判斷未完成

		"""
		
#	def test_verifyEmail(self):
#		c = Client()
		
	def test_changePassword(self):
		c = Client()
		
		#Test successful change 測試成功修改
		username = 'test'
		password = '00000000'
		c.login(username=username, password=password)
		response = c.post('/accounts/password',{'password':password,'newpassword':'12345678'})
		self.assertEqual(response.status_code, 200)
		
		#Test fail change 測試修改失敗
		response = c.post('/accounts/password',{'password':password,'newpassword':'12345678'})
		self.assertEqual(response.status_code, 400)

		#Test illegal access 測試非法呼叫
		
				
	def test_doNothing(self):
		c = Client()
		response = c.get('/accounts/')
		#print(response.content)
		self.assertEqual(response.status_code, 404)
		