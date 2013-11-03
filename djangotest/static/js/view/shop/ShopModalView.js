var app = app || {};

app.ShopModalView = Backbone.View.extend({
	id: "shopModal",
	className: "modal fade",
	events:{
		"click .item-modal-board button": "like",
		"click .modal-header button":"remove",
		"click #shopModalItemList":"remove"
	},
	initialize: function() {
		this.$el.attr("tabindex","-1");
		
		this.shop = this.model;
		
		//render shop modal
		var $modalStructure = this.renderStructure();
		$modalStructure.find(".modal-body").append(this.renderBody());
		this.$el.append($modalStructure);
		//this.renderItems();
		
		//set shop title
		var shopName = this.shop.get('name');
		this.$("#shopModalBoard h4").text(shopName);
		
		//set star type
		if(this.shop.get('favorite')==true){
			this.$('.shop-modal-board span')
				.removeClass('glyphicon-star-empty')
				.addClass('glyphicon-star');
		}else{
			this.$('.shop-modal-board span')
				.removeClass('glyphicon-star')
				.addClass('glyphicon-star-empty');
		}

		//listenTo items reset
		this.listenTo(this.shop.items, 'reset', this.renderItems);
		this.listenTo(this.shop.items, 'add', this.renderItem);
		
		this.renderItems()
	},
	
	renderStructure: function(){
		var $modalStructure = $(
		'<div class="modal-dialog">\
			<div class="modal-content">\
				<div class="modal-header">\
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
					<h4 class="modal-title">SHOP</h4>\
				</div>\
				<div class="modal-body" style="min-height:300px; padding:0px">\
				</div>\
				<div class="modal-footer" style="text-align:center">\
					<button type="button" class="btn btn-primary" style="margin:auto">關於本店</button>\
				</div>\
			</div><!-- /.modal-content -->\
		</div><!-- /.modal-dialog -->')
		
		return $modalStructure;
	},
	
	renderBody: function(){
		var $modalBody = $(
			'<div id="shopModalBoard" class="shop-modal-board" style="position:relative; padding:10px;">\
				<h4 id="shopModalName" style="margin-right:50px"></h4>\
				<button type="submit" style="position:absolute; right:0px; top:0px; margin:10px">\
					<span class="glyphicon glyphicon-star-empty" style="font-size:2em;"></span>\
				</button>\
			</div>\
			<div id="shopModalShowcase" class="shop-modal-showcase">\
				<div class="showcase-toolbar" style="padding:5px 10px; border-bottom:1px solid">\
					<div class="showcase-toolbar-sort">\
						排序依\
						<select>\
							<option value="上架日期">上架日期</option>\
							<option value="價格">價格</option>\
						</select>\
					</div>\
				</div>\
				<div id="shopModalItemList" class="showcase-item-list" data-dismiss="modal" aria-hidden="true" style="">\
				</div>\
			</div>');
			
		return $modalBody;
	},
	
	renderItems: function(){
		var $shopModalItemList = this.$("#shopModalItemList");
		this.shop.items.each(function(item){
			var itemBox = new app.ItemBoxView({model:item});
			$shopModalItemList.append(itemBox.el);
		});
	},
	
	renderItem: function(item){
		var itemBox = new app.ItemBoxView({model:item});
		this.$("#shopModalItemList").append(itemBox.el);
	},
	
	like: function(){
		var that = this;
		
		$.get( 'shop/'+that.shop.get('id')+'/like/')
		.done(function(){
			if(that.shop.get('favorite')==true){
				that.shop.set('favorite', false);
				that.$('.shop-modal-board span')
					.removeClass('glyphicon-star')
					.addClass('glyphicon-star-empty');
			}else{
				that.shop.set('favorite', true);
				that.$('.shop-modal-board span')
					.removeClass('glyphicon-star-empty')
					.addClass('glyphicon-star');
			}
		}).fail(function(){
			alert('連線錯誤 請稍後再試');
		});
	},
	
	open: function(item){
		this.$el.modal('show');
	}
});
