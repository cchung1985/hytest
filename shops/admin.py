from django.contrib import admin
from shops.models import Item,ItemImage,Category,Attribute,Shop

admin.site.register(Item)
admin.site.register(ItemImage)
admin.site.register(Category)
admin.site.register(Attribute)
admin.site.register(Shop)
