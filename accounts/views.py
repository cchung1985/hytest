# coding=utf-8
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.http import HttpResponse

from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.mail import EmailMultiAlternatives
from django.views.decorators.http import require_http_methods, require_GET, require_POST
#from django.views.decorators.csrf import csrf_exempt

from rest_framework.renderers import JSONRenderer
#from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from accounts.serializers import *
from accounts.models import *
from django.contrib.sessions.models import Session

#圖形驗證碼
from PIL import Image, ImageFont, ImageDraw
import StringIO

import string
import random
def randomString(length):
	return ''.join(random.choice(string.ascii_uppercase + string.digits) for i in range(length))

class JSONResponse(HttpResponse):
	def __init__(self, data, **kwargs):
		content = JSONRenderer().render(data)
		kwargs['content_type'] = 'application/json'
		super(JSONResponse, self).__init__(content, **kwargs)
		
@require_GET
def login_view(request):
	email = request.GET.get('email')
	password = request.GET.get('password')
	user = authenticate(username=email, password=password)
	if user is None:
		return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
	elif not user.is_active:
		return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
	else:
		login(request, user)
		return HttpResponse()

def logout_view(request):
	logout(request)
	return HttpResponse()

@require_GET
def checkEmail(request):
	email = request.GET.get('email')
	
	try:
		validate_email(email)
	except ValidationError:
		return JSONResponse({'status':'ERROR','msg':'非合法帳號'})
	
	try:
		User.objects.get(email=email)
		return JSONResponse({'status':'ERROR','msg':'帳號已存在'})
	except User.DoesNotExist:
		return JSONResponse({'status':'OK'})

@require_GET
def checkUsername(request):
	name = request.GET.get('name')
	try:
		User.objects.get(username=name)
		return JSONResponse({'status':'ERROR','msg':'名稱已存在'})
	except User.DoesNotExist:
		return JSONResponse({'status':'OK'})


@require_GET
def captcha(request):
	captcha = randomString(6)
	request.session['captcha'] = captcha

	font_type='arial.ttf'
	font_size=20
	
	try:
		font=ImageFont.truetype("arial.ttf",font_size)
	except:
		print("font has been created")
	
	im=Image.new('RGB',(120,40),(255,255,255))
	draw=ImageDraw.Draw(im)
	draw.text((20,10),captcha,font=font,fill=(0,0,222))
	
	for w in xrange(120):
		for h in xrange(40):
			tmp=random.randint(0,100)
			if tmp>98:
				draw.point((w,h),fill=(0,0,0))
	
	output = StringIO.StringIO()
	im.save(output,"PNG")
	content = output.getvalue()
	output.close()  
	return HttpResponse(content, content_type='image/png')


@api_view(['GET'])
def user_i_view(request):
	user = request.user
	if user.is_anonymous():
		return Response({'name':'guest'})
	
	serializer = UserSerializer(user)
	data = serializer.data
	data['id'] = 'i'
	return Response(data)

import traceback

@require_POST
def createUser(request):
	captcha = request.POST.get('captcha')
	name = request.POST.get('name');
	password = request.POST.get('password');
	email = request.POST.get('email');
	
	ret = {}
	if captcha is None or captcha != request.session.get('captcha'):
		if 'captcha' in request.session:
			del request.session['captcha']
		ret['captcha'] = '驗證碼錯誤'
	
	if name is None or len(name) < 1:
		ret['name'] = '名稱錯誤'
	elif len(name) > 20:
		ret['name'] = '名稱太長'
		
	if password is None:
		ret['password'] = '密碼錯誤'
	elif len(password) < 8:
		ret['password'] = '密碼太短'
	elif len(password) > 16:
		ret['password'] = '密碼太長'
	
	try:
		validate_email(email)
	except ValidationError:
		ret['email'] = '非合法帳號'
		
	try:
		User.objects.get(email=email)
		ret['email'] = '帳號已存在'
	except User.DoesNotExist:
		pass
	
	try:
		User.objects.get(username=name)
		ret['name'] = '名稱已存在'
	except User.DoesNotExist:
		pass
	
	if ret:
		ret['status'] = 'ERROR'
		return JSONResponse(ret)
	
	try:
		#新增使用者
		user = User(username=name,email=email)
		user.set_password(password)
		user.save()
	except:
		print('connot add new user')
		return JSONResponse({'status':'ERROR'})
		
	try:
		#連結使用者認證資料
		veri = Verification(user = user)
		veri.save()
	except:
		print('cannot connect verification data')
		return JSONResponse({'status':'ERROR'})
	
	try:
		#附予新使用者群組Lv0(無權限)
		g = Group.objects.get(name = 'Lv0')
		g.user_set.add(user)
	except:
		print('cannot add user to an initial group')
		return JSONResponse({'status':'ERROR'})
	
	user = authenticate(username=email, password=password)
	if user is not None:
		login(request, user)
		sendVerifyEmail(request)
	return JSONResponse({'status':'OK'},status=status.HTTP_201_CREATED)


@login_required
def sendVerifyEmail(request):
	
	print(request.user)
	try:
		user = User.objects.get(username=request.user)
	except User.DoesNotExist:
		return('使用者不存在')
	
	email= user.email
	key = randomString(10)

	try:
		#If the user already have one, then only update the key value
		#若該使用者已有key，則修改Key值
		emailVeri = user.emailverification
		emailVeri.key = key;
		print('try')	
	except:
		#If not, create new data to store email-verification key
		#若沒有，則新增認證碼
		emailVeri = EmailVerification(user=user, key=key)
		print('except')
		
	emailVeri.save()
	
	url = 'http://127.0.0.1:8000/accounts/verify?key=%s'%(key)
	subject = '會員信箱認證(測試)'
	from_email = '測試測試<mark.humanwell@gmail.com>'
	to = email
	text_content = url
	html_content = '<html><body><a href="%s">確認信箱%s</a></body></html>'%(url,url)
	msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
	msg.attach_alternative(html_content, "text/html")

	try:
		msg.send()
	except:
		return HttpResponse('認證信發送失敗')
		
	return HttpResponse('認證信已發出至：'+email)


@login_required
def verifyEmail(request):
	key = request.GET.get('key')
	#Check if the key exists 確認認證碼是否存在
	try:
		emailVeri = EmailVerification.objects.get(key=key)
	except EmailVerification.DoesNotExist:
		return HttpResponse(u'無效認證信', content_type="text/plain")
	
	#Check if the key owner and the request owner is the same person
	#確認認證碼擁有者是否與發送要求者為同一人
	if emailVeri.user.username == request.user.username:
		#If yes, add the user into 'Lv1' group
		#如果是，把該使用者群組升至Lv1
		user = User.objects.get(username = request.user)
		g = Group.objects.get(name = 'Lv1')
		g.user_set.add(user)
		emailVeri.delete()
		#and set the user's is_emailverified field as true
		#並把該使用者的is_emailverified欄位設定為true
		try:
			veri = user.verification
			veri.email= True
			veri.save()
			return HttpResponse('認證成功')
		except:
			traceback.print_exc()
			print('欄位有誤')
			return HttpResponse(u'認證失敗')
	else:
		#if not, deny this request
		#若為錯
		return HttpResponse('使用者與認證信收件者不同')

@require_POST
def changePassword(request):
	password = request.POST.get('password')
	newPassword = request.POST.get('newpassword')
	user = request.user
	
	if not user.check_password(password):
		return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
	
	user.set_password(newPassword)
	user.save()
	print 'change passowrd'
	return HttpResponse()

import time
import json
from django.utils import timezone
from django.utils.timezone import utc
@login_required
def events(request):
	#Check datetime
	try:
		begin = timezone.now().strptime(request.POST['time'], "%Y-%m-%dT%H:%M:%S.%fZ")
		begin = begin.replace(tzinfo=utc)
	except KeyError:
		begin = timezone.now()

	#Query for new events
	has_event = False
	while has_event != True:
		print('event')
		time.sleep(5)
		end = timezone.now()
		models = Event.objects.filter(user__username=request.user.username, datetime__range=[begin, end])
		if models:
			has_event = True

	#Retrieve event data as json
	events = {"events":[],"time":end}
	count = 0
	for event in models:
		seri = EventSerializer(event)
		type = seri.data['event']
		if type == 'test':
			data = testEvent()
			events['events'].append({"type":type, "data":data})
		elif type == 'newmsg':
			data = msgEvent(event)
			events['events'].append({"type":type, "data":data})
	
	events = JSONRenderer().render(events)
	
	return HttpResponse(events, mimetype="application/json")


from chats.models import Reply
from chats.serializer import ReplySerializer
def msgEvent(event):
	reply = Reply.objects.get(id = event.data_id)
	seri = ReplySerializer(reply)
	return seri.data
	
def addEvents(request):
	eventType = EventType.objects.get(type = 'test')
	event = Event.objects.create(user=request.user, event=eventType)
	
	return HttpResponse('addEvent')

def testEvent():
	return 'Test Event'

'''
class userDetail(APIView):
	def get(self, request, user_id):
		try:
			user = User.objects.get(id=user_id)
			serializer = UserSerializer(user)
			return Response(serializer.data)
		except User.DoesNotExist:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''
