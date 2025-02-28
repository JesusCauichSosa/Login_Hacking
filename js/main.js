document.addEventListener('DOMContentLoaded', () => { 
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const logoutButton = document.getElementById('logoutButton');
    const messageForm = document.getElementById('messageForm');
    const clearAllMessagesButton = document.getElementById('clearAllMessagesButton');
    const clearMyMessagesButton = document.getElementById('clearMyMessagesButton');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            loginUser(username, password);
        });
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const email = document.getElementById('email').value;
            saveUserData(username, password, email);
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            logoutUser();
        });
    }

    if (messageForm) {
        messageForm.addEventListener('submit', handleMessageSubmit);
        displayMessages(); // Mostrar mensajes al cargar la página
    }

    if (clearAllMessagesButton) {
        clearAllMessagesButton.addEventListener('click', clearAllMessages);
    }

    if (clearMyMessagesButton) {
        clearMyMessagesButton.addEventListener('click', clearMyMessages);
    }

    verificarSesion();
});

function verificarSesion() {
    const currentUser = getCurrentUser();
    
    // Verificar si estamos en una página protegida (home.html)
    const isProtectedPage = window.location.pathname.includes('home.html');

    if (!currentUser && isProtectedPage) {
        alert("Debes iniciar sesión");
        window.location.href = "index.html";
    }
}

function logoutUser() {
    sessionStorage.removeItem('currentUser');
    alert("Sesión cerrada correctamente.");
    window.location.href = 'index.html';
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const message = document.getElementById('message-input').value;

    if (message.trim() === '') {
        alert('Por favor escribe un mensaje.');
        return;
    }

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')); // Corregido a sessionStorage

    if (!currentUser) {
        alert('Debes iniciar sesión para enviar mensajes.');
        return;
    }
    
    const messages = getMessages();
    messages.push({ user: sanitizeInput(currentUser.username), text: sanitizeInput(message) });
    localStorage.setItem('messages', JSON.stringify(messages));
    
    displayMessages();
    event.target.reset();
}

function displayMessages() {
    const messages = getMessages();
    const messagesDisplay = document.getElementById('messages-display');

    messagesDisplay.innerHTML = ''; // Limpiar antes de agregar nuevos mensajes

    if (messages.length === 0) {
        messagesDisplay.textContent = 'No hay mensajes, escribe uno.';
        return;
    }

    messages.forEach(msg => {
        const p = document.createElement('p');
        const strong = document.createElement('strong');

        // Evitar XSS sanitizando la entrada
        strong.textContent = msg.user + ': ';
        p.appendChild(strong);
        p.appendChild(document.createTextNode(msg.text));

        messagesDisplay.appendChild(p);
    });
}

// Función para sanitizar entradas y prevenir XSS
function sanitizeInput(input) {
    return input.replace(/[&<>"'\/]/g, function (char) {
        const charMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;'
        };
        return charMap[char] || char;
    });
}

function clearAllMessages(event){
    event.preventDefault();

    const messages = getMessages();
    if(messages.length === 0){
        alert('No hay mensajes para limpiar');
        return;
    }

    localStorage.removeItem('messages');
    displayMessages();
    alert('Mensajes eliminados');
}

function clearMyMessages(event) {
    event.preventDefault();
    const messages = getMessages();
    if (messages.length === 0) {
        alert('No hay mensajes para limpiar');
        return;
    }
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')); // Corregido a sessionStorage
    if (!currentUser) {
        alert('Debes iniciar sesión para eliminar tus mensajes.');
        return;
    }
    // Filtrar los mensajes que no pertenecen al usuario actual
    const remainingMessages = messages.filter(msg => msg.user !== currentUser.username);
    // Actualizar el localStorage con los mensajes restantes
    localStorage.setItem('messages', JSON.stringify(remainingMessages));

    // Mostrar los mensajes actualizados
    displayMessages();

    alert('Mensajes eliminados');
}

function getMessages() {
    return JSON.parse(localStorage.getItem('messages')) || [];
}