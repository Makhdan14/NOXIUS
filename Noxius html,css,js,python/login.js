document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const switchToLogin = document.getElementById('switchToLogin');

    loginBtn.addEventListener('click', function() {
        loginBtn.classList.add('active');
        signupBtn.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    });

    signupBtn.addEventListener('click', function() {
        signupBtn.classList.add('active');
        loginBtn.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    });

    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        loginBtn.click();
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (email === '' || password === '') {
            alert('Harap isi semua field!');
            return;
        }

        if (email && password) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', email);
            alert('Login berhasil! Mengarahkan ke dashboard...');
            window.location.href = 'dashboard.html';
        } else {
            alert('Email atau password salah!');
        }
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value.trim();
        const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();

        if (name === '' || email === '' || password === '' || confirmPassword === '') {
            alert('Harap isi semua field!');
            return;
        }

        if (password !== confirmPassword) {
            alert('Password dan konfirmasi password tidak cocok!');
            return;
        }

        if (password.length < 6) {
            alert('Password harus minimal 6 karakter!');
            return;
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', name);
        alert('Pendaftaran berhasil! Mengarahkan ke dashboard...');
        window.location.href = 'dashboard.html';
    });

    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#28a745';
            }
        });

        input.addEventListener('focus', function() {
            this.style.borderColor = '#5000ca';
        });
    });
});
