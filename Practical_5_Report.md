**NAME:** Jalpan Vyas  
**SUBJECT:** FSD  
**KUID:** 202307020048  

---

# Practical: 5

**Aim:**  
Build backend technologies for an e-commerce application:
- Create REST APIs for `/products`, `/users`, `/cart`, `/orders`.
- Implement data validation and middleware for requests.
- Add server-side error handling.

---

# Theory

## 1. What is a REST API?

**REST (Representational State Transfer)** is an architectural style for designing networked applications. A REST API uses HTTP methods to perform CRUD operations:

| HTTP Method | Operation | Example |
|-------------|-----------|---------|
| GET | Read | Get all products |
| POST | Create | Add new product |
| PUT/PATCH | Update | Update product details |
| DELETE | Delete | Remove product |

**Key Principles:**
- **Stateless**: Each request is independent
- **Resource-based**: URLs represent resources (e.g., `/api/products`)
- **JSON format**: Data exchange in JSON

---

## 2. Express.js Framework

**Express.js** is a minimal Node.js web framework for building web applications and APIs.

**Key Features:**
- Routing system for handling HTTP requests
- Middleware support for request processing
- Easy integration with databases and templating engines

```javascript
const express = require('express');
const app = express();
app.get('/api/products', (req, res) => {
    res.json({ products: [...] });
});
```

---

## 3. Middleware

**Middleware** functions execute during the request-response cycle. They can:
- Execute code
- Modify request/response objects
- End the request-response cycle
- Call the next middleware

**Types of Middleware Used:**
1. **Morgan**: HTTP request logger
2. **CORS**: Cross-Origin Resource Sharing
3. **express.json()**: Parse JSON request bodies
4. **Custom Validator**: Validate input using Joi

---

## 4. Data Validation with Joi

**Joi** is a schema validation library. It ensures incoming data meets required formats before processing.

```javascript
const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const { error } = schema.validate(req.body);
if (error) return res.status(400).json({ error: error.message });
```

---

## 5. Error Handling

**Centralized error handling** ensures consistent error responses across all endpoints.

```javascript
const errorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message
    });
};
```

---

# Program

## Backend Code

### 1. server.js (Main Entry Point)
```javascript
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### 2. routes/products.js
```javascript
const express = require('express');
const router = express.Router();

let products = [
    { id: 1, name: 'VOLT Original', price: 149, image: 'volt_original_can.png', category: 'Classic' },
    { id: 2, name: 'VOLT Zero', price: 159, image: 'volt_zero_can.png', category: 'Sugar-Free' },
    { id: 3, name: 'VOLT Tropical', price: 169, image: 'volt_tropical_can.png', category: 'Flavored' }
];

// GET all products
router.get('/', (req, res) => {
    res.json({ success: true, data: products });
});

// GET single product
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: product });
});

// POST new product
router.post('/', (req, res) => {
    const newProduct = { id: products.length + 1, ...req.body };
    products.push(newProduct);
    res.status(201).json({ success: true, data: newProduct });
});

module.exports = router;
```

### 3. routes/users.js
```javascript
const express = require('express');
const router = express.Router();

let users = [];

// POST register
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const newUser = { id: users.length + 1, name, email, password };
    users.push(newUser);
    res.status(201).json({ success: true, message: 'User registered' });
});

// POST login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ success: true, token: 'demo-token-' + user.id });
});

module.exports = router;
```

### 4. routes/cart.js
```javascript
const express = require('express');
const router = express.Router();

let carts = { 1: [] };

// GET cart
router.get('/', (req, res) => {
    res.json({ success: true, data: carts[1] });
});

// POST add to cart
router.post('/', (req, res) => {
    const { productId, quantity } = req.body;
    carts[1].push({ productId, quantity });
    res.status(201).json({ success: true, data: carts[1] });
});

// DELETE from cart
router.delete('/:productId', (req, res) => {
    carts[1] = carts[1].filter(i => i.productId !== parseInt(req.params.productId));
    res.json({ success: true, data: carts[1] });
});

module.exports = router;
```

### 5. routes/orders.js
```javascript
const express = require('express');
const router = express.Router();

let orders = [];

// POST place order
router.post('/', (req, res) => {
    const { items, shippingAddress } = req.body;
    const order = { id: orders.length + 1, items, shippingAddress, status: 'confirmed' };
    orders.push(order);
    res.status(201).json({ success: true, data: order });
});

// GET orders
router.get('/', (req, res) => {
    res.json({ success: true, data: orders });
});

module.exports = router;
```

### 6. middleware/validator.js
```javascript
const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

module.exports = { validateUser: validate(userSchema) };
```

### 7. middleware/errorHandler.js
```javascript
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;
```

---

## Frontend Code

### 1. index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VOLT Energy | Power Your Life</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <div class="logo">VOLT<span>ENERGY</span></div>
        <ul class="nav-links">
            <li><a href="#hero">Home</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="login.html">Login</a></li>
        </ul>
        <div class="cart-icon">Cart <span id="cart-count">0</span></div>
    </nav>
    
    <section id="hero" class="hero">
        <h1>UNLEASH YOUR <span>POWER</span></h1>
        <p>Premium energy drinks for peak performance</p>
        <a href="#products" class="btn-primary">Shop Now</a>
    </section>
    
    <section id="products">
        <h2>Our Products</h2>
        <div class="product-grid" id="product-grid"></div>
    </section>
    
    <script src="script.js"></script>
</body>
</html>
```

### 2. script.js (API Integration)
```javascript
const API_BASE = 'http://localhost:3000/api';
let cart = [];

// Load products from API
async function loadProducts() {
    const response = await fetch(`${API_BASE}/products`);
    const result = await response.json();
    displayProducts(result.data);
}

function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="images/${product.image || 'volt-original.svg'}" alt="${product.name}" style="height: 100%; width: auto;">
            </div>
            <!-- ... info ... -->
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', loadProducts);
```

---

# Screenshots

### 1. Website Homepage
![Homepage](screenshots/01_homepage.png)

### 2. Products Section
![Products](screenshots/02_products.png)

### 3. Login Page
![Login](screenshots/03_login.png)

### 4. API Response - GET /products
![API Products](screenshots/04_api_products.png)

### 5. API Root
![API Root](screenshots/05_api_root.png)





