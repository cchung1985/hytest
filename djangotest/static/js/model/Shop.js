var app = app || {};

app.Shop = Backbone.Model.extend({
	urlRoot: 'shops/',
	initialize: function(){
		var that = this;
		this.items = new app.Items();
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
			}
			return 'shops/';
		}
	},
	fetchByBounds:function(bounds){
		/*var that = this;
		var dfd = $.get('shops/',bounds);
		dfd.done(function(shops){
			that.set(shops);
		});
		return dfd;*/
		this.setBounds(bounds);
		return this.fetch();
	},
	setBounds:function(bounds){
		this.bounds = bounds
		return this;
	}
})
