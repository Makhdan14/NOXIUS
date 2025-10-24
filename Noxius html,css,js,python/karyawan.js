let karyawanData = JSON.parse(localStorage.getItem('karyawanData')) || [];
let shiftData = JSON.parse(localStorage.getItem('shiftData')) || [];
let payrollData = JSON.parse(localStorage.getItem('payrollData')) || [];
let karyawanList = JSON.parse(localStorage.getItem('karyawanList')) || [
    { nama: 'Budi Santoso', availability: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] },
    { nama: 'Ani Wijaya', availability: ['Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] },
    { nama: 'Candra Kusuma', availability: ['Senin', 'Rabu', 'Jumat', 'Minggu'] }
];

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const shiftForm = document.getElementById('shiftForm');
const payrollForm = document.getElementById('payrollForm');
const evaluasiForm = document.getElementById('evaluasiForm');

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

shiftForm.addEventListener('submit', (e) => {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        e.preventDefault();
        return;
    }
    e.preventDefault();
    const nama = document.getElementById('namaKaryawan').value.trim();
    const tanggal = document.getElementById('tanggalShift').value;
    const shiftType = document.getElementById('shiftType').value;

    if (!nama || !tanggal || !shiftType) {
        alert('Isi semua field dengan benar!');
        return;
    }

    shiftData.push({ nama, tanggal, shiftType });
    localStorage.setItem('shiftData', JSON.stringify(shiftData));

    alert('Shift ditambahkan!');
    renderShiftList();
    shiftForm.reset();
});

function renderShiftList() {
    const list = document.getElementById('shiftList');
    if (shiftData.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #6c757d;">Belum ada jadwal shift. Tambahkan yang pertama!</p>';
        return;
    }
    list.innerHTML = shiftData.map(item => `
        <div class="list-item">
            <span><strong>${item.nama}</strong> - ${item.tanggal}: ${item.shiftType}</span>
        </div>
    `).join('');
}

payrollForm.addEventListener('submit', (e) => {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        e.preventDefault();
        return;
    }
    e.preventDefault();
    const nama = document.getElementById('namaPayroll').value.trim();
    const bulan = document.getElementById('bulanPayroll').value;
    const lemburJam = parseInt(document.getElementById('lemburJam').value) || 0;

    const shiftsBulanIni = shiftData.filter(s =>
        s.nama.toLowerCase() === nama.toLowerCase() &&
        new Date(s.tanggal).toISOString().slice(0, 7) === bulan
    );
    const jumlahShift = shiftsBulanIni.length;
    const gajiDasar = jumlahShift * 400000;
    const gajiLembur = lemburJam * 50000;
    const gajiSebelumPajak = gajiDasar + gajiLembur;
    const pajak = gajiSebelumPajak * 0.05; // Pajak 5%
    const totalGaji = gajiSebelumPajak - pajak;

    payrollData.push({ nama, bulan, jumlahShift, lemburJam, gajiDasar, gajiLembur, gajiSebelumPajak, pajak, totalGaji });
    localStorage.setItem('payrollData', JSON.stringify(payrollData));

    document.getElementById('payrollResult').innerHTML = `
        <h3>Total Gaji ${nama} (${bulan}): Rp ${totalGaji.toLocaleString()}</h3>
        <p>Shift: ${jumlahShift} x Rp 400.000 = Rp ${gajiDasar.toLocaleString()}<br>
        Lembur: ${lemburJam} jam x Rp 50.000 = Rp ${gajiLembur.toLocaleString()}<br>
        Gaji Sebelum Pajak: Rp ${gajiSebelumPajak.toLocaleString()}<br>
        Pajak (5%): Rp ${pajak.toLocaleString()}</p>
    `;
    document.getElementById('payrollResult').classList.remove('hidden');

    alert('Gaji dihitung dan disimpan!');
    renderPayrollList();
    payrollForm.reset();
});

function renderPayrollList() {
    const list = document.getElementById('payrollList');
    if (payrollData.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #6c757d;">Belum ada data payroll. Hitung gaji karyawan!</p>';
        return;
    }
    list.innerHTML = payrollData.map(item => `
        <div class="list-item">
            <span><strong>${item.nama}</strong> (${item.bulan}): Rp ${item.totalGaji.toLocaleString()}</span>
        </div>
    `).join('');
}

evaluasiForm.addEventListener('submit', (e) => {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        e.preventDefault();
        return;
    }
    e.preventDefault();
    const nama = document.getElementById('namaEvaluasi').value.trim();
    const periode = document.getElementById('periode').value.trim();
    const rating = parseInt(document.getElementById('rating').value);
    const komentar = document.getElementById('komentar').value.trim();

    if (!nama || !periode || !rating) {
        alert('Isi nama, periode, dan rating! Komentar opsional.');
        return;
    }

    const existingIndex = karyawanData.findIndex(k => k.nama.toLowerCase() === nama.toLowerCase() && k.periode === periode);
    if (existingIndex >= 0) {
        karyawanData[existingIndex] = { nama, periode, rating, komentar };
    } else {
        karyawanData.push({ nama, periode, rating, komentar });
    }
    localStorage.setItem('karyawanData', JSON.stringify(karyawanData));

    alert('Evaluasi disimpan!');
    renderEvaluasiList();
    renderTimSummary();
    evaluasiForm.reset();
});

function renderEvaluasiList() {
    const list = document.getElementById('evaluasiList');
    if (karyawanData.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #6c757d;">Belum ada evaluasi karyawan. Tambahkan yang pertama!</p>';
        return;
    }
    list.innerHTML = karyawanData.map(item => `
        <div class="list-item">
            <span><strong>${item.nama}</strong> (${item.periode}) - Rating: ${item.rating}/5</span>
            <p>${item.komentar || 'Tidak ada komentar'}</p>
        </div>
    `).join('');
}

function renderTimSummary() {
    const summary = document.getElementById('timSummary');
    if (karyawanData.length === 0) {
        summary.innerHTML = '';
        return;
    }
    const totalRating = karyawanData.reduce((sum, k) => sum + k.rating, 0);
    const avgRating = (totalRating / karyawanData.length).toFixed(1);
    summary.innerHTML = `<p>Rata-rata Rating Tim: ${avgRating}/5 (${karyawanData.length} evaluasi)</p>`;
}

renderShiftList();
renderPayrollList();
renderEvaluasiList();
renderTimSummary();
renderDashboardPerforma();

const autoAssignBtn = document.getElementById('autoAssignBtn');
autoAssignBtn.addEventListener('click', () => {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        return;
    }
    autoAssignShifts();
});

const hapusShiftAllBtn = document.getElementById('hapusShiftAll');
hapusShiftAllBtn.addEventListener('click', () => {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        return;
    }
    if (confirm('Apakah Anda yakin ingin menghapus semua data shift?')) {
        shiftData = [];
        localStorage.setItem('shiftData', JSON.stringify(shiftData));
        renderShiftList();
        alert('Semua data shift telah dihapus.');
    }
});

const hapusPayrollAllBtn = document.getElementById('hapusPayrollAll');
hapusPayrollAllBtn.addEventListener('click', () => {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        return;
    }
    if (confirm('Apakah Anda yakin ingin menghapus semua data payroll?')) {
        payrollData = [];
        localStorage.setItem('payrollData', JSON.stringify(payrollData));
        renderPayrollList();
        alert('Semua data payroll telah dihapus.');
    }
});

const hapusEvaluasiAllBtn = document.getElementById('hapusEvaluasiAll');
hapusEvaluasiAllBtn.addEventListener('click', () => {
    if (!isLoggedIn()) {
        alert('anda harus login terlebih dahulu');
        return;
    }
    if (confirm('Apakah Anda yakin ingin menghapus semua data evaluasi?')) {
        karyawanData = [];
        localStorage.setItem('karyawanData', JSON.stringify(karyawanData));
        renderEvaluasiList();
        renderTimSummary();
        renderDashboardPerforma();
        alert('Semua data evaluasi telah dihapus.');
    }
});

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

function autoAssignShifts() {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
    const shiftsThisWeek = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' });
        const dateStr = date.toISOString().split('T')[0];

        // Assign shifts based on availability and avoid overwork
        const availableKaryawan = karyawanList.filter(k => k.availability.includes(dayName));
        const shiftsToday = ['Pagi (08:00-16:00, 8 jam)', 'Siang (12:00-20:00, 8 jam)', 'Malam (16:00-00:00, 8 jam)'];

        shiftsToday.forEach(shift => {
            const assigned = availableKaryawan.find(k => {
                const shiftsThisWeekForK = shiftsThisWeek.filter(s => s.nama === k.nama).length;
                return shiftsThisWeekForK < 5; // Max 5 shifts per week
            });
            if (assigned) {
                shiftsThisWeek.push({ nama: assigned.nama, tanggal: dateStr, shiftType: shift });
            }
        });
    }

    shiftData = shiftData.concat(shiftsThisWeek);
    localStorage.setItem('shiftData', JSON.stringify(shiftData));
    renderShiftList();
    alert('Shift otomatis ditambahkan untuk minggu ini!');
}

function calculateKPI(nama, periode) {
    // Produktivitas: dari penjualan (asumsi ada data penjualan)
    const penjualanData = JSON.parse(localStorage.getItem('penjualanData')) || [];
    const penjualanKaryawan = penjualanData.filter(p => p.karyawan === nama && p.periode === periode);
    const produktivitas = penjualanKaryawan.reduce((sum, p) => sum + p.jumlah, 0);

    // Absensi: dari shift
    const shiftsKaryawan = shiftData.filter(s => s.nama.toLowerCase() === nama.toLowerCase());
    const absensi = shiftsKaryawan.length; // Jumlah shift sebagai proxy absensi

    return { produktivitas, absensi };
}

function renderDashboardPerforma() {
    const container = document.getElementById('chartContainer');
    if (karyawanData.length === 0) {
        container.innerHTML = '<p>Tidak ada data evaluasi untuk dashboard.</p>';
        return;
    }

    const labels = karyawanData.map(k => k.nama);
    const ratings = karyawanData.map(k => k.rating);
    const produktivitas = karyawanData.map(k => calculateKPI(k.nama, k.periode).produktivitas);
    const absensi = karyawanData.map(k => calculateKPI(k.nama, k.periode).absensi);

    container.innerHTML = `
        <canvas id="performaChart" width="400" height="200"></canvas>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
            const ctx = document.getElementById('performaChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ${JSON.stringify(labels)},
                    datasets: [
                        { label: 'Rating', data: ${JSON.stringify(ratings)}, backgroundColor: 'rgba(75, 192, 192, 0.2)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 },
                        { label: 'Produktivitas', data: ${JSON.stringify(produktivitas)}, backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1 },
                        { label: 'Absensi (Shift)', data: ${JSON.stringify(absensi)}, backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1 }
                    ]
                },
                options: { scales: { y: { beginAtZero: true } } }
            });
        </script>
    `;
}
