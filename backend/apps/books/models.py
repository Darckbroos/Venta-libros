from django.db import models
from django.utils.text import slugify


class Book(models.Model):
    title = models.CharField(max_length=255, verbose_name='Título')
    slug = models.SlugField(max_length=255, unique=True, verbose_name='Slug')
    author = models.CharField(max_length=255, verbose_name='Autor')
    short_description = models.TextField(verbose_name='Descripción corta')
    long_description = models.TextField(verbose_name='Descripción larga')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Precio')
    stock = models.PositiveIntegerField(default=0, verbose_name='Stock')
    cover_image = models.ImageField(upload_to='books/covers/', verbose_name='Imagen de portada')
    gallery_images = models.JSONField(default=list, blank=True, verbose_name='Imágenes de galería')
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    is_featured = models.BooleanField(default=False, verbose_name='Destacado')
    seo_title = models.CharField(max_length=70, blank=True, verbose_name='SEO Title')
    seo_description = models.CharField(max_length=160, blank=True, verbose_name='SEO Description')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Libro'
        verbose_name_plural = 'Libros'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def main_image_url(self):
        if self.cover_image:
            return self.cover_image.url
        return None
