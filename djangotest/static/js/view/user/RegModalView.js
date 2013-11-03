var app = app || {};

app.RegModalView = Backbone.View.extend({
	el: "#regModal",
	events: {
		"show.bs.modal": "showModal",
		"click #registerBtn": "register",
		"click #refreshCaptcha": "getCaptcha",
		"change #regEmail": "checkEmail",
		"change #regUsername": "checkUsername",
		"keyup #regPassword": "checkPassword",
		"keyup #regPasswordConfirm": "checkPasswordConfirm",
		"keyup #regCaptcha": "clearCaptcha",
		"click #regAgree": "clearAgree",
	},
	initialize: function() {
		this.field = {
			name: this.$('#regUsernameField'),
			email: this.$('#regEmailField'),
			password: this.$('#regPasswordField'),
			passwordConfirm: this.$('#regPasswordConfirmField'),
			captcha: this.$('#regCaptchaField'),
			agree: this.$('#regAgreeField')
		}
		
		this.input = {
			name: this.$('#regUsername'),
			email: this.$('#regEmail'),
			password: this.$('#regPassword'),
			passwordConfirm: this.$('#regPasswordConfirm'),
			captcha: this.$('#regCaptcha'),
			agree: this.$('#regAgree')
		}
		
		this.$regBtn = this.$('#registerBtn');
	},
	showError: function(fieldName, msg){
		var $field = this.field[fieldName];
		if(!$field){return;}
		$field.addClass('has-error');
		if(msg){$field.find('.msg-error').text(msg);}
	},
	clearError: function(fieldName){
		var $field = this.field[fieldName];
		$field.removeClass('has-error');
		$field.find('.msg-error').text('');
	},
	clearAgree: function(){
		this.clearError('agree');
	},
	clearCaptcha: function(){
		this.clearError('captcha');
	},
	checkEmail: function(){
		var view = this;
		var email = this.input.email.val();
		if(email.length == 0){
			this.clearError('email');
			return;
		}
		$.getJSON('accounts/check-email', {email: email})
		.done(function(data){
			if(data.status == 'ERROR'){
				view.showError('email',data.msg);
			}else{
				view.clearError('email');
			}
		});
	},
	checkUsername:function(){
		var view = this;
		var name = this.input.name.val();
		var $nameField = this.$nameField;
		if(name.length == 0){
			this.clearError('name');
			return;
		}else if(name.length > 20){
			view.showError('name', '名稱太長');
			return;
		}
		$.getJSON('accounts/check-name', {name:name}).done(function(data){
			if(data.status == 'ERROR'){
				view.showError('name', data.msg);
			}else{
				view.clearError('name');
			}
		});
	},
	checkPassword:function(){
		var password = this.input.password.val();
		var length = password.length;
		if(length > 0 && length < 8){
			this.showError('password', '密碼長度太短');
		}else if(length > 16){
			this.showError('password', '密碼長度太長');
		}else{
			this.clearError('password');
		}
	},
	checkPasswordConfirm:function(){
		var password = this.input.password.val();
		var passwordConfirm = this.input.passwordConfirm.val();
		
		if(password != passwordConfirm){
			this.showError('passwordConfirm', '密碼不符');
		}else{
			this.clearError('passwordConfirm');
		}
	},
	showModal: function() {
		this.getCaptcha();
		this.input.name.val("");
		this.input.email.val("");
		this.input.password.val("");
		this.input.passwordConfirm.val("");
		this.input.captcha.val();
		this.input.agree.prop("checked",false);
		this.$('.error').removeClass('error');
		this.$('.msg-error').text('');
	},
	getCaptcha: function(){
		var d = new Date();
		$("#regCaptchaImage").attr("src", "accounts/captcha?"+d.getTime());
		this.input.captcha.val('');
	},
	register: function() {
		var view = this;
		var name = this.input.name.val();
		var email = this.input.email.val();
		var password = this.input.password.val();
		var captcha = this.input.captcha.val();
		var agree = this.input.agree.prop("checked");
		
		if(this.$('.error').length != 0){
			return;
		}else if(email.length == 0){
			this.showError('email', '請輸入帳號');
			return;
		}else if(name.length == 0){
			this.showError('name', '請輸入名稱');
			return;
		}else if(password.length == 0){
			this.showError('password', '請輸入密碼');
			return;
		}else if(captcha.length == 0){
			this.showError('captcha', '請輸入驗證碼');
			return;
		}else if(!agree){
			this.showError('agree');
			return;
		}
		
		var $regBtn = this.$regBtn;
		$regBtn.button('loading');
		
		$regBtn.prop('disabled', true);
		$.post('accounts/create-user',{name:name,email:email,password:password,captcha:captcha},'json')
		.done(function(data){
			$regBtn.prop('disabled', false);
			$regBtn.button('reset');
			console.log(data);
			if(data.status == 'OK'){
				view.$el.modal('hide');
				loginUser.fetch();
				msgbox('註冊成功!! 認證信已發送至'+email);
				return;
			}
			
			for(var fieldName in data){
				if(fieldName == 'captcha'){
					view.getCaptcha();
				}
				view.showError(fieldName, data[fieldName]);
			}
			
		}).fail(function(){
			$regBtn.prop('disabled', false);
			$regBtn.button('reset');
			alert('註冊失敗!');
		});
	},
	render: function() {
		
	}
});
