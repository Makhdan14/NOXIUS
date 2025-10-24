let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

const addBtn = document.getElementById('addBtn');
const resetBtn = document.getElementById('resetBtn');
const formSection = document.getElementById('formSection');
const inventoryForm = document.getElementById('inventoryForm');
const inventoryList = document.getElementById('inventoryList');
const emptyMsg = document.getElementById('emptyMsg');
const formTitle = document.getElementById('formTitle');
const cancelBtn = document.getElementById('cancelBtn');

addBtn.addEventListener('click', () => {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        return;
    }
    showForm(null);
});

resetBtn.addEventListener('click', () => {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        return;
    }
    resetInventory();
});

inventoryForm.addEventListener('submit', (e) => {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        e.preventDefault();
        return;
    }
    e.preventDefault();
    saveInventory();
});

cancelBtn.addEventListener('click', () => hideForm());

function renderInventory() {
    if (inventory.length === 0) {
        emptyMsg.classList.remove('hidden');
        inventoryList.innerHTML = '';
        return;
    }
    emptyMsg.classList.add('hidden');

    inventoryList.innerHTML = inventory.map((item, index) => {
        const statusClass = item.stok < item.minStok ? 'stok-low' :
                           item.stok > item.maxStok ? 'stok-high' : 'stok-normal';
        const statusText = item.stok < item.minStok ? ' ( Tidak memenuhi minimal kapasitas )' :
                          item.stok > item.maxStok ? ' ( Melebihi Kapasitas )' : '';

        return `
            <div class="inventory-card">
                <h3>${item.nama}</h3>
                <div class="stok-info ${statusClass}">Stok: ${item.stok}${statusText}</div>
                <p>Batas Min: ${item.minStok} | Batas Max: ${item.maxStok}</p>
                <div>
                    <button class="btn-small btn-in" onclick="updateStokWithCheck(${item.id}, 'in')">
                        <i class="fas fa-plus"></i> Masuk (+)
                    </button>
                    <button class="btn-small btn-out" onclick="updateStokWithCheck(${item.id}, 'out')">
                        <i class="fas fa-minus"></i> Keluar (-)
                    </button>
                    <br>
                    <button class="btn-small btn-edit" onclick="showFormWithCheck(${item.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-small btn-delete" onclick="deleteItemWithCheck(${item.id})">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </div>
        `;
    }).join('');

    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function updateStokWithCheck(id, type) {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        return;
    }
    updateStok(id, type);
}

function deleteItemWithCheck(id) {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        return;
    }
    deleteItem(id);
}

function showFormWithCheck(id) {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        return;
    }
    showForm(id);
}

function updateStok(id, type) {
    const index = inventory.findIndex(item => item.id == id);
    if (index === -1) return;
    const item = inventory[index];
    let newStok = item.stok;

    if (type === 'in') {
        newStok += 1;
        if (newStok > item.maxStok) {
            alert(`Peringatan: Stok melebihi batas maksimum (${item.maxStok})!`);
        }
    } else if (type === 'out') {
        if (item.stok <= 0) {
            alert('Stok sudah habis! Tidak bisa kurangi lagi.');
            return;
        }
        newStok -= 1;
        if (newStok < item.minStok) {
            alert(`Peringatan: Stok hampir habis! Sisa: ${newStok}`);
        }
    }

    item.stok = Math.max(0, newStok);
    renderInventory();
}

function saveInventory() {
    const id = document.getElementById('editId').value;
    const nama = document.getElementById('nama').value.trim();
    const harga = parseFloat(document.getElementById('harga').value);
    const stok = parseInt(document.getElementById('stok').value);
    const minStok = parseInt(document.getElementById('minStok').value);
    const maxStok = parseInt(document.getElementById('maxStok').value);

    if (!nama || harga < 0 || stok < 0 || minStok < 0 || maxStok < 1 || minStok >= maxStok) {
        alert('Input tidak valid! Pastikan nama tidak kosong, harga >=0, stok >=0, dan min < max.');
        return;
    }

    if (id === '') {
        inventory.push({ id: Date.now() + Math.floor(Math.random() * 1000), nama, harga, stok, minStok, maxStok });
    } else {
        const index = inventory.findIndex(item => item.id == id);
        if (index !== -1) {
            inventory[index] = { id: parseInt(id), nama, harga, stok, minStok, maxStok };
        }
    }

    resetForm();
    hideForm();
    renderInventory();
}

function showForm(id) {
    formSection.classList.remove('hidden');

    if (id !== null) {
        formTitle.textContent = 'Edit Barang';
        const index = inventory.findIndex(item => item.id == id);
        if (index !== -1) {
            const item = inventory[index];
            document.getElementById('editId').value = item.id;
            document.getElementById('nama').value = item.nama;
            document.getElementById('harga').value = item.harga || 0;
            document.getElementById('stok').value = item.stok;
            document.getElementById('minStok').value = item.minStok;
            document.getElementById('maxStok').value = item.maxStok;
        }
    } else {
        formTitle.textContent = 'Tambah Barang Baru';
        resetForm();
    }
}

function hideForm() {
    formSection.classList.add('hidden');
    addBtn.style.display = 'block';
}

function resetForm() {
    inventoryForm.reset();
    document.getElementById('editId').value = '';
    document.getElementById('minStok').value = 10;
    document.getElementById('maxStok').value = 100;
}

function deleteItem(id) {
    if (confirm('Yakin hapus barang ini?')) {
        const index = inventory.findIndex(item => item.id == id);
        if (index !== -1) {
            inventory.splice(index, 1);
            renderInventory();
        }
    }
}

function resetInventory() {
    if (confirm('Apakah Anda yakin ingin mereset semua data inventory?')) {
        inventory = [];
        localStorage.setItem('inventory', JSON.stringify(inventory));
        renderInventory();
    }
}

renderInventory();

// Sidebar functionality
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const navLinks = document.querySelectorAll('.sidebar-menu a');

hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('open');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

setActiveLink();

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        navLinks.forEach(l => l.classList.remove('active'));
        e.target.closest('a').classList.add('active');
    });
});

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function updateLoginStatus() {
    const username = localStorage.getItem('username');
    const usernameDisplay = document.getElementById('username-display');
    const loginBtn = document.querySelector('.login-btn');
    if (isLoggedIn() && username) {
        loginBtn.textContent = 'Logout';
        loginBtn.href = '#';
        if (usernameDisplay) {
            usernameDisplay.textContent = `Welcome, ${username}`;
        }
    } else {
        loginBtn.textContent = 'Login / Register';
        loginBtn.href = 'login.html';
        if (usernameDisplay) {
            usernameDisplay.textContent = '';
        }
    }
}

updateLoginStatus();

const loginBtn = document.querySelector('.login-btn');
loginBtn.addEventListener('click', (e) => {
    if (isLoggedIn()) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        updateLoginStatus();
        alert('Logged out successfully.');
    }
});
