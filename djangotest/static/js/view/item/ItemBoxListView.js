var app = app || {};

app.ItemBoxListView = Backbone.View.extend({
	events:{
		'scroll': "changeDisplay"
	},
	changeDisplay: function(){
		var that = this;
		if(!this.changeDisplayTimer){this.changeDisplayTimer = null;}
		clearTimeout(this.changeDisplayTimer);
		this.changeDisplayTimer = setTimeout(function(){
			var height = that.$el.height();
			var shownItems = [];
			var hiddenItems = [];
			that.items.each(function(item){
				var itemBox = that.itemBoxs[item.id];
				var position = itemBox.$el.position();
				var top = position.top;
				var bottom = top + itemBox.$el.height();
				if((top>=0 && top<height)||(bottom>=0 && bottom<height)){
					//that.itemBoxs[item.id].$el.css('color','red');
					shownItems.push(item);
				}else{
					//that.itemBoxs[item.id].$el.css('color','black');
					hiddenItems.push(item);
				}
			});
			that.shownItems = shownItems;
			that.hiddenItems = hiddenItems;
			that.items.trigger('display_changed',that.shownItems,that.hiddenItems);
		},100);
	},
	initialize: function(options){
		var that = this;
		this.shownItems = [];
		this.hiddenItems = [];
		var items = this.items = options.items;
		this.display = options.display;
		this.listenTo(items, 'add',this.add);
		this.listenTo(items, 'remove',this.remove);
		this.listenTo(items, 'reset',this.reset);
		this.listenTo(items, 'sort',this.reset);
		this.itemBoxs = {};
		$(window).resize(function(){that.changeDisplay()});
	},
	reset: function(items){
		var that = this;
		this.$el.empty();
		items.each(function(item){
			var itemBox = new app.ItemBoxView({model:item});
			that.itemBoxs[item.id] = itemBox;
			that.$el.append(itemBox.el);
		});
		this.$el.scrollTop(0);
		this.changeDisplay();
	},
	add: function(item){
		console.log('add',item.get('description'));
	},
	remove:function(item){
		console.log('remove',item.get('description'));
	}
});
