let labaData = JSON.parse(localStorage.getItem('labaData')) || [];
let kasData = JSON.parse(localStorage.getItem('kasData')) || [];

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const labaForm = document.getElementById('labaForm');
const kasForm = document.getElementById('kasForm');
const generatePrediksi = document.getElementById('generatePrediksi');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!isLoggedIn()) {
            alert('anda harus login terlebih dahulu');
            return;
        }
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.add('hidden'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.remove('hidden');
    });
});

labaForm.addEventListener('submit', (e) => {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        e.preventDefault();
        return;
    }
    e.preventDefault();
    const bulan = document.getElementById('bulan').value;
    const pendapatan = parseFloat(document.getElementById('pendapatan').value);
    const biaya = parseFloat(document.getElementById('biaya').value);
    const laba = pendapatan - biaya;

    labaData.push({ bulan, pendapatan, biaya, laba });
    localStorage.setItem('labaData', JSON.stringify(labaData));

    const labaValue = document.getElementById('labaValue');
    const labaDesc = document.getElementById('labaDesc');
    labaValue.textContent = `Rp ${laba.toLocaleString()}`;
    labaDesc.textContent = laba > 0 ? 'Laba!' : laba < 0 ? 'Rugi!' : 'Seimbang';
    labaDesc.style.color = laba > 0 ? 'green' : laba < 0 ? 'red' : 'orange';
    document.getElementById('labaResult').classList.remove('hidden');

    renderLabaList();
    labaForm.reset();
});

function renderLabaList() {
    const list = document.getElementById('labaList');
    list.innerHTML = labaData.map(item => `
        <div class="list-item">
            <span>${item.bulan}: Pendapatan Rp ${item.pendapatan.toLocaleString()}, Biaya Rp ${item.biaya.toLocaleString()}</span>
            <strong>${item.laba > 0 ? '+' : ''}Rp ${item.laba.toLocaleString()}</strong>
        </div>
    `).join('');
}

let balance = 0;
kasForm.addEventListener('submit', (e) => {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        e.preventDefault();
        return;
    }
    e.preventDefault();
    const tanggal = document.getElementById('tanggal').value;
    const cashIn = parseFloat(document.getElementById('cashIn').value) || 0;
    const cashOut = parseFloat(document.getElementById('cashOut').value) || 0;
    const net = cashIn - cashOut;

    kasData.push({ tanggal, cashIn, cashOut, net });
    balance += net;
    localStorage.setItem('kasData', JSON.stringify(kasData));
    localStorage.setItem('balance', balance);

    document.getElementById('kasBalance').textContent = `Balance Saat Ini: Rp ${balance.toLocaleString()}`;
    renderKasList();
    kasForm.reset();
});

function renderKasList() {
    const list = document.getElementById('kasList');
    list.innerHTML = kasData.map(item => `
        <div class="list-item">
            <span>${item.tanggal}: In Rp ${item.cashIn.toLocaleString()}, Out Rp ${item.cashOut.toLocaleString()}</span>
            <strong>${item.net > 0 ? '+' : ''}Rp ${item.net.toLocaleString()}</strong>
        </div>
    `).join('');
}

generatePrediksi.addEventListener('click', () => {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        return;
    }
    if (labaData.length < 3) {
        alert('Tambahkan minimal 3 data laba rugi untuk prediksi akurat!');
        return;
    }
    const recent = labaData.slice(-3).map(d => d.laba);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const growth = (recent[recent.length - 1] - recent[0]) / recent[0] || 0;
    const prediksi = avg * (1 + growth);

    document.getElementById('prediksiValue').textContent = `Rp ${prediksi.toLocaleString()}`;
    document.getElementById('prediksiDesc').textContent = `Berdasarkan tren: ${growth > 0 ? 'Naik' : 'Turun'} ${(growth * 100).toFixed(1)}%`;
    document.getElementById('prediksiResult').classList.remove('hidden');
});

const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', () => {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        return;
    }
    if (confirm('Apakah Anda yakin ingin menghapus semua data?')) {
        labaData = [];
        kasData = [];
        balance = 0;
        localStorage.removeItem('labaData');
        localStorage.removeItem('kasData');
        localStorage.removeItem('balance');
        document.getElementById('kasBalance').textContent = `Balance Saat Ini: Rp 0`;
        renderLabaList();
        renderKasList();
        document.getElementById('labaResult').classList.add('hidden');
        document.getElementById('prediksiResult').classList.add('hidden');
    }
});

balance = parseFloat(localStorage.getItem('balance')) || 0;
document.getElementById('kasBalance').textContent = `Balance Saat Ini: Rp ${balance.toLocaleString()}`;
renderLabaList();
renderKasList();
updateInventoryValue();

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

function updateInventoryValue() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const totalValue = inventory.reduce((sum, item) => {
        const harga = item.harga || 0;
        return sum + (harga * item.stok);
    }, 0);
    document.getElementById('inventoryTotal').textContent = `Rp ${totalValue.toLocaleString()}`;
}

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
