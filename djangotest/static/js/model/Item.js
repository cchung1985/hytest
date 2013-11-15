var app = app || {};

app.Item = Backbone.Model.extend({
	urlRoot:'items/',
	initialize: function(){
		var that = this;
		this.chats = new app.Chats();
		this.chats.url = function(){
			return 'items/'+that.id+'/chat/';
		}
	}
});

app.Items = Backbone.Collection.extend({
	model: app.Item,
	initialize:function(options){
		var that = this;
		this.url = function(){ 
			if (that.bounds){
				return 'items/?'+$.param(that.bounds);
			}else if (that.string){
				return 'items/?'+$.param(that.string);
			}
			return 'items/';
		}
	},
	setSearch:function(string){
		this.string = {string:string};
		return this;
	}
});


