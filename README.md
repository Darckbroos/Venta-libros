# Librería Online - E-commerce de Libros

Plataforma de comercio electrónico para vender libros físicos online, construida con Django (backend) y Next.js (frontend).

## Stack Tecnológico

### Backend
- **Django 4.2** - Framework web Python
- **Django REST Framework** - API REST
- **PostgreSQL 16** - Base de datos
- **Mercado Pago** - Procesamiento de pagos

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **CSS Modules** - Estilos

### Infraestructura
- **Docker** - Contenedores
- **docker-compose** - Orquestación

## Características

- Catálogo de libros con búsqueda
- Compra sin registro de usuario
- Información de envío
- Pago con Mercado Pago
- Panel de administración Django
- Soporte multiidioma (Español/Inglés)
- Optimizado para SEO

## Requisitos Previos

- Docker Desktop
- Docker Compose
- Git

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd venta-libro
```

### 2. Configurar variables de entorno

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

Edita los archivos `.env` con tus credenciales:

#### backend/.env
```
DEBUG=True
SECRET_KEY=tu-secret-key-aqui
ALLOWED_HOSTS=localhost,127.0.0.1

POSTGRES_DB=bookshop
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

MERCADOPAGO_ACCESS_TOKEN=tu_access_token
MERCADOPAGO_PUBLIC_KEY=tu_public_key
MERCADOPAGO_WEBHOOK_SECRET=tu_webhook_secret

FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
```

#### frontend/.env
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Iniciar con Docker

```bash
cd docker
docker-compose up --build
```

Esto iniciara:
- Frontend en http://localhost:3000
- Backend en http://localhost:8000
- PostgreSQL en localhost:5432

### 4. Crear usuario administrador

```bash
docker-compose exec backend python manage.py createsuperuser
```

Accede al panel de admin en http://localhost:8000/admin/

## Configuración de Mercado Pago

### 1. Crear cuenta en Mercado Pago

1. Ve a https://www.mercadopago.com/
2. Crea una cuenta de desarrollador
3. Accede a "Mis Apps"

### 2. Obtener credenciales

1. Crea una nueva aplicación
2. Copia el **Access Token** (producción o prueba)
3. Copia el **Public Key**
4. Configura las URLs de webhook

### 3. Configurar Webhook

En el panel de Mercado Pago:
- URL de notificación: `https://tu-dominio.com/api/payments/webhook/`
- Eventos: `payment`

## Uso del Sistema

### Agregar Libros

1. Accede a `/admin/`
2. Inicia sesión con tus credenciales
3. Ve a "Libros" > "Libros"
4. Crea un nuevo libro con:
   - Título y descripción
   - Precio y stock
   - Imagen de portada
   - Configuración SEO

### Flujo de Compra

1. Cliente visita la página principal
2. Navega por el catálogo
3. Agrega libros al carrito
4. Completa el formulario de envío
5. Es redirigido a Mercado Pago
6. Completa el pago
7. Recibe confirmación

## Estructura del Proyecto

```
├── backend/
│   ├── config/           # Configuración Django
│   ├── apps/
│   │   ├── books/        # Catálogo de libros
│   │   ├── orders/       # Gestión de pedidos
│   │   └── payments/     # Mercado Pago
│   └── requirements.txt
├── frontend/
│   ├── app/              # Páginas Next.js
│   ├── components/       # Componentes React
│   ├── i18n/             # Traducciones
│   └── lib/              # Utilidades
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
├── PROJECT_SPEC.md
└── README.md
```

## Comandos Útiles

```bash
# Iniciar servicios
docker-compose up

# Ver logs
docker-compose logs -f backend

# Detener servicios
docker-compose down

# Recrear contenedores
docker-compose up --build

# Acceso al shell de Django
docker-compose exec backend sh

# Migraciones
docker-compose exec backend python manage.py migrate

# Recolectar archivos estáticos
docker-compose exec backend python manage.py collectstatic
```

## Desarrollo Local (Sin Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Producción

### Consideraciones de Seguridad

1. Cambia `DEBUG=False`
2. Usa una SECRET_KEY segura
3. Configura ALLOWED_HOSTS
4. Habilita HTTPS
5. Configura cookies seguras
6. Usa credenciales de producción de MP

### Despliegue Recomendado

- **Frontend**: Vercel, Netlify, o Docker
- **Backend**: Railway, Render, o VPS con Docker
- **Database**: Railway, Supabase, o PostgreSQL gestionado
- **Archivos**: AWS S3, Cloudinary

## Licencia

MIT License
