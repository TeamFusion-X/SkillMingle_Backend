const socket = io()

// import io from 'socket.io-client';

// const socket = io('http://localhost:3000');
let name = "ar";
let roomid = 1;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')

// do {
//     name = prompt('Please enter your name: ');
//     room = prompt('Please enter your roomid: ');
// } while(!name)


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



