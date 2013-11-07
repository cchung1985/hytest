var app = app || {};

app.ShopFavorListView = Backbone.View.extend({
	el:"#shopFavorList",
	initialize:function(){
		//this.$el.html('ShopList');
		
		this.listenTo(app.myFavorite.shops,'reset',this.renderShops)
	},
	renderShops:function(shops){
		var that = this;
		shops.each( function(shop){
			that.renderShop(shop);
		});
	},
	renderShop:function(shop){
		var shopBox = new app.ShopBoxView({model:shop});
		//this.$(".shop-favor-list").append(shopBox.el);
		this.$el.append(shopBox.el);
	}
});