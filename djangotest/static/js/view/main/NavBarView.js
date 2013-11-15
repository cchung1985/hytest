var app = app || {};

app.NavBarView = Backbone.View.extend({
	el: '#navBar',
	events: {
		"click #logoutBtn": "logout",
		'show.bs.tab #userNav a[href="#sellerPanel"]': "showSellerPanel",
		'shown.bs.tab #userNav a[href="#mapPanel"]': "shownMapPanel"
	},
	initialize: function() {
		this.$userNav = this.$("#userNav");
		this.$guestNav = this.$("#guestNav");
		this.guestMode();
		this.listenTo(app.loginUser, 'getNav', this.loginMode);
	},
	guestMode: function(){
		this.$userNav.hide();
		this.$guestNav.show();
	},
	loginMode: function(){
		this.$userNav.show().find('#navUsername').text(app.loginUser.get('name'));
		this.$guestNav.hide();
	},
	showSellerPanel: function(){
		$("#sellerPanel").trigger('show');
	},
	shownMapPanel:function(){
		$("#mapPanel").trigger('shown');
	}
});
