const feathers = require('@feathersjs/feathers');
const app = feathers();

// A messages service that allows
// the creation of new and return
// of all existing messages
class MessageService {
    constructor() {
        this.messages = [];
    }

    async find () {
        // Return all of the current messages
        return this.messages;
    }

    async create(data) {
        // The new message is the data mergeed with a unique identifier
        // using the length of the messages array since is changes whenever
        // we add a new message
        const message = {
            id: this.messages.length,
            text: data.text
        }

        // Add the new message to the list
        this.messages.push(message);

        return message;
    }

}

// Register the message service on the Teathers application
app.use('messages', new MessageService());

// Log every time a new message has been created
app.service('messages').on('created', message => {
    console.log('A new message has been created', message);
});

// A function that creates new messages and then logs
// all existing messages
const main = async () => {
    // Create a new message on our message service
    await app.service('messages').create({
        text: 'Hello World from within the Feathers app'
    });

    // Create another message
    await app.service('messages').create({
        text: 'Hello World from within the Feathers app'
    });

    // Find all existing messages
    const messages = await app.service('messages').find();
    console.log('All messages', messages);
    
};

main();