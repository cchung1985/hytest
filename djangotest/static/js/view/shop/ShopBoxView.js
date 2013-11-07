var app = app || {};

app.ShopBoxView = Backbone.View.extend({
	className: "shop-box",
	events: {
		"click .media":"openShopModal",
	},
	initialize: function() {
		this.shop = this.model;
		this.listenTo(this.model, "change", this.render);
		this.render();
	},
	render: function() {
		var name = this.model.get('name');
		var address = this.model.get('address');
		var description = this.model.get('description');
		var isOpen = this.model.get('open');
		var shopimg = './img/Shop.png';
		this.$el.html(
			'<div class="media">\
				<a class="pull-left" href="#">\
				<img class="media-object" data-src="holder.js/64x64" src="img/Shop.png" alt="'+name+'" style="width:64px; height:64px">\
				</a>\
				<div class="media-body">\
					<h4 class="media-heading shop-box-name">'+name+'</h4>\
					<div class="shop-box-subtitle">十七字簡單解說商店性質拍賣商品為何</div>\
					<div class="shop-box-item-num">12</div>\
				</div>\
			</div>'
		);
	},
	openShopModal: function(){
		var shop = new app.Shop();
		shop.set('id',this.shop.get('id'));
		shop.fetch().pipe(function(){
			return shop.items.fetch({reset:true});
		}).done(function(){
			var shopModal = new app.ShopModalView({model:shop});
			shopModal.open();
		}).fail(function(){
			alert('網路傳輸錯誤 請稍後再試');
		});
	},
});

