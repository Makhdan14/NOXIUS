// Global variables
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let cart = [];

// Load inventory from localStorage
function loadInventory() {
    inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    renderProducts();
}

// Render products in the product grid
function renderProducts() {
    const productList = document.getElementById('productList');
    const emptyMsg = document.getElementById('emptyProductMsg');

    if (inventory.length === 0) {
        productList.innerHTML = '';
        emptyMsg.classList.remove('hidden');
        return;
    }

    emptyMsg.classList.add('hidden');
    productList.innerHTML = inventory.map((item, index) => `
        <div class="product-card">
            <h3>${item.nama}</h3>
            <div class="price">Rp ${item.harga.toLocaleString()}</div>
            <div class="stock">Stok: ${item.stok}</div>
            <button onclick="addToCart(${index})" ${item.stok <= 0 ? 'disabled' : ''}>
                <i class="fas fa-plus"></i> Tambah
            </button>
        </div>
    `).join('');
}

// Add item to cart
function addToCart(productIndex) {
    const product = inventory[productIndex];
    if (!product || product.stok <= 0) return;

    const cartItem = cart.find(item => item.id === product.id);
    if (cartItem) {
        if (cartItem.quantity < product.stok) {
            cartItem.quantity++;
        } else {
            alert('Stok tidak mencukupi!');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            nama: product.nama,
            harga: product.harga,
            quantity: 1
        });
    }
    renderCart();
}

// Render cart items
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const emptyCartMsg = document.getElementById('emptyCartMsg');

    if (cart.length === 0) {
        cartItems.innerHTML = '';
        emptyCartMsg.classList.remove('hidden');
        updateTotals(0, 0, 0);
        return;
    }

    emptyCartMsg.classList.add('hidden');
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.nama}</h4>
                <div class="quantity">
                    <button onclick="decreaseQuantity(${item.id})">-</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
                    <button onclick="increaseQuantity(${item.id})">+</button>
                </div>
            </div>
            <div class="price">Rp ${(item.harga * item.quantity).toLocaleString()}</div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    calculateTotals();
}

// Increase quantity in cart
function increaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    const product = inventory.find(item => item.id == productId);
    if (cartItem && cartItem.quantity < product.stok) {
        cartItem.quantity++;
        renderCart();
    } else {
        alert('Stok tidak mencukupi!');
    }
}

// Update quantity in cart
function updateQuantity(productId, newQuantity) {
    const cartItem = cart.find(item => item.id === productId);
    const product = inventory.find(item => item.id == productId);
    const qty = parseInt(newQuantity);
    if (cartItem && qty > 0 && qty <= product.stok) {
        cartItem.quantity = qty;
        renderCart();
    } else if (qty > product.stok) {
        alert('Stok tidak mencukupi!');
        renderCart(); // Re-render to reset input
    } else if (qty <= 0) {
        removeFromCart(productId);
    }
}

// Decrease quantity in cart
function decreaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity--;
        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
        } else {
            renderCart();
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

// Calculate and update totals
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.harga * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% PPN
    const total = subtotal + tax;
    updateTotals(subtotal, tax, total);
}

// Update totals display
function updateTotals(subtotal, tax, total) {
    document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString()}`;
    document.getElementById('tax').textContent = `Rp ${tax.toLocaleString()}`;
    document.getElementById('total').textContent = `Rp ${total.toLocaleString()}`;
    document.getElementById('paymentTotal').textContent = `Rp ${total.toLocaleString()}`;
}

// Clear cart
function clearCart() {
    cart = [];
    renderCart();
}

// Show payment modal
function showPaymentModal() {
    if (cart.length === 0) {
        alert('Keranjang kosong! Tambahkan produk terlebih dahulu.');
        return;
    }
    document.getElementById('paymentModal').classList.remove('hidden');
    document.getElementById('cashReceived').value = '';
    document.getElementById('change').textContent = 'Rp 0';
    toggleCashReceivedField();
}

// Close payment modal
function closePaymentModal() {
    document.getElementById('paymentModal').classList.add('hidden');
}

// Toggle cash received field based on payment method
function toggleCashReceivedField() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const cashGroup = document.getElementById('cashReceivedGroup');
    if (paymentMethod === 'cash') {
        cashGroup.style.display = 'block';
    } else {
        cashGroup.style.display = 'none';
    }
}

// Calculate change
function calculateChange() {
    const cashReceived = parseFloat(document.getElementById('cashReceived').value) || 0;
    const total = cart.reduce((sum, item) => sum + (item.harga * item.quantity), 0) * 1.1;
    const change = cashReceived - total;
    document.getElementById('change').textContent = `Rp ${change.toLocaleString()}`;
    return change;
}

// Process payment
function processPayment(event) {
    event.preventDefault();
    const paymentMethod = document.getElementById('paymentMethod').value;
    const total = cart.reduce((sum, item) => sum + (item.harga * item.quantity), 0) * 1.1;

    if (paymentMethod === 'cash') {
        const change = calculateChange();
        if (change < 0) {
            alert('Uang yang diterima kurang!');
            return;
        }
    }

    // Update inventory
    cart.forEach(cartItem => {
        const product = inventory.find(item => item.id == cartItem.id);
        if (product) {
            product.stok -= cartItem.quantity;
        }
    });
    localStorage.setItem('inventory', JSON.stringify(inventory));

    // Generate receipt
    generateReceipt(paymentMethod);

    // Close payment modal and show receipt
    closePaymentModal();
    document.getElementById('receiptModal').classList.remove('hidden');

    // Clear cart
    clearCart();
    renderProducts();
}

// Generate receipt
function generateReceipt(paymentMethod) {
    const subtotal = cart.reduce((sum, item) => sum + (item.harga * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    const now = new Date();
    const receiptNumber = 'RCP-' + now.getTime();

    let receiptContent = `
NOXIUS - Struk Pembelian
========================
No. Transaksi: ${receiptNumber}
Tanggal: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}

Barang:
`;

    cart.forEach(item => {
        receiptContent += `${item.nama} x${item.quantity} - Rp ${(item.harga * item.quantity).toLocaleString()}\n`;
    });

    receiptContent += `
------------------------
Subtotal: Rp ${subtotal.toLocaleString()}
PPN (10%): Rp ${tax.toLocaleString()}
Total: Rp ${total.toLocaleString()}
Metode Pembayaran: ${paymentMethod === 'cash' ? 'Tunai' : paymentMethod === 'card' ? 'Kartu' : 'Transfer'}

Terima kasih atas pembelian Anda!
========================
`;

    document.getElementById('receiptContent').textContent = receiptContent;
}

// Print receipt
function printReceipt() {
    const receiptContent = document.getElementById('receiptContent').textContent;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Struk Pembelian</title>
            <style>
                body { font-family: 'Courier New', monospace; font-size: 12px; }
                pre { white-space: pre-wrap; }
            </style>
        </head>
        <body>
            <pre>${receiptContent}</pre>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Close receipt modal
function closeReceiptModal() {
    document.getElementById('receiptModal').classList.add('hidden');
}

// Sidebar functionality
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('active');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadInventory();

    // Sidebar
    document.getElementById('hamburger').addEventListener('click', toggleSidebar);
    document.getElementById('closeSidebar').addEventListener('click', closeSidebar);

    // Cart actions
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    document.getElementById('checkoutBtn').addEventListener('click', showPaymentModal);

    // Payment modal
    document.getElementById('closePaymentModal').addEventListener('click', closePaymentModal);
    document.getElementById('paymentMethod').addEventListener('change', toggleCashReceivedField);
    document.getElementById('cashReceived').addEventListener('input', calculateChange);
    document.getElementById('paymentForm').addEventListener('submit', processPayment);

    // Receipt modal
    document.getElementById('closeReceiptModal').addEventListener('click', closeReceiptModal);
    document.getElementById('printReceiptBtn').addEventListener('click', printReceipt);
});
