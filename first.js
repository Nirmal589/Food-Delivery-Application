const cart = [];
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartSummary = document.getElementById('cart');
const cartToggle = document.querySelector('.cart-toggle');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutBtn = document.getElementById('checkout-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const categoryButtons = document.querySelectorAll('.category-btn');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
let activeCategory = 'all';

function formatPrice(price) {
    return Number(price).toFixed(2);
}

function updateCartDisplay() {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartCount.textContent = totalQuantity;
    cartTotalEl.textContent = formatPrice(totalPrice);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Aapka cart abhi khali hai.</p>';
        return;
    }

    cartItemsContainer.innerHTML = cart
        .map(item => `
            <div class="cart-item" data-name="${item.name}">
                <div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-qty">Quantity: ${item.quantity}</div>
                </div>
                <div>
                    <div class="cart-item-price">₹${formatPrice(item.price * item.quantity)}</div>
                    <button class="remove-item" data-name="${item.name}">Remove</button>
                </div>
            </div>
        `)
        .join('');
}

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartDisplay();
}

function removeFromCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        cart.splice(index, 1);
    }
    updateCartDisplay();
}

function clearCart() {
    cart.length = 0;
    updateCartDisplay();
}

function filterMenu(query = '') {
    const searchTerm = query.trim().toLowerCase();

    document.querySelectorAll('.food-card').forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const alt = card.querySelector('img').alt.toLowerCase();
        const priceText = card.querySelector('p').textContent.toLowerCase();
        const category = card.dataset.category ? card.dataset.category.toLowerCase() : '';
        const matchesSearch = searchTerm === '' || name.includes(searchTerm) || alt.includes(searchTerm) || priceText.includes(searchTerm);
        const matchesCategory = activeCategory === 'all' || category === activeCategory.toLowerCase();
        card.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
    });
}

cartToggle.addEventListener('click', () => {
    cartSummary.classList.toggle('hidden');
});

clearCartBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Cart pehle se khali hai.');
        return;
    }
    clearCart();
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Koi item add nahi hua hai.');
        return;
    }
    alert( `Order Confirmed! We have successfully received your order of ₹${cartTotalEl.textContent}\n will start preparing it soon.\nThank you for choosing us!`);
    clearCart();
});

document.querySelectorAll('.food-card').forEach(card => {
    const name = card.querySelector('h3').textContent.trim();
    const priceText = card.querySelector('p').textContent.replace(/[₹,]/g, '').trim();
    const price = Number(priceText) || 0;
    const button = card.querySelector('.buy-btn');

    button.addEventListener('click', () => {
        addToCart({ name, price });
    });
});

cartItemsContainer.addEventListener('click', event => {
    if (event.target.classList.contains('remove-item')) {
        const name = event.target.dataset.name;
        removeFromCart(name);
    }
});

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        activeCategory = button.dataset.category || 'all';
        categoryButtons.forEach(btn => btn.classList.toggle('active', btn === button));
        filterMenu(searchInput.value);
    });
});

searchBtn.addEventListener('click', () => {
    filterMenu(searchInput.value);
});

searchInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        filterMenu(searchInput.value);
    }
});

mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

updateCartDisplay();
