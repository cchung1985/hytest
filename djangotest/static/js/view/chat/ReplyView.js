var app = app || {};

app.ReplyView = Backbone.View.extend({
	tagName: 'li',
	initialize: function(){
		this.reply = this.model;

		this.listenTo( this.reply, 'sync', this.renderTime);
		this.listenTo( this.reply, 'fail', this.renderError);
	},
	events:{
		'click .btn-xs':'resend'
	},
	renderReply:function(){
		if(this.reply.get('speaker')==app.loginUser.get('name')){
			var div = '	<div class="pull-right msgbox msg-me">'
		}
		else{
			var div = '	<div class="pull-left msgbox msg-other">'
		}
		
		this.$el.html(
			div
		+'		<div class="speaker">'+this.reply.get('speaker')+'</div>'
		+'		<p class="">'+this.reply.get('reply')+'</p>'
		+'		<div class="" style="width:100%">'
		+'			<div class="pull-right time"></div>'
		+'		</div>'
		+'	</div>'
		+'	<div style="clear:both;"></div>'					
		);
		
		this.renderTime();
		
		return this;
	},
	renderTime: function(){
		var time;
		if(typeof this.reply.get('datetime')==='undefined'){
			time = '傳送中…';
		}
		else{
			var now = new Date();
			var d = new Date(this.reply.get('datetime'));
			var M = d.getMonth()+1;
			var D = d.getDate();
			var HH = d.getHours();
			var MM = d.getMinutes();
			
			if(now.getDate()==d.getDate()){
				time = HH+':'+MM;
			}
			else{
				time = M+'/'+D+' '+HH+':'+MM;
			}
		}
		
		this.$('.time').html(time);
	},
	renderError: function(){
		this.$('.time').html(
			'傳送失敗<button type="button" class="btn btn-default btn-xs">重新傳送</button>'				
		);
	},
	resend: function(){
		this.$('.time').html('傳送中…');
		console.log(this);
		var reply = this.reply;
		reply.save().fail(function(){
			reply.trigger('fail');
		});
	}
});
