const socket = io()

const currentUrl = window.location.href; // Url retrieve
let room = currentUrl.split('/')[5];

let name = "Daddy"; // Change
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')

socket.emit('join-room', room);

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
});


function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    
    socket.emit('send-message', msg, room);

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

// Recieve messages 
socket.on('receive-message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom();
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}



