var app = app || {};

/*
app.Favorite model holds all the items and shops that
a user likes or has any interaction with their owner.
*/

//The id in Favorite model is user's id
app.Favorite = Backbone.Model.extend({
	initialize: function(){
		var that = this;
		this.items = new app.Items();
		this.items.url = function(){
			return 'items/'+that.id+'/like/';
		}
		
		this.shops = new app.Shops();
		this.shops.url = function(){
			return 'shops/'+that.id+'/like/';
		}
	}
});