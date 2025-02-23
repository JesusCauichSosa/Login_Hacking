function saveUserData(username, password, email) {
    const userData = { username, password, email };
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
}

function getUserData() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

function clearUserData() {
    localStorage.removeItem('user');
}