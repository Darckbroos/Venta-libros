from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer, BookListSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.filter(is_active=True)
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return BookListSerializer
        return BookSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_books = Book.objects.filter(is_active=True, is_featured=True)
        serializer = BookListSerializer(featured_books, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def all(self, request):
        books = Book.objects.filter(is_active=True)
        serializer = BookListSerializer(books, many=True)
        return Response(serializer.data)
