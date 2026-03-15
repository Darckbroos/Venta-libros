from django.contrib import admin
from .models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'price', 'stock', 'is_active', 'is_featured', 'created_at']
    list_filter = ['is_active', 'is_featured', 'created_at']
    search_fields = ['title', 'author', 'short_description']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_active', 'is_featured', 'stock', 'price']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Información Principal', {
            'fields': ('title', 'slug', 'author', 'short_description', 'long_description')
        }),
        ('Precio y Stock', {
            'fields': ('price', 'stock')
        }),
        ('Imágenes', {
            'fields': ('cover_image', 'gallery_images')
        }),
        ('Estado', {
            'fields': ('is_active', 'is_featured')
        }),
        ('SEO', {
            'fields': ('seo_title', 'seo_description')
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
