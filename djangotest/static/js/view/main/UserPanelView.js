var app = app || {};

app.UserPanelView = Backbone.View.extend({
	el: $("#userPanel"),
	events:{
		"click #settingModalbtn": "openSettingModal",
		"click #logoutBtn":	"logout",
	},
	openSettingModal:function(){
		//do something
	},
	logout: function(){
		$.get('accounts/logout').done(function(data) {
			//重新整理
			location.reload();
		}).fail(function(){
			alert('登出失敗!');
		});
	}
});
