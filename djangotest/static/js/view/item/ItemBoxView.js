var app = app || {};

app.ItemBoxView = Backbone.View.extend({
	className: "item-box",
	events: {
		"click .item-box":"openItemModal",
		"click .media":"openItemModal",
		"click .item-box-attrs":"openItemModal"
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
				<div class="item-box-description">'+(description==''?'無內容':description)+'</div>\
				<div class="media-body">\
				<h4 class="media-heading" style="white-space:nowrap">'+name+'</h4>\
				<div class="item-box-price">'+price+'</div>\
				<div class="item-box-attrs">\
					<span>背包可裝</span>\
					<span>二手品</span>\
					<span>可議價</span>\
				</div>\
			</div>');
			
		//this.$('.item-box-attrs div').text(attrs);
		//return this;
	},
	openItemModal: function(){
		alert('open modal');
		var itemModal = new app.ItemModalView();
		itemModal.open();
	}
});
