var app = app || {};

app.myRouter = Backbone.Router.extend({
	routes: {
		":test": "testfunc",
	},
	testfunc: function(p1) {
		alert('testfunc: '+p1);
		console.log('testfunc: '+p1);
	}
});