const API_BASE = 'http://localhost:3000/api';
let cart = [];

// Fetch products from backend
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const result = await response.json();
        
        if (result.success) {
            displayProducts(result.data);
        }
    } catch (error) {
        console.error("Error loading products:", error);
        // Fallback data for demo purposes
        const staticProducts = [
            { id: 1, name: 'VOLT Original', category: 'Classic', price: 149 },
            { id: 2, name: 'VOLT Zero', category: 'Sugar-Free', price: 159 },
            { id: 3, name: 'VOLT Tropical', category: 'Flavored', price: 169 }
        ];
        displayProducts(staticProducts);
    }
}

// Render products to DOM
function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="images/${product.image || 'volt-original.svg'}" alt="${product.name}">
            </div>
            <div class="product-info">
                <p class="category">${product.category}</p>
                <h3>${product.name}</h3>
                <p class="price">₹${product.price}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}, ${product.price})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Add item to cart
function addToCart(productId, price) {
    cart.push({ productId, price });
    updateCartCount();
    
    // Animate cart icon
    const cartIcon = document.getElementById('cart-icon');
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => cartIcon.style.transform = 'scale(1)', 200);
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

// Load on startup
document.addEventListener('DOMContentLoaded', loadProducts);
