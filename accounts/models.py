from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User

class EmailVerification(models.Model):
	user = models.OneToOneField(User)
	key = models.CharField(max_length=100)
	date_reg = models.DateTimeField(default=timezone.now)
	
	def __unicode__(self):
		return self.user.username
	
class Verification(models.Model):
	user = models.OneToOneField(User)
	email = models.BooleanField(default=False)
	phone = models.BooleanField(default=False)
	credit = models.BooleanField(default=False)
	
	def __unicode__(self):
		return "user:%s %s,%s,%s" % (self.user.username, str(self.email), str(self.phone), str(self.credit))

class EventType(models.Model):
	type = models.CharField(max_length=20)
	
	def __unicode__(self):
		return self.type

class Event(models.Model):
	user = models.ForeignKey(User)
	event = models.ForeignKey(EventType)
	datetime = models.DateTimeField(auto_now_add=True)
	
	def __unicode__(self):
		return "%s:%s" % (self.user.username, self.event.type)



'''
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
class MyUserManager(BaseUserManager):
	def create_user(self, email, username, password=None):
		if not email:
			raise ValueError('Users must have an email address')
		
		if not username:
			raise ValueError('Users must have username')

		user = self.model(
			email=MyUserManager.normalize_email(email),
			username=username
		)

		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, username, password):
		user = self.create_user(email,
			password=password,
			username=username
		)
		user.is_admin = True
		user.save(using=self._db)
		return user


class MyUser(AbstractBaseUser):
	email = models.EmailField(
		verbose_name='email address',
		max_length=255,
		unique=True,
		db_index=True,
	)
	username = models.CharField(max_length=20);
	is_active = models.BooleanField(default=True)
	is_admin = models.BooleanField(default=False)

	objects = MyUserManager()

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username']

	def get_full_name(self):
		# The user is identified by their email address
		return self.email

	def get_short_name(self):
		# The user is identified by their email address
		return self.email

	def __unicode__(self):
		return self.email

	def has_perm(self, perm, obj=None):
		"Does the user have a specific permission?"
		# Simplest possible answer: Yes, always
		return True

	def has_module_perms(self, app_label):
		"Does the user have permissions to view the app `app_label`?"
		# Simplest possible answer: Yes, always
		return True

	@property
	def is_staff(self):
		"Is the user a member of staff?"
		# Simplest possible answer: All admins are staff
		return self.is_admin
	
'''
