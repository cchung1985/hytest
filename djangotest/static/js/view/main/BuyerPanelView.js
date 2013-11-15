var app = app || {};

app.BuyerPanelView = Backbone.View.extend({
	el:"#buyerPanel",
	events:{
		"click #buyerPanelSwitch":"switchList",
	},
	initialize:function(){
		this.itemFavorList = new app.ItemFavorListView();
		this.shopFavorList = new app.ShopFavorListView();
		this.render();
	},
	render:function(){
		this.$el.append(
		'<button id="buyerPanelSwitch" style="position:absolute;\
						top:0px;\
						right:0px;\
						margin:10px;\
						width:60;\
						height:24;">商店清單</button>');
	},
	switchList:function(){
		var $itemList 	= this.$("#itemFavorList");
		var $shopList 	= this.$("#shopFavorList");
		var $switch 	= this.$("#buyerPanelSwitch");
		
		if($switch.text()=='商店清單'){
			$switch.text('商品清單');
			$itemList.hide();
			$shopList.show();
		}else if($switch.text()=='商品清單'){
			$switch.text('商店清單');
			$itemList.show();
			$shopList.hide();
		}
	},
});