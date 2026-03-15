from rest_framework import serializers
from .models import Book


class BookSerializer(serializers.ModelSerializer):
    main_image_url = serializers.CharField(read_only=True)

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'slug', 'author', 'short_description', 'long_description',
            'price', 'stock', 'cover_image', 'main_image_url', 'gallery_images',
            'is_active', 'is_featured', 'seo_title', 'seo_description'
        ]


class BookListSerializer(serializers.ModelSerializer):
    main_image_url = serializers.CharField(read_only=True)

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'slug', 'author', 'short_description', 'price',
            'stock', 'main_image_url', 'is_active', 'is_featured'
        ]
