# 🏗️ Architecture & Code Structure Guide

## Overview

This project follows a **3-tier architecture**:

```
Frontend (Next.js)
       ↕ (HTTP REST API)
Backend (Express)
       ↕ (SQL Queries)
Database (PostgreSQL)
```

Each layer is independent and communicates through clear interfaces.

---

## 📦 Backend Structure

### `src/app.js` - Express Setup
**Purpose:** Configures the Express app
**Key Features:**
- CORS configuration (allows frontend to call API)
- JSON body parsing middleware
- Route registration
- Error handling middleware

### `src/server.js` - Entry Point
**Purpose:** Starts the HTTP server
**What it does:**
1. Loads environment variables
2. Creates the Express app
3. Listens on the configured port

### `src/config/database.js` - Database Connection
**Purpose:** Sets up PostgreSQL connection pool
**Why it matters:**
- **Pool:** Multiple connections for concurrent requests
- **Security:** Uses parameterized queries ($1, $2) to prevent SQL injection
- **Transactions:** `withTransaction()` ensures data consistency

```javascript
// SAFE: Uses parameters
query('SELECT * FROM products WHERE id = $1', [productId])

// DANGEROUS: Don't do this!
query(`SELECT * FROM products WHERE id = ${productId}`)
```

### `src/middleware/errorHandler.js` - Error Handling
**Purpose:** Catches and formats errors for responses
**Behavior:**
- Server errors (5xx) → Always logged
- Request errors (4xx) → Logged only in development
- Returns JSON with error message

**Status Codes:**
- `400` - Bad request (invalid input)
- `404` - Not found (product/user doesn't exist)
- `409` - Conflict (stock changed during order)
- `500` - Internal server error

### `src/models/` - Database Queries
**Pattern:** "Models" are just SQL functions
**Examples:**
- `productModel.findProducts()` - Search products
- `cartModel.upsertCartItem()` - Add/update cart item
- `orderModel.createOrderWithItems()` - Create order (with transaction)

**Best Practices:**
- Always use `$1, $2, ...` for parameters
- Use transactions for multi-step operations
- Use `FOR UPDATE` locks to prevent race conditions

### `src/controllers/` - Business Logic
**Purpose:** Validate input, check permissions, orchestrate operations
**Flow:**
```
Request → Parse/Validate → Call Models → Format Response → Send
```

**Example: Adding to cart**
```javascript
1. Parse userId and productId
2. Validate they're positive integers
3. Check user exists (security)
4. Check product exists
5. Check stock is available
6. Call cartModel.upsertCartItem()
7. Return result as JSON
```

### `src/routes/` - URL Mapping
**Purpose:** Map HTTP requests to controller functions
**Example:**
```javascript
router.post('/cart', cartController.addOrUpdateCart)
//      ↓              ↓
//    Method      Handler Function
```

---

## 🎨 Frontend Structure

### `src/app/` - Pages
**Pattern:** Next.js App Router - each folder is a URL

```
app/
├── page.tsx           → /                  (homepage)
├── cart
│   └── page.tsx       → /cart              (shopping cart)
├── checkout
│   └── page.tsx       → /checkout          (order form)
├── order-confirmation
│   └── page.tsx       → /order-confirmation?orderId=123
└── products
    └── [id]
        └── page.tsx   → /products/42       (product details)
```

**Key Concept:** Pages can be:
- **Server Components** (default) - Fetch data on server, secure
- **Client Components** (`"use client"`) - Interactive, use hooks

### `src/context/CartContext.tsx` - State Management
**Purpose:** Manages cart state globally
**Pattern:** React Context API
**Features:**
- `cart` - Current cart contents
- `loading`, `error` - Request status
- `addProduct()` - Add item
- `setQuantity()` - Update quantity
- `removeLine()` - Delete item

**Why Context instead of Redux?**
- Simpler for small projects
- No extra dependencies
- Good for top-level state (user cart)

```typescript
// Usage in components:
const { cart, addProduct } = useCart();

// Example:
await addProduct(productId, quantity, { merge: true });
```

### `src/components/` - UI Components
**All are client components** (`"use client"`)

| Component | Purpose | Interactive |
|-----------|---------|-------------|
| `Navbar` | Top navigation bar | Yes (search) |
| `ProductCard` | Product preview grid | Yes (Add to Cart) |
| `ProductGallery` | Full image carousel | Yes (next/prev) |
| `CartItem` | Item in shopping cart | Yes (qty select) |
| `AddToCartButton` | Add button | Yes |

**Principle:** Each component has one responsibility:
```tsx
// ✅ Good: One thing
function AddToCartButton({ productId, quantity }) {
  // Just handles adding to cart
}

// ❌ Bad: Too many responsibilities
function ProductCard({ product }) {
  // Renders card, handles add to cart, shows reviews, etc.
}
```

### `src/lib/` - Utilities

**`api.ts`** - API client
```typescript
// Makes typed API calls
const products = await getProducts({ q: "laptop" });
const cart = await getCart(userId);
await postCartItem({ productId, quantity, merge: true });
```

**`constants.ts`** - Configuration
```typescript
const DEFAULT_USER_ID = 1;  // Demo uses user ID 1
```

**`formatCurrency.ts`** - Formatting
```typescript
formatCurrency(19.99)        // Returns "$19.99"
formatPriceParts(19.99)      // Returns { main: "$19", fraction: "99" }
```

**`browseUrl.ts`** - URL building
```typescript
buildListingUrl({ q: "laptop", category: "electronics" })
// Returns: "/?q=laptop&category=electronics"
```

---

## 🔄 Data Flow Examples

### Example 1: Adding Product to Cart

```
User clicks "Add to Cart"
    ↓
AddToCartButton triggers onClick
    ↓
addProduct() from CartContext
    ↓
postCartItem() calls /api/cart POST
    ↓
Backend: cartController.addOrUpdateCart()
    - Validates userId, productId, quantity
    - Checks product exists and has stock
    - Calls cartModel.upsertCartItem()
    ↓
cartModel uses SQL: INSERT ... ON CONFLICT UPDATE
    ↓
Database updates/creates cart row
    ↓
Returns { cartId, productId, quantity }
    ↓
Frontend: CartContext updates state
    ↓
UI updates: cart count, item visible
    ↓
User sees item in cart ✅
```

### Example 2: Placing an Order

```
User fills checkout form → clicks "Place Order"
    ↓
CheckoutPage validates shipping info
    ↓
postOrder() calls POST /orders
    ↓
Backend: orderController.createOrder()
    - Validates userId, shipping address
    - Gets cart items
    - Checks all stock levels
    - Calls orderModel.createOrderWithItems()
    ↓
orderModel uses transaction:
    BEGIN
    INSERT order
    INSERT order_items
    UPDATE products SET stock = stock - qty
    COMMIT
    ↓
Database creates order + items, reduces stock atomically
    ↓
cartModel.clearCartForUser() - Delete cart items
    ↓
Returns { orderId, total, createdAt }
    ↓
Frontend: Router pushes to /order-confirmation?orderId=123
    ↓
User sees thank you page ✅
```

---

## 🔐 Security Patterns

### 1. **Input Validation**
Every controller validates input before using it:
```javascript
// ❌ Never trust user input
const productId = req.body.productId;  // Could be anything!

// ✅ Always validate
const productId = Number(req.body.productId);
if (!Number.isInteger(productId) || productId < 1) {
  throw new Error('Invalid productId');
}
```

### 2. **Parameterized Queries**
Prevents SQL injection:
```javascript
// ✅ Safe: Parameters go in array
query('SELECT * FROM products WHERE id = $1', [id])

// ❌ Vulnerable: String concatenation
query(`SELECT * FROM products WHERE id = ${id}`)
```

### 3. **Transactions**
Ensures data consistency:
```javascript
withTransaction(async (client) => {
  // If any step fails, all changes roll back
  await client.query('INSERT INTO orders ...');
  await client.query('UPDATE products SET stock = stock - ...');
  // Both succeed or both fail - never partial updates
})
```

### 4. **Row-Level Locks**
Prevents race conditions:
```javascript
// Lock the row while checking stock
const result = await client.query(
  'SELECT stock FROM products WHERE id = $1 FOR UPDATE',
  [productId]
);
// No other transaction can modify this row until we commit
```

---

## 📊 Database Design

### Table Relationships

```
users (1) ──→ (many) cart
             Cart items for each user

products (1) ──→ (many) cart
              Each product can be in many carts

users (1) ──→ (many) orders
            Each user can have many orders

products (1) ──→ (many) order_items
              Each product in many orders

orders (1) ──→ (many) order_items
            Each order has many items
```

### Key Constraints

```sql
-- Prevent negative stock
stock INTEGER NOT NULL CHECK (stock >= 0)

-- Prevent zero quantity in cart/orders
quantity INTEGER NOT NULL CHECK (quantity > 0)

-- Ensure positive prices
price NUMERIC(10, 2) NOT NULL CHECK (price >= 0)

-- Unique user-product pair in cart
UNIQUE (user_id, product_id)
```

---

## 🚀 Performance Tips

### 1. **Query Optimization**
- ✅ Use indexes: `CREATE INDEX idx_products_category ON products (category)`
- ❌ Avoid N+1 queries: Don't loop and fetch individual items
- ✅ Use JOINs: Get related data in one query

### 2. **Frontend Optimization**
- ✅ Memoize components: `React.memo(ProductCard)`
- ✅ Code splitting: Next.js does this automatically
- ✅ Image optimization: Use `next/image` with proper sizes
- ❌ Avoid unnecessary re-renders

### 3. **Caching**
- ✅ Browser cache: Images, CSS, JS cached for repeat visits
- ✅ Server cache: Could add Redis for hot queries
- ❌ Don't cache user-specific data (cart, orders)

---

## 🧪 Testing Strategy

### What to Test

```
API Tests (Backend):
├── Products
│   ├── GET /products (search, filter)
│   └── GET /products/:id (single product)
├── Cart
│   ├── GET /cart (view items)
│   ├── POST /cart (add/update)
│   └── DELETE /cart/:id (remove)
└── Orders
    └── POST /orders (create order)

UI Tests (Frontend):
├── Product browsing
├── Cart operations
├── Checkout flow
└── Search / filter
```

### Test Data

Database already seeded with:
- 1 demo user (ID: 1)
- 20 sample products across 7 categories

---

## 📈 Scalability Considerations

For a production app, you might:

1. **Add Authentication** - Don't hardcode userId = 1
2. **Add Authorization** - Check user can only access their cart/orders
3. **Add Backend Validation** - Current validation is good for demo
4. **Add Rate Limiting** - Prevent API abuse
5. **Add Caching** - Redis for product lists
6. **Add CDN** - Serve images from CloudFront / Cloudflare
7. **Add Monitoring** - Sentry for error tracking
8. **Add Analytics** - Understand user behavior

---

## 🔍 Debugging Tips

### Backend Debug
```bash
# Verbose logging
export NODE_ENV=development

# Check database
psql postgresql://postgres:postgres@localhost:5432/amazon_clone
SELECT * FROM products LIMIT 5;

# Monitor API requests
curl http://localhost:3001/health
```

### Frontend Debug
```javascript
// Browser DevTools (F12)
// → Network tab: See API requests
// → Console: See errors & logs
// → Application tab: See cookies, local storage

// React DevTools (browser extension)
// → Inspect components
// → See props, state, hooks
```

---

## 📚 Code Standards

### Naming Conventions
- **Files:** kebab-case (`product-card.tsx`)
- **Variables:** camelCase (`productId`, `userName`)
- **Database:** snake_case (`product_id`, `user_name`)
- **Components:** PascalCase (`ProductCard`, `AddToCartButton`)

### File Organization
```
src/
├── components/   # User interface
├── app/          # Page routes
├── context/      # Global state
├── lib/          # Utilities & helpers
└── types/        # TypeScript types (if needed)
```

### Comments
```javascript
// ✅ Good: Explains WHY, not WHAT
// Prevents race conditions if two carts updated simultaneously
const upd = await client.query(
  'UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3',
  [newQty, cartId, userId]
);

// ❌ Bad: States obvious
// Update the cart quantity
const upd = await client.query(...);
```

---

## 🎓 Learning Resources

### Key Concepts to Understand

1. **REST APIs:** HTTP methods (GET, POST, DELETE, PUT)
2. **React Hooks:** useState, useEffect, useCallback, useContext
3. **SQL:** SELECT, INSERT, UPDATE, DELETE, JOIN, transactions
4. **TypeScript:** Types, interfaces, generics
5. **Async/Await:** Promises and async code

### Useful Docs
- [Express.js Guide](https://expressjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [React Docs](https://react.dev/)
- [Node-PG Docs](https://node-postgres.com/)

---

**This architecture is clean, scalable, and follows industry best practices. Happy coding!** 🚀
