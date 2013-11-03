var app = app || {};

app.LoginModalView = Backbone.View.extend({
	el: $("#loginModal"),
	events: {
		"show": "showModal",
		"click #loginBtn": "login",
	},
	initialize: function() {
		this.$('#loginEmail').val("");
		this.$('#loginPassword').val("");
	},
	showModal: function() {
		this.$('#loginPassword').val("");
	},
	login: function() {
		var that = this;
		var email = this.$("#loginEmail").val();
		var password = this.$("#loginPassword").val();
		app.loginUser.login(email,password)
		.done(function(){
			that.$el.modal('hide');
		}).fail(function(jqXHR, textStatus, errorThrown){
			alert('帳號或密碼錯誤!');
		});
		this.$('#loginPassword').val("");
	}
});
