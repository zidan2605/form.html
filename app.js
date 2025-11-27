// Ambil semua elemen yang dibutuhkan
const form = document.getElementById('registrationForm');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const strengthBar = document.getElementById('passwordStrengthBar');
const photoInput = document.getElementById('photo');
const fileName = document.getElementById('fileName');
const togglePasswordBtn = document.getElementById('togglePassword');
const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');

// ==================== PASSWORD STRENGTH CHECKER ====================
password.addEventListener('input', function() {
    const value = this.value;
    const strength = calculatePasswordStrength(value);
    
    strengthBar.className = 'password-strength-bar';
    if (strength >= 80) {
        strengthBar.classList.add('strength-strong');
    } else if (strength >= 50) {
        strengthBar.classList.add('strength-medium');
    } else if (strength > 0) {
        strengthBar.classList.add('strength-weak');
    } else {
        strengthBar.style.width = '0%';
    }
});

// Fungsi untuk menghitung kekuatan password
function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[^a-zA-Z\d]/.test(password)) strength += 10;
    return strength;
}

// ==================== TOGGLE PASSWORD VISIBILITY ====================
togglePasswordBtn.addEventListener('click', function() {
    togglePasswordVisibility(password);
});

toggleConfirmPasswordBtn.addEventListener('click', function() {
    togglePasswordVisibility(confirmPassword);
});

function togglePasswordVisibility(field) {
    if (field.type === 'password') {
        field.type = 'text';
    } else {
        field.type = 'password';
    }
}

// ==================== FILE UPLOAD HANDLER ====================
photoInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const file = this.files[0];
        const fileSize = (file.size / 1024 / 1024).toFixed(2); // MB
        
        if (fileSize > 5) {
            alert('Ukuran file maksimal 5MB');
            this.value = '';
            fileName.textContent = '';
            return;
        }
        
        fileName.textContent = `✓ ${file.name} (${fileSize} MB)`;
    } else {
        fileName.textContent = '';
    }
});

// ==================== FORM VALIDATION ====================
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;

    // Validasi Nama Lengkap
    const fullName = document.getElementById('fullName');
    if (fullName.value.trim() === '') {
        showError('fullName', 'fullNameError');
        isValid = false;
    } else {
        hideError('fullName', 'fullNameError');
    }

    // Validasi Email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        showError('email', 'emailError');
        isValid = false;
    } else {
        hideError('email', 'emailError');
    }

    // Validasi Nomor Telepon
    const phone = document.getElementById('phone');
    const phoneRegex = /^08\d{8,11}$/;
    if (!phoneRegex.test(phone.value)) {
        showError('phone', 'phoneError');
        isValid = false;
    } else {
        hideError('phone', 'phoneError');
    }

    // Validasi Tanggal Lahir
    const birthDate = document.getElementById('birthDate');
    if (birthDate.value === '') {
        showError('birthDate', 'birthDateError');
        isValid = false;
    } else {
        // Cek apakah umur minimal 17 tahun
        const today = new Date();
        const birth = new Date(birthDate.value);
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        if (age < 17) {
            showError('birthDate', 'birthDateError');
            document.getElementById('birthDateError').textContent = 'Usia minimal 17 tahun';
            isValid = false;
        } else {
            hideError('birthDate', 'birthDateError');
            document.getElementById('birthDateError').textContent = 'Tanggal lahir harus diisi';
        }
    }

    // Validasi Jenis Kelamin
    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
        showError('male', 'genderError');
        isValid = false;
    } else {
        hideError('male', 'genderError');
    }

    // Validasi Alamat
    const address = document.getElementById('address');
    if (address.value.trim() === '') {
        showError('address', 'addressError');
        isValid = false;
    } else {
        hideError('address', 'addressError');
    }

    // Validasi Kota
    const city = document.getElementById('city');
    if (city.value === '') {
        showError('city', 'cityError');
        isValid = false;
    } else {
        hideError('city', 'cityError');
    }

    // Validasi Password
    const passwordField = document.getElementById('password');
    if (passwordField.value.length < 8) {
        showError('password', 'passwordError');
        isValid = false;
    } else {
        hideError('password', 'passwordError');
    }

    // Validasi Konfirmasi Password
    const confirmPasswordField = document.getElementById('confirmPassword');
    if (confirmPasswordField.value !== passwordField.value) {
        showError('confirmPassword', 'confirmPasswordError');
        isValid = false;
    } else {
        hideError('confirmPassword', 'confirmPasswordError');
    }

    // Validasi Terms and Conditions
    const terms = document.getElementById('terms');
    if (!terms.checked) {
        showError('terms', 'termsError');
        isValid = false;
    } else {
        hideError('terms', 'termsError');
    }

    // Jika semua validasi berhasil
    if (isValid) {
        handleSuccessfulSubmit();
    }
});

// ==================== HELPER FUNCTIONS ====================
function showError(fieldId, errorId) {
    document.getElementById(fieldId).classList.add('error');
    document.getElementById(errorId).classList.add('show');
}

function hideError(fieldId, errorId) {
    document.getElementById(fieldId).classList.remove('error');
    document.getElementById(errorId).classList.remove('show');
}

function handleSuccessfulSubmit() {
    // Tampilkan pesan sukses
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    
    // Kumpulkan data form
    const formData = new FormData(form);
    const data = {};
    
    console.log('=== DATA PENDAFTARAN ===');
    for (let [key, value] of formData.entries()) {
        if (key !== 'photo') {
            data[key] = value;
            console.log(`${key}: ${value}`);
        }
    }
    
    // Jika ada foto yang diupload
    if (photoInput.files[0]) {
        console.log(`Foto: ${photoInput.files[0].name}`);
    }
    
    console.log('========================');
    
    // Simpan ke localStorage (opsional)
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    registrations.push({
        ...data,
        registrationDate: new Date().toISOString()
    });
    localStorage.setItem('registrations', JSON.stringify(registrations));
    
    // Reset form setelah 2 detik
    setTimeout(() => {
        form.reset();
        strengthBar.style.width = '0%';
        strengthBar.className = 'password-strength-bar';
        fileName.textContent = '';
        successMessage.classList.remove('show');
        
        // Scroll ke atas
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

// ==================== REAL-TIME VALIDATION ====================
// Validasi real-time untuk email
document.getElementById('email').addEventListener('blur', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value && !emailRegex.test(this.value)) {
        showError('email', 'emailError');
    } else if (this.value) {
        hideError('email', 'emailError');
    }
});

// Validasi real-time untuk nomor telepon
document.getElementById('phone').addEventListener('blur', function() {
    const phoneRegex = /^08\d{8,11}$/;
    if (this.value && !phoneRegex.test(this.value)) {
        showError('phone', 'phoneError');
    } else if (this.value) {
        hideError('phone', 'phoneError');
    }
});

// Validasi real-time untuk konfirmasi password
document.getElementById('confirmPassword').addEventListener('input', function() {
    if (this.value && this.value !== password.value) {
        showError('confirmPassword', 'confirmPasswordError');
    } else if (this.value) {
        hideError('confirmPassword', 'confirmPasswordError');
    }
});
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter untuk submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        form.dispatchEvent(new Event('submit'));
    }
});
document.getElementById('phone').addEventListener('input', function(e) {
    // Hanya izinkan angka
    this.value = this.value.replace(/[^0-9]/g, '');
    
    // Maksimal 13 karakter
    if (this.value.length > 13) {
        this.value = this.value.slice(0, 13);
    }
});

console.log('Form Pendaftaran - Script loaded successfully! ✓');