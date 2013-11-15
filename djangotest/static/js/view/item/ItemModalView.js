var app = app || {};

app.ItemModalView = Backbone.View.extend({
	id: "itemModal",
	className: "modal fade",
	events:{
		"shown.bs.modal": "shown",
		//"show.bs.modal": "show",
		"click #item-modal-board button": "like",
		"click .modal-header button":"remove",
		"click #item-modal-gotoshop":"openShopModal",
		"click #item-modal-gotoabout":"openAboutModal",
	},

	initialize: function(){
		this.item = this.model;
		//this.item.fetch();
		this.shop = new app.Shop();
		this.shop.set('id',this.item.get('shops')[0]);
		
		this.listenTo(this.shop, 'sync', this.setMap);
		this.shop.fetch();
		

		this.$el.attr("tabindex","-1");
		
		var $modalStructure = this.renderStructure();
		$modalStructure.find(".modal-body").append(this.renderBody());
		this.$el.append($modalStructure);

		//declare jquery objects
		this.name 			= this.$('#item-modal-name');
		this.star 			= this.$('#item-modal-board span');
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
	
		//set star type
		if(this.item.get('favorite')==true){
			this.$('#item-modal-board span')
				.removeClass('glyphicon-star-empty')
				.addClass('glyphicon-star')
				.css('color','yellow');
		}else{
			this.$('#item-modal-board span')
				.removeClass('glyphicon-star')
				.addClass('glyphicon-star-empty')
				.css('color','gray');
		}

		//set images
		var photoPath = this.item.get('images');
		console.log(photoPath.length);
		if (photoPath.length==0){
			var path = "img/no_image.gif";
			this.photos.append(
				'<span style="">\
					<img src="'+path+'" width="100%">\
				</span>')
		}else{
			var that = this;
			_.each(photoPath,function(path){
				var rid = that.item.get('rid');
				//var path = rid+'-'+path+'.jpg';
				//console.log(path);
				that.photos.append(
				'<span style="">\
					<img src="'+path+'" width="100%">\
				</span>')
			});
		}
		
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
	},

	renderStructure: function(){
		var $modalStructure = $(
			'<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
						<h4 class="modal-title">ITEM</h4>\
					</div>\
					<div class="modal-body" style="min-height:300px; padding:0px">\
					</div>\
					<div class="modal-footer" style="text-align:center">\
						<div class="row">\
							<div class="col-xs-6">\
								<button id="item-modal-gotoshop" type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true" style="margin:auto">瀏覽商店</button>\
							</div>\
							<div class="col-xs-6">\
								<button id="item-modal-gotoabout" type="button" class="btn btn-primary" style="margin:auto">關於本店</button>\
							</div>\
						</div>\
					</div>\
				</div><!-- /.modal-content -->\
			</div><!-- /.modal-dialog -->')
		
		return $modalStructure;
	},
	
	renderBody: function(){
		var $modalBody = $(
			'<div id="item-modal-board" style="position:relative; border-bottom:1px solid; padding:10px;">\
				<h4 id="item-modal-name" style="margin-right:50px"></h4>\
				<button type="submit" class="btn btn-default" style="position:absolute; right:0px; top:0px; margin:10px">\
					<span class="glyphicon glyphicon-star-empty" style="font-size:1.5em;"></span>\
				</button>\
			</div>\
			<div id="item-modal-photos" class="item-modal-container" style="white-space:nowrap; padding:5px; border:1px solid; overflow:auto">\
			</div>\
			<div class="row">\
				<div class="col-xs-12 col-sm-6">\
					<div class="item-modal-container" style="text-align: center; margin:10px">\
						<div id="item-modal-price"></div>\
						<div id="item-modal-add-time"></div>\
					</div>\
				</div>\
				<div class="col-xs-12 col-sm-6">\
					<div class="item-modal-container" style="margin:10px">\
						<div class="row" style="text-align:center">\
							<div id="item-modal-size-attr"class="col-xs-4">尺寸<br><span></span></div>\
							<div id="item-modal-condition-attr" class="col-xs-4">新舊<br><span></span></div>\
							<div id="item-modal-price-attr" class="col-xs-4">談價空間<br><span></span></div>\
						</div>\
					</div>\
				</div>\
			</div>\
			<div class="item-modal-container" style="margin:40px; text-align:center">\
				<h4>商品描述</h4>\
				<p id="item-modal-description" style="text-align:left"></p>\
			</div>\
			<div class="item-modal-container" style="margin:40px; text-align:center; height:250px;">\
				<h4>位置</h4>\
				<div id="item-modal-map" style="width:100%; height:250px">\
					<!--Googole Map-->\
				</div>\
			</div>\
			<div class="item-modal-container" style="margin:10px; text-align:center">\
				<h4>想要買?有問題?</h4>\
				<button class="btn btn-primary" type="button">聯絡賣家</button>\
			</div>')
		
		return $modalBody;
	},
	
	setMap: function(){
		//set google map
		var latlng = new google.maps.LatLng(this.shop.get('latitude'),
											this.shop.get('longitude'));
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
		var contentStr = this.shop.get('address');
		this.infowindow = new google.maps.InfoWindow({
			content: contentStr,
		});
		this.infowindow.open(this.map,this.marker);
		this.marker.setMap(this.map);
	},
	
	like: function(){
		var that = this;
		
		$.post( 'items/'+that.item.get('id')+'/like/')
		.done(function(item){
			if(that.item.get('favorite')==true){
				that.item.set('favorite', false);
				that.$('#item-modal-board span')
					.removeClass('glyphicon-star')
					.addClass('glyphicon-star-empty')
					.css('color','gray');
			}else{
				that.item.set('favorite', true);
				that.$('#item-modal-board span')
					.removeClass('glyphicon-star-empty')
					.addClass('glyphicon-star')
					.css('color','yellow');
				app.myFavorite.items.add(item);
			}
		}).fail(function(){
			alert('連線錯誤 請稍後再試');
		});
	},

	open: function(){
		this.$el.modal('show');
	},
	
	openShopModal: function(){
		var that = this;
		var shop = new app.Shop();
		shop.set('id',this.shop.get('id'));
		shop.fetch().pipe(function(){
			return shop.items.fetch({reset:true});
		}).done(function(){
			var shopModal = new app.ShopModalView({model:shop});
			that.remove();
			$(".modal-backdrop").remove();
			shopModal.open();
		}).fail(function(){
			alert('網路傳輸錯誤 請稍後再試');
		});
	},

	openAboutModal: function(){
		alert("功能未完成");
	},
	
	
	shown: function(){
		//console.log('google map resize');
		google.maps.event.trigger(this.map, "resize");
		this.map.setCenter(this.marker.getPosition());
		this.infowindow.open(this.map, this.marker);
	}
});
