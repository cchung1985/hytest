var app = app || {};

app.FormFieldView = Backbone.View.extend({
	initialize: function(){
		this.val = function(){
			var $input = this.$('input');
			return $input.val.apply($input, arguments);
		}
	},
	showError: function(msg){
		this.$el.addClass('has-error');
		if(msg){
			this.$('.msg-error').text(msg);
		}
	},
	clearError: function(){
		this.$el.removeClass('has-error');
		this.$('.msg-error').text('');
	}
});
