var app = app || {};

app.SettingView = Backbone.View.extend({
	el:$('#settingModal'),
	events:{
		'click #photo-edit':'openPhotoPage',
		'click #email-edit':'openEmailPage',
		'click #name-edit':'openNamePage',
		'click #password-edit':'openPasswordPage',
		'click #newphoto-panel .btn':'changePhoto',
		'click #newpass-panel .btn':'changePassword'
	},
	initialize: function() {
		this.listenTo(app.loginUser, 'change', this.updateUser);
	},
	openPhotoPage: function(){
		$("#newphoto-panel").toggle();
	},
	openEmailPage: function(){
		$("#oldemail-panel").toggle();
		$("#newemail-panel").toggle();
	},
	openNamePage: function(){
		$("#oldname-panel").toggle();
		$("#newname-panel").toggle();
	},
	openPasswordPage: function(){
		$("#oldpass-panel").toggle();
		$("#newpass-panel").toggle();
	},
	changePassword: function(){
		var thisView = this;
		var password = this.$('#settingPassword').val();
		var newPassword = this.$('#settingNewPassword').val();
		var newPassword2 = this.$('#settingNewPassword2').val();
		if (newPassword !== newPassword2){
			alert('新密碼不相符!');
			return
		}
		$.post('accounts/password',{password:password,newpassword:newPassword})
		.done(function(data){
			alert('修改完成!')
			thisView.$('#settingPassword').val('');
			thisView.$('#settingNewPassword').val('');
			thisView.$('#settingNewPassword2').val('');
		}).fail(function(a,b){
			console.log(a)
			console.log(b)
			alert('密碼錯誤!');
		});
	},
	sendVerifyEmail: function(){
		$.post('accounts/send-verify-email',{})
		.done(function(){
			alert('認證信已發送');
		}).fail(function(){
			alert('認證信發送失敗 請稍後再試');
		});
	},
	changePhoto: function(){
		alert('change photo');
	},
	updateUser: function(){
		var email = app.loginUser.get('email');
		var name = app.loginUser.get('name');
		this.$('#oldemail').text(email);
		this.$('#oldname').text(name);
	}
})
