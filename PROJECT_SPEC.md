# PROJECT_SPEC.md

## Project Overview

This is a **full-stack e-commerce landing page** designed to sell physical books online. The system prioritizes **speed**, **SEO**, **simplicity**, **conversion optimization**, **maintainability**, **security**, and **clean architecture**.

The project implements a complete purchase flow without requiring customer accounts, integrated with **Mercado Pago** for payments, and includes a comprehensive **admin panel** for managing books and orders.

---

## Architecture Decisions

### Technology Stack

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Frontend** | Next.js 14 (App Router) | Best for SEO with SSR, built-in i18n support, optimized images, and excellent performance |
| **Backend** | Django 4.2 + DRF | Robust, secure, rapid development, excellent admin panel |
| **Database** | PostgreSQL 16 | Production-grade relational database, excellent JSON support |
| **Container** | Docker + docker-compose | Reproducible development environment, easy deployment |

### Why Next.js over Vite+SSR?

1. **SEO Optimization**: Server-Side Rendering (SSR) ensures search engines can index all content
2. **Built-in i18n**: Native support for internationalization with routing
3. **Image Optimization**: Automatic image optimization with next/image
4. **SEO Metadata**: Easy management of meta tags per page
5. **Single Source of Truth**: API routes can be colocated with pages

---

## Project Structure

```
project-root/
├── backend/                    # Django backend
│   ├── config/                 # Django settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/                  # Django apps
│   │   ├── books/             # Book catalog
│   │   ├── orders             # Order management
│   │   └── payments           # Mercado Pago integration
│   ├── manage.py
│   └── requirements.txt
├── frontend/                   # Next.js frontend
│   ├── app/                   # App router pages
│   │   ├── book/[slug]/       # Book detail page
│   │   ├── checkout/          # Checkout flow
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   ├── i18n/                  # Translation files
│   ├── lib/                   # Utilities and API client
│   └── styles/                # Global styles
├── docker/                    # Docker configuration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
├── docs/                      # Documentation
└── PROJECT_SPEC.md            # This file
```

---

## Database Schema

### Books Table (`books_book`)

| Field | Type | Description |
|-------|------|-------------|
| id | UUID/Integer | Primary key |
| title | VARCHAR(255) | Book title |
| slug | VARCHAR(255) | URL-friendly identifier |
| author | VARCHAR(255) | Author name |
| short_description | TEXT | Brief description for listings |
| long_description | TEXT | Full description |
| price | DECIMAL(10,2) | Price in CLP |
| stock | INTEGER | Available quantity |
| cover_image | IMAGE | Main book cover |
| gallery_images | JSON | Additional images array |
| is_active | BOOLEAN | Visibility flag |
| is_featured | BOOLEAN | Featured on homepage |
| seo_title | VARCHAR(70) | SEO meta title |
| seo_description | VARCHAR(160) | SEO meta description |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

### Orders Table (`orders_order`)

| Field | Type | Description |
|-------|------|-------------|
| order_id | VARCHAR(50) | Unique public order ID |
| status | ENUM | pending/paid/preparing/shipped/delivered/cancelled |
| shipping_address | FK | Reference to ShippingAddress |
| total_amount | DECIMAL(10,2) | Total order amount |
| mercadopago_preference_id | VARCHAR(255) | MP preference ID |
| mercadopago_payment_id | VARCHAR(255) | MP payment ID |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

### Shipping Address Table (`orders_shippingaddress`)

| Field | Type | Description |
|-------|------|-------------|
| full_name | VARCHAR(255) | Customer full name |
| email | EMAIL | Customer email |
| phone | VARCHAR(20) | Contact phone |
| region | VARCHAR(100) | Region/State |
| city | VARCHAR(100) | City/Commune |
| address | VARCHAR(255) | Street address |
| address_details | VARCHAR(255) | Apt, floor, etc. |
| reference_notes | TEXT | Delivery reference |
| order_notes | TEXT | Customer notes |

### Order Items Table (`orders_orderitem`)

| Field | Type | Description |
|-------|------|-------------|
| order | FK | Reference to Order |
| book_title | VARCHAR(255) | Book title at purchase time |
| book_price | DECIMAL(10,2) | Price at purchase time |
| quantity | INTEGER | Quantity purchased |
| subtotal | DECIMAL(10,2) | Line item total |

### Payment Events Table (`payments_paymentevent`)

| Field | Type | Description |
|-------|------|-------------|
| order | FK | Reference to Order |
| event_type | VARCHAR(50) | Type of payment event |
| payment_id | VARCHAR(255) | Mercado Pago payment ID |
| status | VARCHAR(50) | Payment status |
| raw_data | JSON | Raw webhook data |
| processed | BOOLEAN | Whether event was processed |

---

## Backend API Endpoints

### Books API (`/api/books/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books/all/` | List all active books |
| GET | `/api/books/featured/` | List featured books |
| GET | `/api/books/{slug}/` | Get book details |
| POST | `/api/books/` | Create book (admin) |
| PUT | `/api/books/{slug}/` | Update book (admin) |
| DELETE | `/api/books/{slug}/` | Delete book (admin) |

### Orders API (`/api/orders/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/` | Create new order |
| GET | `/api/orders/{order_id}/` | Get order details |
| POST | `/api/orders/{order_id}/update_status/` | Update order status (admin) |
| GET | `/api/orders/status/{order_id}/` | Get order status |

### Payments API (`/api/payments/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-preference/` | Create MP payment preference |
| POST | `/api/payments/webhook/` | Mercado Pago webhook receiver |

---

## Frontend Pages

| Route | Description | SEO |
|-------|-------------|-----|
| `/` | Homepage with featured books | Yes |
| `/book/[slug]` | Book detail page | Yes |
| `/checkout` | Purchase form | No |
| `/checkout/success` | Payment success page | No |
| `/checkout/failure` | Payment failure page | No |
| `/checkout/pending` | Payment pending page | No |

---

## Translation Architecture

### Implementation

The project uses a **custom i18n solution** with JSON translation files:

- **Default Language**: Spanish (es)
- **Secondary Language**: English (en)
- **Storage**: `frontend/i18n/{locale}.json`
- **Context**: React Context API for language switching

### Translation Keys Structure

```json
{
  "common": { "buyNow": "...", "addToCart": "..." },
  "hero": { "title": "...", "subtitle": "..." },
  "book": { "author": "...", "price": "..." },
  "checkout": { "title": "...", "shippingInfo": "..." },
  "success": { "title": "...", "message": "..." },
  "failure": { "title": "...", "message": "..." },
  "footer": { "contact": "...", "about": "..." }
}
```

### Language Switching

- **Method**: Button in header
- **Storage**: localStorage persists preference
- **Routing**: URL-based (future enhancement could add `/es/` and `/en/` prefixes)

---

## Payment Flow

### Complete Purchase Flow

```
1. User browses books on homepage
2. User clicks "Add to Cart" or "Buy Now"
3. User navigates to /checkout
4. User fills shipping information form
5. User submits form
6. Backend creates Order + ShippingAddress
7. Backend creates Mercado Pago preference
8. Frontend redirects to Mercado Pago checkout
9. User completes payment
10. Mercado Pago redirects to success/failure/pending
11. Mercado Pago sends webhook to backend
12. Backend updates order status
```

### Order Statuses

| Status | Description | Next Status |
|--------|-------------|-------------|
| pending | Order created, awaiting payment | paid, cancelled |
| paid | Payment confirmed | preparing |
| preparing | Order being prepared for shipment | shipped |
| shipped | Order dispatched | delivered |
| delivered | Order received by customer | - |
| cancelled | Order cancelled | - |

### Webhook Security

1. Verify webhook signature using HMAC-SHA256
2. Store raw payment data for audit
3. Process payment only if not already processed
4. Return appropriate response to MP

---

## Admin Panel

### Access

- URL: `/admin/`
- Requires Django admin user credentials

### Features

#### Books Management
- Create, edit, delete books
- Upload cover images
- Set featured status
- Manage stock levels
- SEO metadata configuration

#### Orders Management
- View all orders
- Filter by status
- View buyer information
- Update order status
- View payment details

#### Reports (Future Enhancement)
- Sales reports
- Inventory reports

---

## Security Baseline

### Implemented Security Measures

1. **Environment Variables**: All secrets in `.env` files
2. **No Secrets in Frontend**: API keys not exposed to client
3. **Django Security Settings**:
   - ALLOWED_HOSTS
   - CSRF protection
   - X-Frame-Options
   - Secure cookies in production
4. **CORS Configuration**: Restricted to frontend origin
5. **Input Validation**: DRF serializers validate all inputs
6. **Webhook Verification**: HMAC signature validation
7. **SQL Injection Prevention**: ORM with parameterized queries

### Production Checklist

- [ ] Set DEBUG=False
- [ ] Use strong SECRET_KEY
- [ ] Configure ALLOWED_HOSTS
- [ ] Enable HTTPS
- [ ] Configure secure cookies
- [ ] Set up webhook signature verification

---

## Docker Architecture

### Services

| Service | Image | Ports | Purpose |
|---------|-------|-------|---------|
| postgres | postgres:16-alpine | 5432 | Database |
| backend | Custom | 8000 | Django API |
| frontend | Custom | 3000 | Next.js app |

### Volumes

| Volume | Purpose |
|--------|---------|
| postgres_data | Database persistence |
| media_volume | User-uploaded images |

### Development Workflow

```bash
# Start all services
cd docker
docker-compose up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Environment Variables

### Backend (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| SECRET_KEY | Yes | Django secret key |
| DEBUG | No | Debug mode (default: True) |
| ALLOWED_HOSTS | Yes | Comma-separated hosts |
| POSTGRES_DB | Yes | Database name |
| POSTGRES_USER | Yes | Database user |
| POSTGRES_PASSWORD | Yes | Database password |
| POSTGRES_HOST | Yes | Database host |
| POSTGRES_PORT | Yes | Database port |
| MERCADOPAGO_ACCESS_TOKEN | Yes | MP API access token |
| MERCADOPAGO_PUBLIC_KEY | Yes | MP public key |
| MERCADOPAGO_WEBHOOK_SECRET | Yes | Webhook signature secret |
| FRONTEND_URL | Yes | Frontend URL |
| BACKEND_URL | Yes | Backend URL |

### Frontend (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| NEXT_PUBLIC_API_URL | Yes | Backend API URL |

---

## SEO Strategy

### Implemented SEO Features

1. **Semantic HTML**: Proper heading hierarchy, article tags, etc.
2. **Meta Tags**: Title, description, keywords per page
3. **Open Graph**: Social media sharing metadata
4. **Next.js Metadata API**: Dynamic metadata generation
5. **Clean URLs**: `/book/[slug]` pattern
6. **Image Alt Text**: Descriptive alt attributes
7. **Fast Loading**: SSR + image optimization

### SEO for Book Pages

Each book page includes:
- Unique `<title>` tag
- Unique meta description
- Open Graph tags
- Structured data (Book schema - future enhancement)

---

## Development Phases

### Phase 1: Architecture
- [x] Project structure definition
- [x] Technology stack selection
- [x] Database schema design

### Phase 2: Backend
- [x] Django project setup
- [x] Models implementation
- [x] API endpoints
- [x] Admin panel
- [x] Mercado Pago integration

### Phase 3: Frontend
- [x] Next.js setup
- [x] Components creation
- [x] Pages implementation
- [x] i18n system

### Phase 4: Integration
- [x] API connections
- [x] Payment flow
- [x] Order management

### Phase 5: Docker
- [x] Dockerfiles
- [x] docker-compose.yml
- [x] Environment configuration

### Phase 6: Documentation
- [x] PROJECT_SPEC.md
- [ ] Additional docs

---

## Future Enhancements

1. **Enhanced SEO**: Add sitemap.xml, robots.txt, structured data
2. **User Accounts**: Optional account creation for order history
3. **Reviews/Testimonials**: Customer reviews system
4. **Newsletter**: Email subscription
5. **Analytics**: Google Analytics, Facebook Pixel
6. **Multi-currency**: Support for USD and other currencies
7. **Coupons/Discounts**: Discount code system
8. **Inventory Alerts**: Low stock notifications

---

## Important Notes for Future Developers

1. **Mercado Pago Credentials**: Obtain from https://www.mercadopago.cldevelopers
2. **Admin Access**: Create superuser with `python manage.py createsuperuser`
3. **Media Files**: Configure cloud storage (AWS S3, Cloudinary) for production
4. **HTTPS**: Required for payment processing
5. **Webhook URL**: Must be publicly accessible for payment notifications
6. **Email**: Configure email backend for order confirmations (optional)

---

*Last Updated: March 2026*
