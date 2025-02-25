document.addEventListener('DOMContentLoaded', () => { 
    const loginForm = document.getElementById('loginForm'); //get element by id
    const messageForm = document.getElementById('messageForm'); 
    const registrationForm = document.getElementById('registrationForm');
    const clearAllMessagesButton = document.getElementById('clearAllMessagesButton');
    const clearMyMessagesButton = document.getElementById('clearMyMessagesButton');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin); //add event listener a loginForm si existe. 
    }

    if (messageForm) {
        messageForm.addEventListener('submit', handleMessageSubmit);
        displayMessages();
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }

    if (clearAllMessagesButton) {
        clearAllMessagesButton.addEventListener('click', clearAllMessages);
    }

    if (clearMyMessagesButton) {
        clearMyMessagesButton.addEventListener('click', clearMyMessages);
    }

});

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const userData = JSON.parse(localStorage.getItem('users')) || []; //que es lo que hace el json.parse. r: convierte un string en un objeto
    const user = userData.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user)); //el json.stringify convierte un objeto en un string
        window.location.href = 'index.html';// redirecciona a la pagina index.html
    } else {
        alert('Invalid username or password.');
    }
}

function handleMessageSubmit(event) {
    event.preventDefault(); //que hace esto r: previene que el formulario se envie
    const message = document.getElementById('message-input').value;
    if(message === '') {
        alert('Please enter a message.');
        return;
    }
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert('You must be logged in to send a message.');
        return;
    }
    
    const messages = getMessages();
    messages.push({ user: currentUser.username, text: message });
    localStorage.setItem('messages', JSON.stringify(messages));
    displayMessages();
    event.target.reset();
}

function displayMessages() {
    const messages = getMessages();
    const messagesDisplay = document.getElementById('messages-display');
    if (messages.length === 0) {
        messagesDisplay.innerHTML = '<p>No hay mensajes, escribe uno.</p>';
    } else {
        messagesDisplay.innerHTML = messages.map(msg => `<p><strong>${msg.user}:</strong> ${msg.text}</p>`).join('');
    }
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

function clearAllMessages(event){
    event.preventDefault();

    const messages = getMessages();
    if(messages.length === 0){
        alert('There are no messages to clear');
        return;
    }

    localStorage.removeItem('messages');
    displayMessages();
    alert('Messages have been cleared');
}

function clearMyMessages(event){
    event.preventDefault();
    const messages = getMessages();
    if(messages.length === 0){
        alert('There are no messages to clear');
        return;
    }
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
     // Filtrar los mensajes que no pertenecen al usuario actual
    const remainingMessages = messages.filter(msg => msg.user !== currentUser.username);
       // Actualizar el localStorage con los mensajes restantes
    localStorage.setItem('messages', JSON.stringify(remainingMessages));

    // Mostrar los mensajes actualizados
    displayMessages();

    alert('Your messages have been cleared');
}

function getMessages() {
    return JSON.parse(localStorage.getItem('messages')) || [];
}