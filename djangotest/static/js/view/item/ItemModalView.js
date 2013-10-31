var app = app || {};

app.ItemModalView = Backbone.View.extend({
	el: "#itemModal",
	open: function(){
		this.$el.modal('show');
	}
});
