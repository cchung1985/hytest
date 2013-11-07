var app = app || {};

app.MapPanelView = Backbone.View.extend({
	el: "#mapPanel",
	events:{
		'shown': "shown",
		//'scroll #mapBoxList':"scrollBoxList"
	},
	initialize:function(){
		var that = this;
		var center = new google.maps.LatLng(25.056220142845, 121.54178450802);
		var mapOptions = {
			center: center,
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		var map = this.map = new google.maps.Map(this.$('#mainMap')[0], mapOptions);
		var noPoi = [{
			featureType: "poi",
			stylers: [{ visibility: "off" }]
		}];
		this.map.setOptions({styles: noPoi});
		
		var ring = new RINGOverlay(center,0,0,map);
		
		var centerMarker = new google.maps.Marker({
			map:map,
			draggable:true,
			position: map.getCenter()
		});
		centerMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
		
		google.maps.event.addListener(centerMarker, 'position_changed', function(){
			if(!this.markerTimer){this.markerTimer=null;}
			clearTimeout(this.markerTimer);
			this.markerTimexr = setTimeout(function(){
				ring.setCenter(centerMarker.getPosition());
				shopsCache.sort();
			},200);
		});
		
		var shopsCache = new app.Shops();
		shopsCache.comparator = function(shop1,shop2){
			var center = centerMarker.getPosition();
			var latlng1 = new google.maps.LatLng(shop1.get('latitude'), shop1.get('longitude'));
			var latlng2 = new google.maps.LatLng(shop2.get('latitude'), shop2.get('longitude'));
			var d1 = google.maps.geometry.spherical.computeDistanceBetween(center,latlng1)
			var d2 = google.maps.geometry.spherical.computeDistanceBetween(center,latlng2)
			if(d1>d2){return 1;}
			else if(d1=d2){return 0;}
			else{return -1}
		}
		
		var shopMarkers = {};
		var displayShopMarkers = {};
		
		var shopBoxList = new app.ShopBoxListView({
			shops:shopsCache,
			el:'#mapBoxList',
			display:function(shops){
				_.each(displayShopMarkers,function(marker){
					marker.setMap(null);
					delete marker;
				});
				_.each(shops,function(shop){
					var latlng = new google.maps.LatLng(shop.get('latitude'),shop.get('longitude'));
					var marker = new google.maps.Marker({
						position:latlng,
						map:map,
						title:shop.get('name')
					});
					displayShopMarkers[shop.id] = marker;
					displayShopMarkers[shop.id].setAnimation(google.maps.Animation.BOUNCE);
				});
			}
		});
		
		this.listenTo(shopsCache,'display_changed',function(shownShops,hiddenShops){
			//console.log('showshoplist',shop);
			var center = centerMarker.getPosition();
			var maxR = 0;
			var minR = 10000;
			_.each(shownShops,function(shop){
				var latlng = new google.maps.LatLng(shop.get('latitude'), shop.get('longitude'));
				var R = google.maps.geometry.spherical.computeDistanceBetween(center,latlng);
				if(R>maxR){maxR = R;}
				if(R<minR || R==0){minR = R;}
				shopMarkers[shop.id].setAnimation(google.maps.Animation.BOUNCE);
			});
			ring.setRadial(maxR,minR);
			
			_.each(hiddenShops,function(shop){
				shopMarkers[shop.id].setAnimation(null);
			});
		});
		
		this.listenTo(shopsCache,'reset',function(){
			_.each(shopMarkers,function(marker){
				marker.setMap(null);
				delete marker;
			});
			shopsCache.each(function(shop){
				var latlng = new google.maps.LatLng(shop.get('latitude'),shop.get('longitude'));
				shopMarkers[shop.id] = new google.maps.Marker({
					position:latlng,
					map:map,
					icon: {
						path: google.maps.SymbolPath.CIRCLE,
						strokeColor:'#428bca',
						strokeWeight:2,
						fillColor:'#ffffff',
						fillOpacity:1,
						scale: 4
					},
					title:shop.get('name')
				});
				//console.log(shopMarkers[shop.id].getShape());
			});
		});
		
		google.maps.event.addListener(map, 'bounds_changed', function() {
			if(!this.timer){this.timer=null;}
			clearTimeout(this.timer);
			this.timer = setTimeout(function(){
				var bounds = map.getBounds();
				//console.log(bounds.getNorthEast(),bounds.getSouthWest());
				var n_lat = bounds.getNorthEast().lat();
				var e_lng = bounds.getNorthEast().lng();
				var s_lat = bounds.getSouthWest().lat();
				var w_lng = bounds.getSouthWest().lng();
				var bounds = {n_lat:n_lat,s_lat:s_lat,e_lng:e_lng,w_lng:w_lng};
				shopsCache.setBounds(bounds).fetch({reset:true});
				//shopsCache.fetchByBounds(bounds);
				/*.done(function(){
					var center = map.getCenter();
					var c_lat = center.lat();
					var c_lng = center.lng();
					shopsCache.each(function(shop){
						var d = Math.pow(c_lat-shop.get('latitude'),2)+Math.pow(c_lng-shop.get('longitude'),2)
						console.log(shop.get('name'),d)
					});
				});*/
				//console.log(shopsCache);
			},500);
		});
	},
	shown:function(){
		google.maps.event.trigger(this.map, "resize");
	}
});
