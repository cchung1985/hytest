var app = app || {};

app.MapPanelView = Backbone.View.extend({
	el: "#mapPanel",
	events:{
		'shown': "shown",
		'click .map-search-type-option': "selectSearchType",
		'click #mapSearchBtn': "search"
		//'scroll #mapBoxList':"scrollBoxList"
	},
	search:function(){
		var searchString = this.$('#mapSearchText').val();
		this.items.setSearch(searchString).fetch({reset:true});
	},
	selectSearchType:function(e){
		var $option = $(e.target);
		var option = $option.attr('data-option');
		var optionText = $option.text();
		var $type = this.$('.map-search-type');
		$type.text(optionText).val(option);
	},
	initialize:function(){
		var that = this;
		var center = new google.maps.LatLng(25.056220142845, 121.54178450802);
		var mapOptions = {
			center: center,
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl:false,
			streetViewControl:false,
			panControl:false,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.DEFAULT,
				position: google.maps.ControlPosition.LEFT_CENTER
			},
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
			},500);
		});
		
		var shopsCache = this.items = new app.Items();
		shopsCache.comparator = function(shop1,shop2){
			var center = centerMarker.getPosition();
			var latlng1 = new google.maps.LatLng(shop1.get('latitude'), shop1.get('longitude'));
			var latlng2 = new google.maps.LatLng(shop2.get('latitude'), shop2.get('longitude'));
			var d1 = google.maps.geometry.spherical.computeDistanceBetween(center,latlng1)
			var d2 = google.maps.geometry.spherical.computeDistanceBetween(center,latlng2)
			if(d1 > d2) return 1;
			if(d1 < d2) return -1;
			return 0;
		}
		
		var shopMarkers = {};
		var displayShopMarkers = {};
		
		var shopBoxList = new app.ItemBoxListView({
			items:shopsCache,
			el:'#mapBoxList'/*,
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
			}*/
		});
		
		/*
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
				shopMarkers[shop.id].show();
				//shopMarkers[shop.id].setAnimation(google.maps.Animation.BOUNCE);
			});
			ring.setRadial(maxR,minR);
			
			_.each(hiddenShops,function(shop){
				shopMarkers[shop.id].hide();
				//shopMarkers[shop.id].setAnimation(null);
			});
		});
		*/
		
		this.listenTo(shopsCache,'reset',function(){
			_.each(shopMarkers,function(marker){
				marker.setMap(null);
				delete marker;
			});
			shopsCache.each(function(item){
			
				var latlng = new google.maps.LatLng(item.get('latitude'),item.get('longitude'));
				var shopBox = new app.ItemBoxView({model:item});
				//console.log(shopMarkers[shop.id])
				shopMarkers[item.id] = new ShopMapMarker({
					position:latlng,
					map:map,
					shop:item
				});
				/*
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
				*/
				//console.log(shopMarkers[shop.id].getShape());
			});
		});

		/*
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
			},500);
		});
		*/
	},
	shown:function(){
		google.maps.event.trigger(this.map, "resize");
	}
});


//ShopMapMarker
ShopMapMarker.prototype = new google.maps.OverlayView();
function ShopMapMarker(options) {
	this.position = options.position;
	this.div_ = null;
	this.shop = options.shop;
	this.setMap(options.map);
}

ShopMapMarker.prototype.onAdd = function() {
	var div = document.createElement('div');
	div.style.borderStyle = 'solid';
	div.style.borderWidth = '2px';
	div.style.borderColor = 'rgb(66, 139, 202)';
	div.style.position = 'absolute';
	div.style.color = 'rgb(66, 139, 202)';
	div.style.backgroundColor = '#ffffff';
	this.div_ = div;
	var $div = $(div);
	$div.empty().append(this.shop.get('name'));
	var panes = this.getPanes();
	panes.overlayLayer.appendChild(div);
};

ShopMapMarker.prototype.draw = function() {
	var overlayProjection = this.getProjection();
	var position = this.position;
	var p = overlayProjection.fromLatLngToDivPixel(position);
	var div = this.div_;
	div.style.left = p.x + 'px';
	div.style.top = p.y + 'px';
	//div.style.width = '100px';
	//div.style.height = '10px';
};

ShopMapMarker.prototype.onRemove = function() {
	this.div_.parentNode.removeChild(this.div_);
	this.div_ = null;
};

ShopMapMarker.prototype.hide = function() {
  if (this.div_) {this.div_.style.visibility = "hidden";}
}

ShopMapMarker.prototype.show = function() {
  if (this.div_) {this.div_.style.visibility = "visible";}
}

//RINGOverlay
RINGOverlay.prototype = new google.maps.OverlayView();
function RINGOverlay(center,outerRadial,innerRadial, map) {
	this.center_ = center;
	this.outerRadial_ = outerRadial;
	this.innerRadial_ = innerRadial;
	this.div_ = null;
	this.setMap(map);
}

RINGOverlay.prototype.setCenter = function(center){
	this.center_ = center;
	this.draw();
}

RINGOverlay.prototype.setRadial = function(outerRadial,innerRadial){
	this.outerRadial_ = outerRadial;
	this.innerRadial_ = innerRadial;
	this.draw();
}

RINGOverlay.prototype.onAdd = function() {
	var div = document.createElement('div');
	div.style.borderStyle = 'solid';
	//div.style.borderWidth = '10px';
	div.style.borderColor = 'rgba(66, 139, 202, 0.5)';
	div.style.position = 'absolute';
	this.div_ = div;
	$(div).css('border-radius','100% 100% 100% 100%').css('transition','width 0.5s,height 0.5s,left 0.5s,top 0.5s,border 0.5s');
	var panes = this.getPanes();
	panes.overlayLayer.appendChild(div);
};

RINGOverlay.prototype.draw = function() {
	var overlayProjection = this.getProjection();
	var center = this.center_;
	var outerRadial = this.outerRadial_;
	var innerRadial = this.innerRadial_;
	var computeOffset = google.maps.geometry.spherical.computeOffset;
	
	var ni_latlng = computeOffset(center,innerRadial,0);
	var no_latlng = computeOffset(center,outerRadial,0);
	var ni = overlayProjection.fromLatLngToDivPixel(ni_latlng);
	var no = overlayProjection.fromLatLngToDivPixel(no_latlng);
	var r = Math.abs(no.y-ni.y);
	
	var sw_latlng = computeOffset(center,outerRadial*1.41421,225);
	var ne_latlng = computeOffset(center,outerRadial*1.41421,45);
	var sw = overlayProjection.fromLatLngToDivPixel(sw_latlng);
	var ne = overlayProjection.fromLatLngToDivPixel(ne_latlng);
	var div = this.div_;
	//console.log(ni,no,outerRadial,innerRadial)
	div.style.borderWidth = r +'px';
	div.style.left = sw.x + 'px';
	div.style.top = ne.y + 'px';
	div.style.width = (ne.x - sw.x) + 'px';
	div.style.height = (sw.y - ne.y) + 'px';
};

RINGOverlay.prototype.onRemove = function() {
	this.div_.parentNode.removeChild(this.div_);
	this.div_ = null;
};