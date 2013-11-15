//Global Variables
var app = app || {};

app.loginUser = new app.LoginUser();
app.itemCategorys = new app.ItemCategorys();
app.myShop = new app.Shop();
console.log(app.myShop);
new app.myRouter();
Backbone.history.start();

// this is where all the site code should begin
// using jQuery
function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
	// these HTTP methods do not require CSRF protection
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
	// test that a given url is a same-origin URL
	// url could be relative or scheme relative or absolute
	var host = document.location.host; // host + port
	var protocol = document.location.protocol;
	var sr_origin = '//' + host;
	var origin = protocol + sr_origin;
	// Allow absolute or scheme relative URLs to same origin
	return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
		(url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
		// or any other URL that isn't scheme relative or absolute i.e relative.
		!(/^(\/\/|http:|https:).*/.test(url));
}
$.ajaxSetup({
	beforeSend: function(xhr, settings) {
		if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
			// Send the token to same-origin, relative URLs only.
			// Send the token only if the method warrants CSRF protection
			// Using the CSRFToken value acquired earlier
			xhr.setRequestHeader("X-CSRFToken", csrftoken);
		}
	}
});





function confirm(message,func){
	var $modal= $(
		'<div class="modal fade" tabindex="-1">\
			<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<h4 class="modal-title">確認</h4>\
					</div>\
					<div class="modal-body">\
						<div class="btn-confirm-message"></div>\
					</div>\
					<div class="modal-footer">\
						<button class="btn btn-default btn-confirm-cancel">取消</button>\
						<button class="btn btn-primary btn-confirm-ok">確定</button>\
					</div>\
				</div>\
			</div>\
		</div>').modal('show');
	console.log($modal);
	var $msg = $modal.find('.btn-confirm-message').text(message);
	var $ok = $modal.find('.btn-confirm-ok').click(function(){
		$modal.on('hidden.bs.modal',function(){
			$modal.remove();
			$modal = null;
		}).modal('hide');
		func(true);
	});
	
	var $cancel = $modal.find('.btn-confirm-cancel').click(function(){
		$modal.on('hidden.bs.modal',function(){
			$modal.remove();
			$modal = null;
		}).modal('hide');
		func(false);
	});
}

function msgbox(message){
	var $modal= $(
		'<div class="modal fade" tabindex="-1">\
			<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<h4 class="modal-title">確認</h4>\
					</div>\
					<div class="modal-body">\
						<div class="btn-confirm-message"></div>\
					</div>\
					<div class="modal-footer">\
						<button class="btn btn-primary btn-confirm-ok">確定</button>\
					</div>\
				</div>\
			</div>\
		</div>').modal('show');
	console.log($modal);
	var $msg = $modal.find('.btn-confirm-message').text(message);
	var $ok = $modal.find('.btn-confirm-ok').click(function(){
		$modal.on('hidden.bs.modal',function(){
			$modal.remove();
			$modal = null;
		}).modal('hide');
	});
}





//var myEvents = new Events();

////////////////Global Events start////////////////
var globalEvents = {
	newmsg:function(data){
		var reply = data;
		app.myShop.items.each(function(item){
			console.log(item.get('name'));
			item.chats.each(function(chat){
			//console.log("chat.get('id'): "+chat.get('id'));
			//console.log("reply.chat: "+reply.chat);
				if(chat.get('id') == reply.chat){
					if(chat.replys.length==0){
						$("img[data-chat-id="+chat.get('id')+"]").addClass('newmsg');
						$("img[data-item-id="+item.get('id')+"]").addClass('newmsg');
					}
					else{
						chat.replys.each(function(existReply){
							existReply.get('id') == reply.id;
							return;
						});
						reply = new app.Reply(reply);
						//reply.trigger('seen');
						//reply.once('seen',funciton(){
							//remove event
						//	event.destroy();
						//});
						chat.replys.add(reply);
					}
				}
			});
		});
		//console.log('receive a new messgae')
	},
	//sendMessage:function(data){
	//	myShop.items.each(function(item){
	//		//item.
	//	});
	//},
	shopUpdate:function(){
		//do something
	},
	test:function(data){
		console.log(data);
	}
};


function hEvent(e){
	console.log(e);
	_.each(e.events,function(event){
		this[event.type](event.data);
	}, globalEvents);
	
	$.post('accounts/events', {time:e.time}).done(function(e){
		hEvent(e);
	}).fail(function(){
		console.log('connection error');
	});
};

$(function(){
	new app.AppView();

	window.onresize = function(event) {
		if(window.innerWidth>window.innerHeight){
			this.$(".item-box-description").css("display","block");
		}else{
			this.$(".item-box-description").css("display","none");
		}
	}

});
