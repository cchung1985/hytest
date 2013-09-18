from django.contrib.auth.models import User

from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
	name = serializers.CharField(source='username')
	'''
	def validate_name(self, attrs, source):
		print attrs
		print source
		value = attrs[source]
		if "a" not in value.lower():
			raise serializers.ValidationError("Blog post is not about Django")
		return attrs
	'''
	
	class Meta:
		model = User
		fields = ('id', 'name', 'email')