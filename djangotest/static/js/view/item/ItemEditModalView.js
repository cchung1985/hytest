var app = app || {};

app.ItemEditModalView = Backbone.View.extend({
	el: "#itemEditModal",
	events: {
		"click #itemSubmit": "submit",
		"change #itemName": "checkItemName",
		"change #itemPrice": "checkItemPrice",
		"change #itemDesc": "checkItemDesc",
		"change #itemCategory": "changeItemCategory",
		"keydown #itemPrice": "checkKeyNumber",
	},
	initialize: function() {
		var that = this;
		
		this.nameField = 		new app.FormFieldView({el:this.$('#itemNameField')});
		this.priceField = 		new app.FormFieldView({el:this.$('#itemPriceField')});
		this.descriptionField = new app.FormFieldView({el:this.$('#itemDescField')});
		
		this.name = 			this.$('#itemName');
		this.price = 			this.$('#itemPrice');
		this.description = 		this.$('#itemDesc');
		this.conditionAttr = 	this.$('input:radio[name=conditionAttr]');
		this.sizeAttr = 		this.$('input:radio[name=sizeAttr]');
		this.category = 		this.$('#itemCategory');
		
		//uploadfile
		this.files = {};
		this.itemImages = this.$("#itemImages");
		this.itemImages.find('input:file').fileupload({
			autoUpload: false,
			singleFileUploads:true,
			previewMaxWidth: 100,
			previewMaxHeight: 75,
		}).on('fileuploadadd',function(e, data){
			//console.log('fileuploadadd');
			//console.log(data);
			var index = $(this).attr('name');
			that.files[index] = data;
			//console.log(that.files);
		}).on('fileuploadprocessalways',function(e,data){
			var index = data.index,
				file = data.files[index];
			$(this).parent().find(".preview-image").empty().append(file.preview);
		});
		
	},
	checkItemName: function(){
		var name = this.name.val();
		if(name.length==0){
			this.nameField.showError('名稱不可空白');
		}else{
			this.nameField.clearError();
		}
	},
	checkItemPrice:	function(){
		var price = this.price.val();
		if(price.length==0){
			this.priceField.showError('價錢不可空白');
		}else{
			this.priceField.clearError();
		}
	},
	checkKeyNumber: function(event){
		 // Allow: backspace, delete, tab, escape, and enter
		 //console.log(event.keyCode);
		if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
			 // Allow: Ctrl+A
			(event.keyCode == 65 && event.ctrlKey === true) || 
			 // Allow: home, end, left, right
			(event.keyCode >= 35 && event.keyCode <= 39)) {
				 // let it happen, don't do anything
				 return;
		} else {
			// Ensure that it is a number and stop the keypress
			if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
				event.preventDefault(); 
			}
		}
	},
	checkItemDesc: function(){
		var description = this.description.val();
		if(description.length>100){
			this.descriptionField.showError('敘述文字不可超過100字');
		}else{
			this.descriptionField.clearError();
		}
	},
	changeItemCategory: function(event){
		var $target = $(event.target);
		var categoryID = parseInt($target.val());
		
		if(app.itemCategorys.getByID(categoryID).get('child').length == 0){
			this.category.val(categoryID);
			return;
		}
		
		$target.parent().nextAll().remove();
		this.category.val(null);
		
		var $select = $('<select>').attr('size','5').addClass('form-control');
		_.each(app.itemCategorys.getByParentID(categoryID),function(category){
			$('<option>').attr('value',category.get('id')).html(category.get('name')).appendTo($select);
		});
		$('<div>').addClass("col-sm-4").css('margin','10px 0 0 0').append($select).appendTo(this.category);
	},
	submit: function(){
		var that = this;
		var name = this.name.val();
		var price = 		parseInt(this.price.val());
		var description = 	this.description.val();
		var conditionAttr = this.conditionAttr.filter(':checked').val();
		var sizeAttr = 		this.sizeAttr.filter(':checked').val();
		var attrs = 		[parseInt(conditionAttr),parseInt(sizeAttr)];
		var category = 		this.category.val();

		this.item.set({
			name:name,
			price:price,
			description:description,
			attrs:attrs,
			category:category,
			shops:[app.myShop.get('id')]
		});
		
		this.item.save().done(function(){
			//console.log('商品新增成功');
			that.$el.modal('hide');
			var item_id = that.item.get('id');
			//console.log('item_id:'+item_id);
			var dfs = [];
			for(var i in that.files){
				that.files[i].url = 'upload/items/'+item_id+'/image/'+i;
				//console.log(that.files[i]);
				dfs.push(that.files[i].submit())
			}
			
			//console.log('output dfs');
			//console.log(dfs);
			that.files = {};
			that.$el.modal('hide');
			that.item.set({'name':that.item.get('name')+"(上傳圖片中)"});
			app.myShop.items.add(that.item);
			$.when.apply($, dfs).done(function(){
				app.myShop.items.fetch();
			});
		}).fail(function(){
			//console.log('商品新增失敗');
		});
	},
	clearField: function(){
		this.name.val('');
		this.price.val('');
		this.description.val('');
		this.conditionAttr.parent().removeClass('active');
		this.conditionAttr.filter('[value=1]').prop('checked', true).parent().addClass('active');
		this.sizeAttr.parent().removeClass('active');
		this.sizeAttr.filter('[value=3]').prop('checked', true).parent().addClass('active');
		this.category.empty().val(null);
		
		//產生category選單
		var $select = $('<select>').attr('size','5').addClass('form-control');
		_.each(app.itemCategorys.getByParentID(null),function(category){
			$('<option>').attr('value',category.get('id')).html(category.get('name')).appendTo($select);
		});
		$('<div>').addClass("col-sm-4").css('margin','10px 0 0 0').append($select).appendTo(this.category);
		
		
		this.itemImages.find(".preview-image").empty();
	},
	initField:function(item){
		//初始化(未完成)
		this.clearField();
	},
	open: function(item){
		this.item = item?item:(new app.Item());
		if(this.item.isNew()){
			this.clearField();
			this.$el.modal('show');
		}else{
			this.initField(this.item);
		}
	}
});
