var app = app || {};

app.ItemFavorListView = Backbone.View.extend({
	el:"#itemFavorList",
	initialize:function(){
		//this.items = this.collection;
		//this.$el.html('ItemList');
		
		this.listenTo(app.myFavorite.items,'reset',this.renderItems);
		this.listenTo(app.myFavorite.items,'add', this.renderItem);
	},
	renderItems:function(items){
		var $itemlist = this.$(".item-favor-list");
		var that = this;
		items.each( function(item){
			that.renderItem(item);
		});
	},
	renderItem:function(item){
		item.chats.fetch({reset:true});
		var itemBox = new app.BuyerItemBoxView({model:item});
		this.$(".item-favor-list").append(itemBox.el);
	}
});