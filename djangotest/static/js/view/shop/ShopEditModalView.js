var app = app || {};

app.ShopEditModalView = Backbone.View.extend({
	el: "#shopEditModal",
	events: {
		"shown.bs.modal": "shown",
		"show.bs.modal": "show",
		"keyup #shopAddress": "getLatLng",
		"click #shopSubmitBtn": "submit"
	},
	initialize: function(){
		var $shopName = this.$shopName = this.$("#shopName");
		var $shopAddress = this.$shopAddress = this.$("#shopAddress");
		var $shopDesc = this.$shopDesc = this.$("#shopDesc");
		
		var geocoder = this.geocoder = new google.maps.Geocoder();
	
		var latlng = new google.maps.LatLng(23.973875,120.982024);
		var mapOptions = {
			zoom: 14,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		this.map = new google.maps.Map(this.$('#shopMap')[0],mapOptions);
		
		var marker = this.marker = new google.maps.Marker({
			draggable:true,
			position: latlng,
			title:"台灣",
			map:this.map
		});
		
		google.maps.event.addListener(this.marker, 'mouseup', function() {
			var latlng = marker.getPosition(); 
			geocoder.geocode(
				{latLng:latlng},
				function (results,status) {
					if(status==google.maps.GeocoderStatus.OK) {
						$shopAddress.val(results[0].formatted_address);
					}
				}
			);
		});
	},
	submit:function(){
		var that = this;
		var name = this.$shopName.val();
		var address = this.$shopAddress.val();
		var description = this.$shopDesc.val();
		var latlng = this.marker.getPosition();
		var latitude = latlng.lat();
		var longitude = latlng.lng();
		app.myShop.set({
			name:name,
			address:address,
			description:description,
			latitude:latitude,
			longitude:longitude
		});
		app.myShop.save().done(function(){
			alert('修改成功');
			that.$el.modal('hide');
		}).fail(function(){
			app.myShop.fetch();
			alert('資料錯誤');
		});
	},
	getLatLng:function(){
		var address = this.$shopAddress.val();
		if(this.address && (this.address == address)){
			return;
		}
		this.address = address;
		
		var that = this;
		if(this.timer){
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(function(){
			that.geocoder.geocode(
				{address:address},
				function (results,status) {
					if(status==google.maps.GeocoderStatus.OK) {
						var LatLng = results[0].geometry.location;
						that.map.setCenter(LatLng);
						that.marker.setPosition(LatLng);
						that.marker.setTitle(address);
					}
				}
			);
			that.timer = null;
		},1000);
	},
	show:function(){
		var that = this;
		if(app.myShop.isNew()){
			var latlng = new google.maps.LatLng(23.973875,120.982024);
			this.marker.setPosition(latlng);
		}else{
			app.myShop.fetch().done(function(){
				that.$shopName.val(app.myShop.get('name'));
				that.$shopAddress.val(app.myShop.get('address'));
				that.$shopDesc.val(app.myShop.get('description'));
				var latlng = new google.maps.LatLng(app.myShop.get('latitude'),app.myShop.get('longitude'));
				that.marker.setPosition(latlng);
			});
		}
	},
	shown:function(){
		google.maps.event.trigger(this.map, "resize");
		var latlng = this.marker.getPosition();
		this.map.setCenter(latlng);
	}
});
