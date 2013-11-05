var app = app || {};

app.ItemFavorListView = Backbone.View.extend({
	el:"#itemFavorList",
	initialize:function(){
		//this.items = this.collection;
		//this.$el.html('ItemList');
		
		this.listenTo(app.myFavorite.items,'reset',this.renderItems);
	},
	renderItems:function(items){
		var $itemlist = this.$(".item-favor-list");
		var that = this;
		items.each( function(item){
			that.renderItem(item);
		});
	},
	renderItem:function(item){
		var itemBox = new app.ItemBoxView({model:item});
		this.$(".item-favor-list").append(itemBox.el);
	}
});