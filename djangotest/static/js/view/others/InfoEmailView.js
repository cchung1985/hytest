var app = app || {};

app.InfoEmailView = Backbone.View.extend({
	el:$('#infoEmailModal'),
	initialize: function() {
	},
	events: {
		"click #sendVerifyEmail": "sendVerifyEmail",
	},
	sendVerifyEmail: function(){
		$.post('accounts/send-verify-email',{})
		.done(function(){
			alert('認證信已發送');
		}).fail(function(){
			alert('認證信發送失敗 請稍後再試');
		});
	}
});
