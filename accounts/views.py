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
from accounts.serializers import UserSerializer
from accounts.models import EmailVerification, Verification

#產生驗證圖形用
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

	font_type=r'arial.ttf'
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
		#連結使用者認證資料
		veri = Verification(user = user)
		veri.save()
		#附予新使用者群組Lv0(無權限)
		g = Group.objects.get(name = 'Lv0')
		g.user_set.add(user)
	except:
		#未預期錯誤
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
		return(u'使用者不存在')
	
	email= user.email
	key = randomString(10)

	try:
		emailVeri = user.emailverification
		emailVeri.key = key;
		print('try')	
	except:
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
		return HttpResponse(u'認證信發出失敗')
		
	return HttpResponse(u'認證信已發送至:'+email)


@login_required
def verifyEmail(request):
	key = request.GET.get('key')
	#Check if the key exists
	try:
		emailVeri = EmailVerification.objects.get(key=key)
	except EmailVerification.DoesNotExist:
		return HttpResponse(u'無效認證信', content_type="text/plain")
	
	#Check if the key owner and the request owner is the same person
	if emailVeri.user.username == request.user.username:
		#If yes, add the user into 'Lv1' group
		user = User.objects.get(username = request.user)
		g = Group.objects.get(name = 'Lv1')
		g.user_set.add(user)
		emailVeri.delete()
		return HttpResponse(u'認證成功')
	else:
		#if not, deny this request
		return HttpResponse(u'使用者與認證信收件者不同')

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
	
@login_required
def grouptest(request):
	user = User.objects.get(username = request.user)
	g = Group.objects.get(name = 'Lv1')
	g.user_set.add(user)

	return HttpResponse()
	
	
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
