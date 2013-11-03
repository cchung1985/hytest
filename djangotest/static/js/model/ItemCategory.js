var app = app || {};

app.ItemCategory = Backbone.Model.extend({
});

app.ItemCategorys = Backbone.Collection.extend({
	model: app.ItemCategory,
	url:'item-categorys',
	getByID: function(id){
		return this.find(function(category){
			return (category.get('id') == id);
		});
	},
	getByIDs: function(ids){
		return this.filter(function(category){
			return $.inArray(category.get('id'), ids) > -1;
		});
	},
	getByParentID: function(id){
		return this.filter(function(category){
			return (category.get('parent') == id);
		});
	}
});
