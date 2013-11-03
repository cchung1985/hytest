var app = app || {};

app.ShopModalView = Backbone.View.extend({
	el: "#shopModal",
	initialize: function() {
		var that = this;
		this.myShop = this.model;
		this.$shopModalItemList = this.$("#shopModalItemList");
		this.listenTo(this.myShop.items, 'reset', this.render);
	},
	render: function(){
		var that = this;
		var shopName = this.myShop.get('name');
		
		this.$("#shopModalBoard h4").text(shopName);
		
		this.myShop.items.each(function(item){
			var itemBox = new app.ItemBoxView({model:item});
			that.$shopModalItemList.append(itemBox.el);
		});
	},
	open: function(item){
		this.$el.modal('show');
	}
});
