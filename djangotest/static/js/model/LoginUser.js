var app = app || {};

app.LoginUser = app.User.extend({
	url: 'accounts/users/i',
	login: function(email, password){
		var dfd = $.Deferred();
		$.get('accounts/login',{email:email,password:password}).done(function(){
			app.loginUser.fetch().done(function(){
				dfd.resolve();
				app.loginUser.trigger('login');
			}).fail(function(){
				dfd.reject();
			});
		}).fail(function(){
			dfd.reject();
		});
		return dfd.promise();
	}
});
