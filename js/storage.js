let loginAttempts = 0;
const maxAttempts = 5;
const lockoutTime = 30000; // 30 segundos

function saveUserData(username, password, email) {
    // Cifrar la contraseña antes de guardarla
    const encryptedPassword = CryptoJS.SHA256(password).toString();

    const userData = { username, password: encryptedPassword, email };
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verificar si el usuario ya existe
    if (users.some(user => user.username === username)) {
        alert("El usuario ya existe.");
        return;
    }

    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));

    alert("Registro exitoso!");
    window.location.href = 'index.html';
}

function loginUser(username, password) {
    if (loginAttempts >= maxAttempts) {
        alert('Demasiados intentos fallidos. Por favor, espera un momento antes de intentar nuevamente.');
        return;
    }

    const encryptedPassword = CryptoJS.SHA256(password).toString();
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.username === username && user.password === encryptedPassword);
    
    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify({ username: user.username, email: user.email }));
        window.location.href = 'home.html';
    } else {
        loginAttempts++;
        alert('Usuario o contraseña incorrectos.');
        if (loginAttempts >= maxAttempts) {
            setTimeout(() => {
                loginAttempts = 0;
            }, lockoutTime);
        }
    }
}

function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser')) || null;
}

function logoutUser() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}