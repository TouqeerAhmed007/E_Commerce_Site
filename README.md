# Intern-Shop — E-Commerce Platform

A full-stack e-commerce web application built with Node.js, Express, and MongoDB. ShopHive supports product browsing, cart management, order tracking, user authentication, and an admin panel for managing products and categories.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Admin Panel](#admin-panel)

---

## Features

**Customer Facing**
- Browse products with search and category filtering
- Add products to cart and manage quantities
- Place and track orders via My Orders
- User registration and login with session-based auth
- Logout functionality

**Admin Panel**
- Add, edit, and delete products
- Manage product categories
- View and manage all customer orders
- Role-based access control (admin vs regular user)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (via Mongoose) |
| Templating | HTML + Vanilla JS (public/js) |
| Auth | Session-based authentication |
| Styling | CSS (public/css) |

---

## Project Structure

```
e-commerce/
├── config/                  # Database and app configuration
├── controllers/             # Route handler logic
│   ├── adminController.js   # Admin panel operations
│   ├── authController.js    # Login, register, logout
│   ├── cartController.js    # Cart CRUD operations
│   ├── categoryController.js# Category management
│   ├── orderController.js   # Order placement and tracking
│   └── productController.js # Product listing and details
├── middleware/
│   ├── authMiddleware.js    # Protect routes (logged-in check)
│   ├── errorHandler.js      # Global error handling
│   └── roleMiddleware.js    # Admin-only route protection
├── models/
│   ├── Cart.js
│   ├── Category.js
│   ├── Order.js
│   ├── Product.js
│   └── User.js
├── public/
│   ├── css/                 # Stylesheets
│   └── js/                  # Client-side JS
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── categoryRoutes.js
│   ├── orderRoutes.js
│   └── productRoutes.js
├── utils/                   # Helper utilities
├── .env                     # Environment variables (not committed)
├── createAdmin.js           # Script to seed an admin user
├── seed.js                  # Database seed script
├── server.js                # App entry point
└── package.json
```

---

## Setup & Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)
- npm (comes with Node.js)

### Steps

**1. Clone the repository**

```bash
git clone https://github.com/TouqeerAhmed007/E_Commerce_Site.git
cd e-commerce
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the root directory. See the [Environment Variables](#environment-variables) section below for the required fields.

**4. Seed the database (optional)**

To populate the database with sample products and categories:

```bash
node seed.js
```

**5. Create an admin user**

```bash
node createAdmin.js
```

**6. Start the server**

```bash
node server.js
```

The app will be running at `http://localhost:5000`

---

## Environment Variables

Create a `.env` file in the project root with the following:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shophive
SESSION_SECRET=your_secret_key_here
```

| Variable | Description |
|---|---|
| `PORT` | Port the server runs on (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `SESSION_SECRET` | Secret key for session signing |

## Admin Panel

To access the admin panel, log in with the admin credentials created via `createAdmin.js`. The admin panel provides:

- Full product management (add, edit, delete)
- Category management
- Order status updates
- User overview

---

## License

This project was developed as an internship/academic project. All rights reserved.
