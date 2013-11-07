var app = app || {};

app.SellerItemBoxView = Backbone.View.extend({
	className: "seller-item-box",
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
		var $chatbox = $(event.currentTarget);
		var chatID = $chatbox.attr('data-chat-id');
		var chat = this.item.chats.find(function(chat){
			return (chat.get('id') == chatID);
		});
		var chatroom = new app.ChatroomModalView({model:chat});
		chatroom.open();
		$chatbox.next().removeClass('newmsg');
	},
	render: function(){
		var that = this;
		
		this.$el.empty();
		var num = this.item.chats.length;
		var item_id = this.item.get('id');
		var notification_img = "./img/notification.png";
		var $chatList = $(
			'<div class="panel-group" id="chats'+item_id+'">\
				<div class="panel panel-default">\
					<div class="panel-heading">\
						<h4 class="panel-title">\
							<span class="glyphicon glyphicon-collapse-down"></span>\
							<a class="accordion-toggle" data-toggle="collapse" href="#item'+item_id+'">有 '+num+' 人找你</a>\
							<img class="pull-right" data-item-id="'+item_id+'" src='+notification_img+'>\
						</h4>\
					</div>\
					<div id="item'+item_id+'" class="panel-collapse collapse in">\
						<div class="chat-list">\
						</div>\
					</div>\
				</div>\
			</div>'
		);
		
		this.item.chats.each(function(chat, index){
			var buyer = chat.get('buyer');
			var id = chat.get('id');
			var seen = chat.get('seller_seen');
			if(seen == false){chats_seen = false}
			console.log('chat '+id+' seller_seen='+seen);
			$chatList.find(".chat-list").append($(
				'<div class="chat-box" data-chat-id='+id+'>\
					<span class="chats-order">'+(index+1)+'</span>\
					<span class="chat-to">'+buyer+'</span>\
					<span class="badge" style="float:right">new</span>\
				</div>'
			));
		});
		
		var itemBox = new app.ItemBoxView({model:this.item});
		var removeBtn = '<button class="item-delete glyphicon glyphicon-remove pull-right" style="border:none; background-color:white; color:red"></button>';
		this.$el.append(removeBtn).append(itemBox.el).append($chatList);
		return this;
	}
});
