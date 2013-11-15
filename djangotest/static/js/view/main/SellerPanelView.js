var app = app || {};

app.SellerPanelView = Backbone.View.extend({
	el: "#sellerPanel",
	events: {
		"click #itemEditModalBtn": "newEditItemModal",
		"click #shopModalBtn": "newShopModal"
	},
	newEditItemModal:function(){
		this.itemEditModal.open();
		
	},
	newShopModal:function(){
		var shopModal = new app.ShopModalView({model:app.myShop});
		shopModal.open();
	},
	initialize: function() {
		this.itemEditModal = new app.ItemEditModalView();
		this.shopEditModal = new app.ShopEditModalView();
		
		//this.listenTo(myItems, 'sync', this.updateItems);
		this.listenTo(app.myShop.items, 'reset', this.resetItems);
		this.listenTo(app.myShop.items, 'add', this.addItem);
		
		this.$sellerItemsList = this.$('#sellerItemsList');
		this.$sellerShopBox = this.$('#sellerShopBox');
		
		this.shopBox = new app.ShopBoxView({model:app.myShop});
		this.$sellerShopBox.append(this.shopBox.$el);
	},
	resetItems:function(){
		var that = this;
		this.$sellerItemsList.empty();
		app.myShop.items.each(function(item){
			that.addItem(item);
			/*item.chats.fetch({reset:true});
			if(item.get('state') != 'on'){return;}
			var itemBox = new app.SellerItemBoxView({model:item});
			that.$sellerItemsList.append(itemBox.el);*/
		});
	},
	addItem:function(item){
		//console.log('add item');
		//console.log(item.get('name'));
		
		item.chats.fetch({reset:true});
		//console.log(item.get('state'));
		if(item.get('state')!='on'){return;}
		var itemBox = new app.SellerItemBoxView({model:item});
		this.$sellerItemsList.append(itemBox.el);
	}
});
