// Sidebar functionality
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const loginBtn = document.querySelector('.login-btn');
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

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function updateLoginStatus() {
    const username = localStorage.getItem('username');
    const usernameDisplay = document.getElementById('username-display');
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

function updateDashboardStats() {
    const inventoryData = JSON.parse(localStorage.getItem('inventory')) || [];
    const karyawanList = JSON.parse(localStorage.getItem('karyawanList')) || [
        { nama: 'Budi Santoso', availability: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] },
        { nama: 'Ani Wijaya', availability: ['Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] },
        { nama: 'Candra Kusuma', availability: ['Senin', 'Rabu', 'Jumat', 'Minggu'] }
    ];
    const labaData = JSON.parse(localStorage.getItem('labaData')) || [];
    const transaksiData = JSON.parse(localStorage.getItem('transaksiData')) || [];

    const totalInventory = inventoryData.length;
    document.getElementById('total-inventory').textContent = totalInventory;

    const totalEmployees = karyawanList.length;
    document.getElementById('total-employees').textContent = totalEmployees;

    const totalSales = transaksiData.reduce((sum, t) => sum + t.total, 0);
    document.getElementById('total-sales').textContent = `Rp ${totalSales.toLocaleString('id-ID')}`;

    const netProfit = labaData.reduce((sum, item) => sum + (item.laba || 0), 0);
    document.getElementById('net-profit').textContent = `Rp ${netProfit.toLocaleString('id-ID')}`;

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todaySales = transaksiData
        .filter(t => new Date(t.tanggal) >= startOfDay)
        .reduce((sum, t) => sum + t.total, 0);
    document.getElementById('sales-today').textContent = `Rp ${todaySales.toLocaleString('id-ID')}`;
}

function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

updateLoginStatus();
updateDashboardStats();
setActiveLink();

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        navLinks.forEach(l => l.classList.remove('active'));
        e.target.closest('a').classList.add('active');
    });
});

loginBtn.addEventListener('click', (e) => {
    if (isLoggedIn()) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        updateLoginStatus();
        alert('Logged out successfully.');
    }
});
