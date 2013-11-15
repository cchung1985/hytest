var app = app || {};

app.Shop = Backbone.Model.extend({
	urlRoot: 'shops/',
	initialize: function(){
		var that = this;
		this.items = new app.Items();
		this.items.shop = this;
		this.items.url = function(){
			return 'shops/'+that.id+'/items/';
		}
		//this.on('change:id',this.resetItems)
	},
	resetItems: function(){
		this.items.fetch({reset:true});
	}
});

app.Shops = Backbone.Collection.extend({
	model: app.Shop,
	url:'shops/',
	initialize:function(options){
		var that = this;
		this.url = function(){ 
			if (that.bounds){
				return 'shops/?'+$.param(that.bounds);
			}else if (that.string){
				return 'shops/?'+$.param(that.string);
			}
			return 'shops/';
		}
	},
	fetchByBounds:function(bounds){
		this.setBounds(bounds);
		return this.fetch();
	},
	setSearch:function(string){
		this.string = {string:string};
		return this;
	},
	setBounds:function(bounds){
		this.bounds = bounds
		return this;
	}
})
