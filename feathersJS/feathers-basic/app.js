const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

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

// Creates an ExpressJS compatible Feathers application
const app = express(feathers());

// Parse HTTP JSON bodies
app.use(express.json());
// Pars URL-encoded params
app.use(express.urlencoded({ extended: true }));
// Host static files from the current folder
app.use(express.static(__dirname));
// Add REST API support
app.configure(express.rest());
// Configure Socket.io real-time APIs
app.configure(socketio());
// Register an in-memory messages service
app.use('/messages', new MessageService());
// Register a nicer error handler than the default Express one
app.use(express.errorHandler());

// Add a new real-time connection to the `everybody` channel
app.on('connection', connection => {
    app.channel('everybody').join(connection);
});
// Publish all events to the `everybody` channel
app.publish(data => app.channel('everybody'));

// Start the serever
app.listen(3030).on('listening', () => {
    console.log('Feathers server listening on localhost:3030')
});

// Creating a test message
// So the API doesn't look so empty
app.service('messages').create({
    text: 'Hello from the Server'
});