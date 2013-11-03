var app = app || {};

app.ItemModalView = Backbone.View.extend({
	el: "#itemModal",
	events:{
		"shown.bs.modal": "shown",
		//"show.bs.modal": "show",
	},
	initialize: function(){
		this.item 			= this.model;
		

		//declare jquery objects
		this.name 			= this.$('#item-modal-name');
		this.photos 		= this.$('#item-modal-photos');
		this.price 			= this.$('#item-modal-price');
		this.addtime 		= this.$('#item-modal-add-time');
		this.sizeAttr 		= this.$('#item-modal-size-attr span');
		this.conditionAttr 	= this.$('#item-modal-condition-attr span');
		this.priceAttr 		= this.$('#item-modal-price-attr span');
		this.description 	= this.$('#item-modal-description');
		this.map 			= this.$('#item-modal-map');
		
		//input item name
		this.name.text(this.item.get('name'));
		
		//input item price
		this.price.text(this.item.get('price'));
		
		//input item pubtime
		var now = new Date();
		var d = new Date(this.item.get('pub_date'));
		var Y = d.getYear()+1900;
		var M = d.getMonth()+1;
		var D = d.getDate();
		var date = Y+'/'+M+'/'+D;
		this.addtime.text(date);
		
		//input item attritubes
		var attrs = this.item.get('attrs');
		var that = this;
		this.sizeAttr.text('------');
		this.conditionAttr.text('------');
		this.priceAttr.text('------');
		_.each(attrs, function(attr){
			if(attr<3){
				if(attr==1){
					that.conditionAttr.text('全新'); 
				}else if(attr==2){
					that.conditionAttr.text('二手品');
				}
			}else if(attr>=3&&attr<7){
				if(attr==3){
					that.sizeAttr.text('口袋小物');
				}else if(attr==4){
					that.sizeAttr.text('背包可裝');
				}else if(attr==5){
					that.sizeAttr.text('機車可載');
				}else if(attr==6){
					that.sizeAttr.text('須開車');
				}
			}else if(attr>6){
				if(attr==7){
					that.priceAttr.text('不二價');
				}else if(attr==8){
					that.priceAttr.text('可議價');
				}
			}
		});
		
		//input item description
		var description = this.item.get('description');
		if(description==''){
			this.description.text('沒有描述');
		}else{
			this.description.text(description);
		}

		//set google map
		var latlng = new google.maps.LatLng(this.item.collection.shop.get('latitude'),
											this.item.collection.shop.get('longitude'));
		var mapProp = {
			center:latlng,
			zoom:14,
			mapTypeId:google.maps.MapTypeId.ROADMAP
		};
		this.map=new google.maps.Map(this.map[0],mapProp);
		
		//set shop marker
		this.marker = new google.maps.Marker({
			position:latlng,
		});
		
		//set infoWindow
		var contentStr = '<p style="white-space:nowrap">\
							'+this.item.collection.shop.get('address')+'\
						</p>';
		var infowindow = new google.maps.InfoWindow({
			content: contentStr,
		});
		infowindow.open(this.map,this.marker);
		this.marker.setMap(this.map);
	},
	open: function(){
		this.$el.modal('show');
	},
	shown: function(){
		console.log('google map resize');
		google.maps.event.trigger(this.map, "resize");
		this.map.setCenter(this.marker.getPosition());
	}
});
