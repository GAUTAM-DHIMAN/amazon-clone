# Amazon Clone (Full Stack)

Demo e-commerce app: **Next.js** storefront, **Express** REST API, and **PostgreSQL**. Styling uses **Tailwind CSS** with an Amazon-inspired header and layout.

## Project structure

```
amazon-clone/
├── README.md
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── db/
│   │   ├── schema.sql          # PostgreSQL tables + constraints
│   │   └── seed.sql            # Default user + sample products
│   └── src/
│       ├── server.js           # HTTP entry
│       ├── app.js              # Express app, CORS, routes
│       ├── config/
│       │   └── database.js     # pg Pool
│       ├── db/
│       │   └── setup.js        # npm run db:setup — applies schema + seed
│       ├── middleware/
│       │   └── errorHandler.js
│       ├── models/             # Data access (SQL)
│       ├── controllers/        # Validation + orchestration
│       └── routes/             # Route → controller wiring
└── frontend/
    ├── .env.local.example
    ├── next.config.ts          # Remote images (Unsplash)
    ├── package.json
    ├── src/
    │   ├── app/                # App Router pages
    │   │   ├── layout.tsx
    │   │   ├── page.tsx        # Home + search
    │   │   ├── globals.css
    │   │   ├── cart/page.tsx
    │   │   ├── checkout/page.tsx
    │   │   ├── order-confirmation/page.tsx
    │   │   └── products/[id]/page.tsx
    │   ├── components/         # Navbar, cards, gallery, buy box, buttons
    │   ├── context/
    │   │   └── CartContext.tsx
    │   └── lib/
    │       ├── api.ts          # Fetch helpers for the REST API
    │       └── constants.ts    # DEFAULT_USER_ID = 1
    └── ...
```

## Database layer

- **Schema:** `backend/db/schema.sql` — tables, foreign keys, indexes.
- **Runtime:** [node-pg](https://node-postgres.com/) `Pool` in `backend/src/config/database.js` with parameterized `query()` and `withTransaction()`.
- **Models:** `backend/src/models/*.js` — SQL always uses `$1, $2, …` placeholders.
- **Bootstrap:** `npm run db:setup` applies the schema (+ seed when `products` is empty).

## Prerequisites

- **Node.js** 18+ (20 LTS recommended)
- **PostgreSQL** 14+ with a role/database you can connect to

## Step-by-step setup

### 1. Create the database

```sql
CREATE DATABASE amazon_clone;
```

Adjust credentials in `backend/.env` (see below).

### 2. Backend environment

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env`:

- `DATABASE_URL` — e.g. `postgresql://USER:PASSWORD@localhost:5432/amazon_clone`
- `PORT` — default `3001`
- Optional: `CORS_ORIGIN=http://localhost:3000`

Install and initialize the schema + seed (only seeds products when the `products` table is empty):

```bash
npm install
npm run db:setup
npm run dev
```

If you already had a database from an older clone **without** `shipping_recipient_name` / `shipping_phone` on `orders`, run:

`psql "%DATABASE_URL%" -f db/migrate_orders_contact.sql`  
(or use your SQL client with `backend/db/migrate_orders_contact.sql`).

For **`products.category`** (search/filter on the storefront), run:

`backend/db/migrate_products_category.sql`

API base URL: `http://localhost:3001`  
Health check: `GET http://localhost:3001/health` — returns `{ "ok", "database": "up" | "down" }` and **503** if PostgreSQL cannot be reached.

### 3. Frontend environment

```bash
cd frontend
copy .env.local.example .env.local
```

`NEXT_PUBLIC_API_URL` should match the API (default `http://localhost:3001`).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## REST API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/products` | List products. Query: `q` (search in name/description), `category` (slug: electronics, computers, wearables, storage, furniture, sports-outdoors, home-kitchen) |
| `GET` | `/products/categories` | JSON `{ "categories": [ { "slug", "label", "count" } ] }` for items in stock |
| `GET` | `/products/:id` | Product detail |
| `GET` | `/cart?userId=1` | Cart with lines and subtotal |
| `POST` | `/cart` | Body: `{ "userId": 1, "productId": 1, "quantity": 2, "merge": false }` — **replace** line quantity. With `"merge": true`, **adds** `quantity` to the existing line (capped by stock). Default is replace when `merge` is omitted. |
| `DELETE` | `/cart/:cartItemId?userId=1` | Remove one cart row |
| `POST` | `/orders` | Body: `{ "userId": 1, "shipping": { "fullName", "phone?", "line1", "line2?", "city", "state", "postalCode", "country" } }` — creates order, decrements stock, clears cart |

Errors return JSON: `{ "error", "message", ... }` with appropriate HTTP status codes.

## Database model

- **users** — seeded `demo@example.com` (id `1` used by the UI)
- **products** — catalog (`category` VARCHAR, indexed)
- **cart** — `(user_id, product_id)` unique; updated via `POST /cart` (set or merge) or `DELETE /cart/:id`
- **orders** — shipping fields + total
- **order_items** — snapshot `unit_price` per line

## Frontend features

- **Navbar:** logo, search (filters home catalog), cart badge
- **Home:** responsive product grid; **Add to Cart** + **Details**
- **Product page:** image gallery, description, price/stock, **Add to Cart** / **Buy Now** (adds then goes to checkout)
- **Cart:** change quantity, remove line, subtotal, checkout link
- **Checkout:** shipping form + order summary → **POST /orders**
- **Order confirmation:** shows `orderId` query param

## Security note

This demo uses a fixed `userId` for cart/checkout. In production you would authenticate users and never trust client-supplied IDs without a session or JWT.

## License

Educational / demo use only. Not affiliated with Amazon.
