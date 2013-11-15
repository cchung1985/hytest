var app = app || {};

app.ShopBoxListView = Backbone.View.extend({
	events:{
		'scroll': "changeDisplay"
	},
	changeDisplay: function(){
		var that = this;
		if(!this.changeDisplayTimer){this.changeDisplayTimer = null;}
		clearTimeout(this.changeDisplayTimer);
		this.changeDisplayTimer = setTimeout(function(){
			var height = that.$el.height();
			var shownShops = [];
			var hiddenShops = [];
			that.shops.each(function(shop){
				var shopBox = that.shopBoxs[shop.id];
				var position = shopBox.$el.position();
				var top = position.top;
				var bottom = top + shopBox.$el.height();
				if((top>=0 && top<height)||(bottom>=0 && bottom<height)){
					//that.shopBoxs[shop.id].$el.css('color','red');
					shownShops.push(shop);
				}else{
					//that.shopBoxs[shop.id].$el.css('color','black');
					hiddenShops.push(shop);
				}
			});
			that.shownShops = shownShops;
			that.hiddenShops = hiddenShops;
			that.shops.trigger('display_changed',that.shownShops,that.hiddenShops);
		},100);
	},
	initialize: function(options){
		var that = this;
		this.shownShops = [];
		this.hiddenShops = [];
		var shops = this.shops = options.shops;
		this.display = options.display;
		this.listenTo(shops, 'add',this.add);
		this.listenTo(shops, 'remove',this.remove);
		this.listenTo(shops, 'reset',this.reset);
		this.listenTo(shops, 'sort',this.reset);
		this.shopBoxs = {};
		$(window).resize(function(){that.changeDisplay()});
	},
	reset: function(shops){
		var that = this;
		this.$el.empty();
		shops.each(function(shop){
			var shopBox = new app.ShopBoxView({model:shop});
			that.shopBoxs[shop.id] = shopBox;
			that.$el.append(shopBox.el);
		});
		this.$el.scrollTop(0);
		this.changeDisplay();
	},
	add: function(shop){
		console.log('add',shop.get('description'));
	},
	remove:function(shop){
		console.log('remove',shop.get('description'));
	}
});
