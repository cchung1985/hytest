var app = app || {};

app.BuyerItemBoxView = Backbone.View.extend({
	className: "buyer-item-box",
	events: {
		"click .item-delete":"deleteItem",
		"click .chat-box":"openChatroom",
	},
	initialize: function() {
		this.item = this.model;
				
		this.listenTo(this.item, "destroy", this.remove);
		this.listenTo(this.item.chats, "reset", this.render);
		
		this.render();
	},
	deleteItem: function(){
		var that = this;
		confirm('確定要刪除"'+this.item.get('name')+'"?',function(result){
			if(!result){return;}
			that.item.destroy();
		});
	},
	openChatroom:function(event){
		var that = this;
		this.item.chats.each(function(chat){
			var chatroom = new app.ChatroomModalView({model:chat});
			chatroom.open();
		});
		//alert(this.item.chats.get('id'));
	
	/*
		var $chatbox = $(event.currentTarget);
		var chatID = $chatbox.attr('data-chat-id');
		var chat = this.item.chats.find(function(chat){
			return (chat.get('id') == chatID);
		});
		var chatroom = new app.ChatroomModalView({model:chat});
		chatroom.open();
		$chatbox.next().removeClass('newmsg');
	*/
	},
	render: function(){
		var that = this;
		this.$el.empty();
		
		var $chatList = $(
			'<div class="chat-list">\
			</div>'
		);
		
		
		this.item.chats.each(function(chat){
			//alert('item chats');
			var seller = chat.get('seller')
			var seen = chat.get('buyer_seen');
			var id = chat.get('id');
			//var notification_img = "./img/notification.png";
			$chatList.append($(
				'<div class="chat-box" data-chat-id='+id+'>\
					<span class="chat-to">'+seller+'</span>\
					<span class="badge '+(seen?'seen':'unseen')+'" style="float:right">new</span>\
				</div>'
			));
		});

		var itemBox = new app.ItemBoxView({model:this.item});
		var removeBtn = '<button class="item-delete glyphicon glyphicon-remove pull-right" style="border:none; background-color:white; color:red"></button>';
		this.$el.append(removeBtn).append(itemBox.el).append($chatList);
		return this;
	}
});
