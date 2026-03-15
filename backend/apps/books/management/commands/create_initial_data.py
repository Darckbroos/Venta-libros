from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.books.models import Book

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates initial data: admin user and sample books'

    def handle(self, *args, **options):
        # Create superuser
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@libreria.com',
                password='admin123'
            )
            self.stdout.write(self.style.SUCCESS('Admin user created: admin / admin123'))
        else:
            self.stdout.write('Admin user already exists')

        # Create psychology books
        books_data = [
            {
                'title': 'El Poder del Ahora',
                'slug': 'poder-del-ahora',
                'author': 'Eckhart Tolle',
                'short_description': 'Una guía espiritual para liberatedte del sufrimiento y encontrar la paz interior.',
                'long_description': 'El Poder del Ahora es un libro transformador que te enseña a vivir en el momento presente. Eckhart Tolle ofrece herramientas prácticas para superar la ansiedad, el estrés y el sufrimiento emocional. A través de conceptos simples pero profundos, aprenderás a conectar con tu verdadero ser y a experimentar la alegría de existir.',
                'price': '18900',
                'stock': 25,
                'is_active': True,
                'is_featured': True,
                'seo_title': 'El Poder del Ahora - Eckhart Tolle | Librería de Psicología',
                'seo_description': 'Compra El Poder del Ahora. El best-seller que ha ayudado a millones a encontrar la paz interior.',
            },
            {
                'title': 'Pensar Rápido, Pensar Despacio',
                'slug': 'pensar-rapido-pensar-despacio',
                'author': 'Daniel Kahneman',
                'short_description': 'Una exploración fascinante de cómo funciona nuestra mente y cómo tomamos decisiones.',
                'long_description': 'En esta obra revolucionaria, el premio Nobel Daniel Kahneman nos revela los dos sistemas que gobiernan nuestro pensamiento: el Sistema 1, rápido e intuitivo, y el Sistema 2, lento y reflexivo. Este libro transformará la forma en que entiendes tu propia mente y cómo tomas decisiones.',
                'price': '24500',
                'stock': 20,
                'is_active': True,
                'is_featured': True,
                'seo_title': 'Pensar Rápido, Pensar Despacio - Daniel Kahneman',
                'seo_description': 'Descubre cómo funciona tu mente. Best-seller mundial de psicología y comportamiento.',
            },
            {
                'title': 'Los 7 Hábitos de la Gente Altamente Efectiva',
                'slug': '7-habitos-gente-altamente-efectiva',
                'author': 'Stephen R. Covey',
                'short_description': 'Un enfoque integral para resolver problemas personales y profesionales.',
                'long_description': 'Este clásico de la desarrollo personal ofrece un enfoque holístico para ser más efectivo en todas las áreas de tu vida. Stephen Covey presenta siete hábitos poderosos que te ayudarte a desarrollar tu carácter, aumentar tu productividad y lograr tus metas.',
                'price': '21900',
                'stock': 30,
                'is_active': True,
                'is_featured': False,
                'seo_title': 'Los 7 Hábitos de la Gente Altamente Efectiva - Stephen Covey',
                'seo_description': 'El libro definitivo de desarrollo personal y efectividad. Transforma tu vida.',
            },
            {
                'title': 'Inteligencia Emocional',
                'slug': 'inteligencia-emocional',
                'author': 'Daniel Goleman',
                'short_description': 'Por qué es más importante que el coeficiente intelectual para el éxito.',
                'long_description': 'Daniel Goleman revolucionó nuestra comprensión de la inteligencia con este libro fundamental. Aprende a identificar, usar y gestionar tus emociones de manera positiva para aliviar estrés, comunicar efectivamente y empatizar con otros.',
                'price': '17900',
                'stock': 35,
                'is_active': True,
                'is_featured': False,
                'seo_title': 'Inteligencia Emocional - Daniel Goleman',
                'seo_description': 'Descubre el poder de las emociones. Best-seller que cambió la psicología moderna.',
            },
            {
                'title': 'El Arte de la Buena Vida',
                'slug': 'arte-buena-vida',
                'author': 'Robert S. Kaplan',
                'short_description': '52 breves lecciones para una existencia más consciente y significativa.',
                'long_description': 'El exdirector de Harvard Business School ofrece 52 herramientas de la filosofía estoica para enfrentar los desafíos cotidianos. Un libro práctico que combina psicología, filosofía y sabiduría ancestral para ayudarte a vivir mejor.',
                'price': '16500',
                'stock': 18,
                'is_active': True,
                'is_featured': False,
                'seo_title': 'El Arte de la Buena Vida - Robert S. Kaplan',
                'seo_description': '52 lecciones de filosofía estoica para una vida más plena y significativa.',
            },
            {
                'title': 'Atomic Habits',
                'slug': 'atomic-habits',
                'author': 'James Clear',
                'short_description': 'Método tiny para cambiar hábitos y transformar tu vida.',
                'long_description': 'James Clear revela un sistema probado para crear buenos hábitos y eliminar los malos. Conbase en la ciencia del comportamiento, este libro te mostrará cómo pequeños cambios pueden generar resultados extraordinarios en tu vida personal y profesional.',
                'price': '19900',
                'stock': 28,
                'is_active': True,
                'is_featured': True,
                'seo_title': 'Atomic Habits - James Clear | Desarrollo Personal',
                'seo_description': 'Transforma tus hábitos, transforma tu vida. El método definitivo.',
            },
            {
                'title': 'Clean Code',
                'slug': 'clean-code',
                'author': 'Robert C. Martin',
                'short_description': 'A Handbook of Agile Software Craftsmanship.',
                'long_description': 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn\'t have to be that way.',
                'price': '35000',
                'stock': 15,
                'is_active': True,
                'is_featured': True,
                'seo_title': 'Clean Code - Robert C. Martin',
                'seo_description': 'A must-read for any software developer.',
            }
        ]

        for book_data in books_data:
            if not Book.objects.filter(slug=book_data['slug']).exists():
                Book.objects.create(**book_data)
                self.stdout.write(self.style.SUCCESS(f'Book created: {book_data["title"]}'))
            else:
                self.stdout.write(f'Book already exists: {book_data["title"]}')

        self.stdout.write(self.style.SUCCESS('Initial data setup complete!'))
