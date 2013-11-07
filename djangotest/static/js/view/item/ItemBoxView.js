var app = app || {};

app.ItemBoxView = Backbone.View.extend({
	className: "item-box",
	events: {
		"click .media":"openItemModal",
	},
	initialize: function() {
		this.item = this.model;
		this.listenTo(this.item, "destroy", this.remove);
		this.listenTo(this.item, "change", this.renderBox);
		this.renderBox();
	},
	renderBox: function() {
		var that = this;
		var name = this.item.get('name');
		var price = this.item.get('price');
		var description = this.item.get('description');
		var attrs = this.item.get('attrs');
		var categoryID = this.item.get('category');
		var img = './img/goods.jpg';
		//var img = '../media/image/items/'+this.item.get('rid')+'-s.png';
		this.$el.html(
			'<div class="media">\
				<a class="pull-left" href="#">\
					<img class="media-object" data-src="holder.js/64x64" src="'+img+'" alt="..." style="width:64px; height:64px">\
				</a>\
				<div class="item-box-description"></div>\
				<div class="media-body">\
				<h4 class="media-heading" style="white-space:nowrap"></h4>\
				<div class="item-box-price">'+price+'</div>\
				<div class="item-box-attrs">\
					<span class="item-box-size-attr"></span>\
					<span class="item-box-condition-attr"></span>\
					<span class="item-box-price-attr"></span>\
				</div>\
			</div>');
		
		//set itme name
		this.$("h4").text(name);
		
		//set item description
		if(description==''){
			this.$(".item-box-description").text('無');
		}else{
			this.$(".item-box-description").text(description);
		}
		
		//set item attributes
		_.each(attrs, function(attr){
			if(attr<3){
				if(attr==1){
					that.$(".item-box-condition-attr").text('全新'); 
				}else if(attr==2){
					that.$(".item-box-condition-attr").text('二手品');
				}
			}else if(attr>=3&&attr<7){
				if(attr==3){
					that.$(".item-box-size-attr").text('口袋小物');
				}else if(attr==4){
					that.$(".item-box-size-attr").text('背包可裝');
				}else if(attr==5){
					that.$(".item-box-size-attr").text('機車可載');
				}else if(attr==6){
					that.$(".item-box-size-attr").text('須開車');
				}
			}else if(attr>6){
				if(attr==7){
					that.$(".item-box-price-attr").text('不二價');
				}else if(attr==8){
					that.$(".item-box-price-attr").text('可議價');
				}
			}
		});
		
		//this.$('.item-box-attrs div').text(attrs);
		//return this;
	},
	openItemModal: function(){
		var item = new app.Item();
		item.set('id',this.item.get('id'));
		item.fetch().done( function(){
			var itemModal = new app.ItemModalView({model:item});
			itemModal.open();
		}).fail(function(){
			alert('網路發生錯誤');
		});
	}
});
