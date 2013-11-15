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
		this.listenTo(this.item.chats, "sync", this.render);
		
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
		var chat = this.item.chats.get(chatID);
		//alert('chatID='+chatID);
		//var chat = this.item.chats.find(function(chat){
		//	return (chat.get('id') == chatID);
		//});
		var chatroom = new app.ChatroomModalView({model:chat});
		chatroom.open();
		
		var $boxBadge = this.$('.chat-box[data-chat-id="'+chatID+'"] .badge');
		if($boxBadge.hasClass('unseen')){
			//$chatbox.next().removeClass('unseen').addClass('seen');
			$boxBadge.removeClass('unseen').addClass('seen');
			
			var $listBadge = this.$('.panel-title .badge');
			var count = parseInt($listBadge.text());
			//alert(count);
			$listBadge.text(count-1);
			if(count-1<=0){
				$listBadge.removeClass('unseen').addClass('seen');
			}
		}
	},
	render: function(){
		var that = this;
		
		this.$el.empty();
		var num = this.item.chats.length;
		var item_id = this.item.get('id');
		//var notification_img = "./img/notification.png";
		var $chatList = $(
			'<div class="panel-group" id="chats'+item_id+'">\
				<div class="panel panel-default">\
					<div class="panel-heading" style="padding:5px">\
						<h4 class="panel-title">\
							<span class="badge" style="float:right"></span>\
							<span class="glyphicon glyphicon-collapse-down"></span>\
							<a class="accordion-toggle" data-toggle="collapse" href="#item'+item_id+'">有 '+num+' 人追蹤</a>\
						</h4>\
					</div>\
					<div id="item'+item_id+'" class="panel-collapse collapse">\
						<div class="chat-list">\
						</div>\
					</div>\
				</div>\
			</div>'
		);
		
		var unseenCount = 0;
		this.item.chats.each(function(chat, index){
			var buyer = chat.get('buyer');
			var id = chat.get('id');
			var seen = chat.get('seller_seen');
			if(seen == false){unseenCount += 1;}
			console.log('chat '+id+' seller_seen='+seen);
			$chatList.find(".chat-list").append($(
				'<div class="chat-box" data-chat-id='+id+'>\
					<span class="chats-order">'+(index+1)+'</span>\
					<span class="chat-to">'+buyer+'</span>\
					<span class="badge '+(seen?'seen':'unseen')+'" style="float:right">new</span>\
				</div>'
			));
		});
		//if(unseenCount>0){alert(unseenCount);}
		if(unseenCount>0){
			$chatList.find('.panel-title .badge').text(unseenCount).addClass('unseen');
		}else{
			$chatList.find('.panel-title .badge').addClass('seen');
		}
		
		var itemBox = new app.ItemBoxView({model:this.item});
		var removeBtn = '<button class="item-delete glyphicon glyphicon-remove pull-right" style="border:none; background-color:white; color:red"></button>';
		this.$el.append(removeBtn).append(itemBox.el).append($chatList);
		return this;
	}
});
