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
		//alert(this.item.chats.get())
	
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
		var seen = true;
		var id = 0;
		this.$el.empty();
		var notification_img = "./img/notification.png";
		var $chatList = $(
			'<div class="chat-list">\
				<div class="chat-box">\
					<span class="chat-to">'+'seller'+'</span>\
					<span class="badge" style="float:right">new</span>\
				</div>\
			</div>'
		);
		

		/*
		var seller = chat.get('seller');
		var id = chat.get('id');
		var seen = chat.get('buyer_seen');
		if(seen == false){chats_seen = false}
		console.log('chat '+id+' buyer_seen='+seen);
		$chatList.find(".chat-list").append($(
			'<div>\
				<span class="chat-to">'+seller+'</span>\
				<button class="chatroom-btn" data-chat-id='+id+'></button>\
				<img class="'+(seen?'':'newmsg')+'" data-chat-id='+id+' src='+notification_img+'>\
			</div>'
		));
		*/
		
		var itemBox = new app.ItemBoxView({model:this.item});
		var removeBtn = '<button class="item-delete glyphicon glyphicon-remove pull-right" style="border:none; background-color:white; color:red"></button>';
		this.$el.append(removeBtn).append(itemBox.el).append($chatList);
		return this;
	}
});
