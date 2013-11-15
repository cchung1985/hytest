var app = app || {};

app.AppView = Backbone.View.extend({
	el: 'body',
	events: {
	},
	initialize: function(){
		this.navBar = new app.NavBarView();
		this.loginModal = new app.LoginModalView();
		this.regModal = new app.RegModalView();
		this.settingModal = new app.SettingView();
		this.infoEmailModal = new app.InfoEmailView();
		this.sellerPanel = new app.SellerPanelView();
		this.mapPanel = new app.MapPanelView();
		this.userPanel = new app.UserPanelView();
		this.buyerPanel = new app.BuyerPanelView();
		
		app.itemCategorys.fetch();
		this.fetchData();
		
		this.listenTo(app.loginUser, 'login', this.fetchData);
		

	},
	fetchData:function(){
		//e = {events:[{},{}],time:time};
		var e = {events:[]};
		app.loginUser.fetch().pipe(function(){
			var dfd = $.Deferred();
			if(app.loginUser.isNew()){
				dfd.reject();
			}else if(app.loginUser.get('shops').length == 0){
				app.loginUser.trigger('getNav');
				dfd.reject();
			}else{
			
				hEvent(e);
				app.loginUser.trigger('getNav');
				dfd.resolve();
			}
			return dfd;
		}).pipe(function(){
			var shopID = app.loginUser.get('shops')[0];
			app.myShop.set('id',shopID);
			return app.myShop.fetch();
		}).pipe(function(){
			return app.myShop.items.fetch({reset:true});
		}).pipe(function(){
			return app.myFavorite.shops.fetch({reset:true});
		}).pipe(function(){
			return app.myFavorite.items.fetch({reset:true});
		}).done(function(){
			console.log('done');
		}).fail(function(){
			console.log('初始階段資料讀取錯誤');
		});
	}
});
