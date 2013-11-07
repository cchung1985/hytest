var app = app || {};

app.Reply = Backbone.Model.extend({
	default:{
		reply: null,
		speaker: null,
		datetime: null,
	}
});

app.Replys = Backbone.Collection.extend({
	model: app.Reply,
	url: '/chats/chat_id',
});