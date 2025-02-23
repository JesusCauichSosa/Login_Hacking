document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageForm = document.getElementById('messageForm');
    const registrationForm = document.getElementById('registrationForm');
    const messagesDisplay = document.getElementById('messages-display');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (messageForm) {
        messageForm.addEventListener('submit', handleMessageSubmit);
        displayMessages();
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }
});

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const userData = JSON.parse(localStorage.getItem('users')) || [];
    const user = userData.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password.');
    }
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const message = document.getElementById('message-input').value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert('You must be logged in to send a message.');
        return;
    }

    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push({ user: currentUser.username, text: message });
    localStorage.setItem('messages', JSON.stringify(messages));
    displayMessages();
    event.target.reset();
}

function displayMessages() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const messagesDisplay = document.getElementById('messages-display');
    messagesDisplay.innerHTML = messages.map(msg => `<p><strong>${msg.user}:</strong> ${msg.text}</p>`).join('');
}

function handleRegistration(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    saveUserData(username, password, email);
    alert('Registration successful!');
    window.location.href = 'login.html';
}