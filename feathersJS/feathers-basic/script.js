// Set up socket.io
const socket = io('http://localhost:3030');
// Initilize a Feathers app
const app = feathers();

// Register socket.io to talk to our server
app.configure(feathers.socketio(socket));

// Form submission handler that sends a new message
async function sendMessage () {
    const messageInput = document.getElementById('message-text');

    // Create a new message with the input field value
    await app.service('messages').create({
        text: messageInput.value
    });

    messageInput.value = '';
}

// Renders a single message on the page
function addMessage (message) {
    const messageElement = document.createElement('p');
    messageElement.innerText = message.text;
    document.getElementById('main').appendChild(messageElement);
};

const main = async () => {
    // Find all existing messages
    const messages = await app.service('messages').find();

    // Add existing messages to the list
    messages.forEach(addMessage);

    // Add any newely created messages to the list in real-time
    app.service('messages').on('created', addMessage);
};

main();