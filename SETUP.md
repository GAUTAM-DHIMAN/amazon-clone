# 🚀 Quick Start Guide

This guide will help you set up and run the Amazon Clone project.

## Prerequisites

- **Node.js** 18+ (download from [nodejs.org](https://nodejs.org/))
- **PostgreSQL** 14+ (download from [postgresql.org](https://www.postgresql.org/))
- A Windows/Mac/Linux terminal or PowerShell

## ✅ Step 1: Create PostgreSQL Database

Open your PostgreSQL client (psql, pgAdmin, or DBeaver) and run:

```sql
CREATE DATABASE amazon_clone;
```

**Note:** Remember your PostgreSQL username and password (default is usually `postgres`/`postgres`).

## ✅ Step 2: Set Up Backend

### A. Install dependencies

```bash
cd backend
npm install
```

### B. Configure database connection

Open `backend/.env` and update the `DATABASE_URL`:

```dotenv
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/amazon_clone
```

**Example:** If your username is `postgres` and password is `mypassword`:

```dotenv
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/amazon_clone
```

### C. Create database tables and seed with sample data

```bash
npm run db:setup
```

You should see: `Database schema ready...`

### D. Start the backend server

```bash
npm run dev
```

You should see: `API listening on http://localhost:3001`

**Keep this terminal open!** The backend must run while you use the app.

## ✅ Step 3: Set Up Frontend

### A. Open a new terminal and navigate to frontend

```bash
cd frontend
npm install
```

### B. The `.env.local` file is already configured

If needed, open `frontend/.env.local` and verify:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001
```

This tells the frontend where to find the backend API.

### C. Start the frontend development server

```bash
npm run dev
```

You should see output including:
```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
```

## ✅ Step 4: Test the Application

Open your browser and go to: **http://localhost:3000**

You should see the Amazon Clone storefront!

### Test the Full Flow:

1. **Browse Products** - Homepage shows all products
2. **Search** - Use the search bar to find products
3. **View Product** - Click a product to see details
4. **Add to Cart** - Add items to your cart
5. **View Cart** - Click the cart icon to see items
6. **Checkout** - Fill in shipping info and place an order
7. **Confirmation** - See your order ID

## 🐛 Troubleshooting

### Backend won't start or connects to wrong database

**Problem:** `Error: connect ECONNREFUSED`

**Solution:**
1. Make sure PostgreSQL is running
2. Check your `DATABASE_URL` in `backend/.env`
3. Test your connection: `psql postgresql://postgres:password@localhost:5432/amazon_clone`

### Frontend can't reach backend

**Problem:** `Request failed (503)` or errors in cart operations

**Solution:**
1. Make sure backend is running (`npm run dev` in backend folder)
2. Check `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:3001`
3. Verify backend is listening on port 3001

### Products don't appear

**Problem:** Homepage is blank

**Solution:**
1. Run `npm run db:setup` again in the backend folder
2. Check that the database was created: `psql -l` (lists all databases)

### Port already in use

**Problem:** `Error: listen EADDRINUSE :::3001` or similar

**Solution:**
- Backend: Change `PORT` in `backend/.env` to a different port (e.g., `3002`)
- Frontend: Add `--port 3001` to the dev command, or change `NEXT_PUBLIC_API_URL`

## 📝 Configuration Files Explained

### `backend/.env`
Controls backend behavior:
- `DATABASE_URL` - How to connect to PostgreSQL
- `PORT` - Which port the API runs on
- `CORS_ORIGIN` - Which frontend URL can access the API

### `frontend/.env.local`
Controls frontend behavior:
- `NEXT_PUBLIC_API_URL` - Where to find the backend API

## 🎯 Common Tasks

### Stop the application

Press `Ctrl+C` in both terminals (backend and frontend)

### Reset the database

```bash
# In backend folder
dropdb amazon_clone
CREATE DATABASE amazon_clone;  # Run in PostgreSQL
npm run db:setup
```

### View the API directly

Open `http://localhost:3001/health` in your browser. You should see:
```json
{"ok":true,"database":"up"}
```

## 📚 Project Structure

```
amazon-clone/
├── backend/              # Express API
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── controllers/ # Request handling
│   │   ├── models/      # Database queries
│   │   └── app.js       # Express setup
│   └── db/              # SQL files
└── frontend/            # Next.js UI
    ├── src/
    │   ├── app/         # Pages (Home, Cart, Checkout, etc.)
    │   ├── components/  # Reusable UI components
    │   ├── context/     # Cart state management
    │   └── lib/         # Utilities & API helpers
```

## 🚀 What's Next?

- **Explore the code** - Read comments in key files
- **Understand the flow** - See how shopping works front-to-back
- **Add features** - Try adding user authentication, wishlists, or more!

Happy cloning! 🎉
