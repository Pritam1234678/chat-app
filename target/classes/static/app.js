let stompClient = null;
const MAX_FILE_SIZE_MB = 100
; // 10MB limit

function connect() {
    const username = document.getElementById('username').value.trim();
    if (username) {
        const socket = new SockJS('/chat');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            document.getElementById('username').disabled = true;
            document.querySelector('button[onclick="connect()"]').disabled = true;
            document.getElementById('leave-chat').disabled = false; // Enable Leave Chat button
            document.getElementById('message').disabled = false;
            document.querySelector('button[onclick="sendMessage()"]').disabled = false;
            document.getElementById('photo').disabled = false;
            stompClient.subscribe('/topic/public', function (message) {
                showMessage(JSON.parse(message.body));
            });
            stompClient.send("/app/chat.addUser", {}, JSON.stringify({
                sender: username,
                type: 'JOIN'
            }));
        }, function (error) {
            showError('Connection failed: ' + error);
        });
    } else {
        showError('Please enter a username.');
    }
}

function leaveChat() {
    const username = document.getElementById('username').value.trim();
    if (stompClient && username) {
        stompClient.send("/app/chat.removeUser", {}, JSON.stringify({
            sender: username,
            type: 'LEAVE'
        }));
        stompClient.disconnect(() => {
            stompClient = null;
            // Reset UI
            document.getElementById('username').disabled = false;
            document.getElementById('username').value = ''; // Clear username field
            document.querySelector('button[onclick="connect()"]').disabled = false;
            document.getElementById('leave-chat').disabled = true;
            document.getElementById('message').disabled = true;
            document.querySelector('button[onclick="sendMessage()"]').disabled = true;
            document.getElementById('photo').disabled = true;
            document.getElementById('message').value = '';
            showSuccess('You have left the chat successfully!');
        });
    } else {
        showError('Not connected to chat.');
    }
}

function sendMessage() {
    const messageContent = document.getElementById('message').value.trim();
    const username = document.getElementById('username').value.trim();
    if (messageContent && stompClient) {
        const chatMessage = {
            sender: username,
            content: messageContent,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        document.getElementById('message').value = '';
    } else if (!messageContent) {
        showError('Message cannot be empty.');
    }
}

function sendPhoto() {
    const fileInput = document.getElementById('photo');
    const file = fileInput.files[0];
    const username = document.getElementById('username').value.trim();
    if (file && username) {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            showError(`Photo exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', username);
        fetch('/uploadPhoto', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (!response.ok) throw new Error('Photo upload failed: ' + response.statusText);
            fileInput.value = '';
            showSuccess('Photo uploaded successfully!');
        }).catch(error => {
            showError('Failed to upload photo: ' + error.message);
        });
    } else {
        showError('Please select a photo.');
    }
}

function showMessage(message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('p-3', 'rounded-lg', 'mb-3', 'max-w-md', 'animate-fade-in');
    
    if (message.type === 'JOIN') {
        messageElement.classList.add('bg-green-100', 'text-green-800', 'mx-auto', 'text-center', 'dark:bg-green-900', 'dark:text-green-100');
        messageElement.textContent = `${message.sender} joined!`;
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('bg-red-100', 'text-red-800', 'mx-auto', 'text-center', 'dark:bg-red-900', 'dark:text-red-100');
        messageElement.textContent = `${message.sender} left!`;
    } else if (message.type === 'CHAT') {
        messageElement.classList.add('bg-blue-100', 'text-blue-800', 'dark:bg-blue-900', 'dark:text-blue-100');
        messageElement.textContent = `${message.sender}: ${message.content}`;
    } else if (message.type === 'PHOTO') {
        messageElement.classList.add('bg-gray-100', 'dark:bg-gray-700');
        const img = document.createElement('img');
        img.src = `data:image/jpeg;base64,${message.content}`;
        img.classList.add('max-w-full', 'rounded-lg', 'mt-2');
        messageElement.innerHTML = `<span class="block text-blue-800 dark:text-blue-100 font-semibold">${message.sender} sent a photo:</span>`;
        messageElement.appendChild(img);
    }
    
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showError(message) {
    const chatBox = document.getElementById('chat-box');
    const errorElement = document.createElement('div');
    errorElement.classList.add('p-3', 'rounded-lg', 'mb-3', 'bg-red-100', 'text-red-800', 'dark:bg-red-900', 'dark:text-red-100', 'mx-auto', 'text-center', 'animate-fade-in');
    errorElement.textContent = message;
    chatBox.appendChild(errorElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showSuccess(message) {
    const chatBox = document.getElementById('chat-box');
    const successElement = document.createElement('div');
    successElement.classList.add('p-3', 'rounded-lg', 'mb-3', 'bg-green-100', 'text-green-800', 'dark:bg-green-900', 'dark:text-green-100', 'mx-auto', 'text-center', 'animate-fade-in');
    successElement.textContent = message;
    chatBox.appendChild(successElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById('message').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});