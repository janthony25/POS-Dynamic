// Global Variables
let currentCategory = 'MAINS';
let menuItems = mainsDishes;
let cart = [];

// Menu Rendering Functions
function renderMenuItems() {
    const menuContainer = document.getElementById('menuItems');
    menuContainer.innerHTML = menuItems.map(item => {
        const hasDoublePrice = item.priceDouble !== undefined && item.priceDouble !== null;
        let priceDisplay;
        let addToCartButtons;

        if (hasDoublePrice) {
            priceDisplay = `
                <div class="mb-2">
                    <div>Single: $${item.priceSingle.toFixed(2)}</div>
                    <div>Double: $${item.priceDouble.toFixed(2)}</div>
                </div>
            `;
            addToCartButtons = `
                <div class="d-grid gap-2">
                    <button class="btn btn-dark" onclick="addToCart(${item.id}, 'single')">
                        Add Single
                    </button>
                    <button class="btn btn-dark" onclick="addToCart(${item.id}, 'double')">
                        Add Double
                    </button>
                </div>
            `;
        } else {
            const price = item.price || item.priceSingle;
            priceDisplay = `<p class="card-text fw-bold">$${price.toFixed(2)}</p>`;
            addToCartButtons = `
                <button class="btn btn-dark w-100" onclick="addToCart(${item.id}, 'regular')">
                    Add to Order
                </button>
            `;
        }

        return `
            <div class="col-3">
                <div class="card menu-item">
                    <img src="${item.image}" class="menu-image" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        ${priceDisplay}
                        ${addToCartButtons}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Cart Functions
function addToCart(itemId, size = 'regular') {
    const categoryArrays = [mainsDishes, breakfastDishes, desserts, drinks, containers];
    const item = categoryArrays.flatMap(arr => arr).find(item => item.id === itemId);

    if (!item) return;

    let price, itemName;

    if (size === 'double' && item.priceDouble) {
        price = item.priceDouble;
        itemName = `${item.name} (Double)`;
    } else if (size === 'single' && item.priceSingle) {
        price = item.priceSingle;
        itemName = `${item.name} (Single)`;
    } else {
        // For regular items
        price = item.price || item.priceSingle;
        itemName = item.name;
    }

    const cartItemId = `${itemId}-${size}`;
    const existingItem = cart.find(cartItem => cartItem.cartItemId === cartItemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            cartItemId,
            id: itemId,
            name: itemName,
            price: price,
            quantity: 1
        });
    }
    renderCart();
}

function updateQuantity(cartItemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(cartItemId);
        return;
    }
    const item = cart.find(item => item.cartItemId === cartItemId);
    if (item) {
        item.quantity = newQuantity;
        renderCart();
    }
}

function removeFromCart(cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    renderCart();
}

function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="cart-item-name h6 mb-0">${item.name}</span>
                <button class="delete-btn" onclick="removeFromCart('${item.cartItemId}')">×</button>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity('${item.cartItemId}', ${item.quantity - 1})">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.cartItemId}', ${item.quantity + 1})">+</button>
                </div>
                <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

// Category Functions
function switchCategory(category) {
    currentCategory = category;
    switch (category) {
        case 'MAINS':
            menuItems = mainsDishes;
            break;
        case 'BREAKFAST':
            menuItems = breakfastDishes;
            break;
        case 'DESSERT':
            menuItems = desserts;
            break;
        case 'DRINKS':
            menuItems = drinks;
            break;
        case 'CONTAINERS':
            menuItems = containers;
            break;
    }
    renderMenuItems();
    document.getElementById('categoryTitle').textContent = category;
}

// Order Completion
function completeOrder() {
    if (cart.length === 0) {
        alert('Please add items to your order first.');
        return;
    }
    cart = [];
    renderCart();
    alert('Order completed successfully!');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    // Initial render
    renderMenuItems();

    // Add category button listeners
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('mains'));
            this.classList.add('mains');
            switchCategory(this.textContent.trim());
        });
    });
});