var app = app || {};
app.ChatroomModalView = Backbone.View.extend({
	className:'modal fade',
	initialize: function(){
		this.chat = this.model;

	
		this.initChat();
		
		this.listenTo( this.chat.replys, 'reset', this.renderBody);
		this.listenTo( this.chat.replys, 'add', this.renderReply);
	},
	events:{
		'click .modal-footer>button':'sendReply',
		'click .close':'close',
		'click .open':'open'
	},
	initChat:function(){
		//Chatroom Modal
		this.$el.html(
			'<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
						<h4 class="modal-title">'+this.chat.get('item')+'</h4>\
					</div>\
					<div class="modal-body" style="background-color: #E8E8E8">\
						<ul class="msglist">\
						</ul>\
					</div>\
					<div class="modal-footer" style="margin-top:0px">\
						<input type="text" class="form-control pull-left" placeholder="Enter message">\
						<button type="button" class="btn btn-default">送出</button>\
					</div>\
				</div>\
			</div>'
		);
	},
	renderBody:function(){
		console.log(this.chat.replys.length);
		$('.msglist').html('');
		this.chat.replys.each(function(reply){
			this.renderReply(reply);
		}, this);
		$('.msglist').scrollTop(8000);	//scroll bar位置還要修改 #BW15B
	},
	renderReply:function(reply){
		var replyView = new app.ReplyView({model:reply});
		replyView.chat = this.chat;
		this.$('.msglist').append(replyView.renderReply().el);
	
		if(typeof reply.get('datetime')=='undefined'){
			reply.save().fail(function(){
				reply.trigger('fail');
			});					
		}
	},
	sendReply:function(){
		if($(".modal-footer>input").val()){
			var data={
				reply:$(".modal-footer>input").val(),
				speaker : this.chat.get('seller'),
				receiver : this.chat.get('buyer'),
			};
			
			var reply = new app.Reply(data);
			reply.chat = this.chat;
			reply.url = 'chats/'+this.chat.get('id');
			this.chat.replys.add(reply);
			$(".modal-footer>input").val('');
		}
	},

	close:function(){
		this.chat.replys.reset();
		this.remove();
	},
	open:function(){
		this.chat.replys.fetch({reset:true});
		this.$el.modal('show');
	}
});
