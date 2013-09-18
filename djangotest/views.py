from django.http import HttpResponse
from django.core.context_processors import csrf
from django.shortcuts import render_to_response

import json
class JSONResponse(HttpResponse):
	def __init__(self, request, data, status=200):
		serialized = json.dumps(data)
		super(JSONResponse, self).__init__(
			content=serialized,
			content_type='application/json',
			status=status
		)

'''
from django.template import Context, loader
def index(request):
	template = loader.get_template('index.html')
	print dir(template)
	context = Context({})
	return HttpResponse(template.render(context))
'''

def index(request):
	c = {}
	c.update(csrf(request))
	print csrf(request)
	return render_to_response("index.html", c)