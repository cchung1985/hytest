var app = app || {};

app.Item = Backbone.Model.extend({
	urlRoot:'items/',
	initialize: function(){
		var that = this;
		this.chats = new app.Chats();
		this.chats.url = function(){
			return 'items/'+that.id+'/chat/';
		}
	}
});

app.Items = Backbone.Collection.extend({
	model: app.Item
});


