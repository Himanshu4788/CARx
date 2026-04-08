# 🚗 CarX – Toy Car Marketplace

A full-stack MERN ecommerce app for buying and selling toy cars.

---

## 🛠️ Tech Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Frontend   | React.js + Tailwind CSS + Redux Toolkit |
| Backend    | Node.js + Express.js          |
| Database   | MongoDB (Mongoose)            |
| Payments   | Razorpay                      |
| Images     | Firebase Storage              |
| Auth       | JWT + bcrypt                  |

---

## 📁 Project Structure

```
carx/
├── backend/
│   ├── config/         # DB + Firebase config
│   ├── controllers/    # Auth, Product, Cart, Order, Payment, Wishlist
│   ├── middleware/     # Auth, Error, Multer
│   ├── models/         # User, Product, Order, Cart, Wishlist
│   ├── routes/         # All API routes
│   ├── app.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/ # Navbar, Footer, ProductCard, FilterSidebar
        ├── pages/      # Home, Products, Cart, Checkout, Dashboard...
        └── redux/      # Store + all slices
```

---

## ⚡ Quick Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example config/config.env
# Fill in config/config.env with your keys
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔑 Environment Variables (backend/config/config.env)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/carx

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com

FRONTEND_URL=http://localhost:3000
```

---

## 🔑 Getting Free API Keys

### Razorpay (Test Mode – Free)
1. Sign up at https://razorpay.com
2. Dashboard → Settings → API Keys → Generate Test Key
3. Copy `Key ID` and `Key Secret`

### Firebase Storage
1. Go to https://console.firebase.google.com
2. Create project → Storage → Enable
3. Project Settings → Service Accounts → Generate new private key
4. Copy projectId, privateKey, clientEmail, storageBucket

### MongoDB
- Local: `mongodb://localhost:27017/carx`
- Cloud: https://cloud.mongodb.com (free 512MB)

---

## 🚀 Features

- ✅ JWT Authentication (Buyer / Seller roles)
- ✅ Product CRUD with Firebase image upload
- ✅ Advanced filtering (category, price, rating, sort)
- ✅ Shopping cart (persistent in DB)
- ✅ Wishlist
- ✅ Razorpay payment integration
- ✅ Reviews & star ratings
- ✅ Seller dashboard with analytics
- ✅ Order management
- ✅ Responsive dark UI

---

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/v1/auth/register | Register user |
| POST | /api/v1/auth/login | Login |
| GET | /api/v1/products | Get all products (with filters) |
| POST | /api/v1/products | Create product (seller) |
| GET | /api/v1/cart | Get cart |
| POST | /api/v1/cart | Add to cart |
| POST | /api/v1/payment/order | Create Razorpay order |
| POST | /api/v1/payment/verify | Verify payment |
| POST | /api/v1/orders | Create order |
| GET | /api/v1/orders/my | My orders |
| GET | /api/v1/wishlist | Get wishlist |
| POST | /api/v1/wishlist/:id | Toggle wishlist |
