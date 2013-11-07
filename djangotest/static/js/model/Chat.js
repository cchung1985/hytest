var app = app || {};

app.Chat = Backbone.Model.extend({
	default:{
		buyer: null,
		seller: null,
		item: null,
		time: null,
		date: null,
		seller_seen: true,
		buyer_seen: true,
	},
	initialize: function(){
		var that = this;
		this.replys = new app.Replys();
		this.replys.url = 	function(){
			return 'chats/'+that.id;
		};
	}
});

app.Chats = Backbone.Collection.extend({
	model: app.Chat,
});